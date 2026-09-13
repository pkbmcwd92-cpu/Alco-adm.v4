import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  HeadingLevel,
} from 'docx';
import saveAs from 'file-saver';
import { DocumentGenerationContext, GeneratedDocumentResult } from '../types';
import {
  createDocumentHeader,
  createIdentityMetadataTable,
  createTableHeaderCell,
  createTableDataCell,
  createSignoffBlock,
} from '../docxStyles';
import { getSubjectJP, calculateAvailableJP } from '../../jpEngine';

export async function generatePROTA(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp, tp, cp } = context;

  const docChildren: (Paragraph | Table)[] = [];

  // Look up verified official rule
  const officialRule = getSubjectJP({
    curriculum: academicSetting.curriculum,
    level: academicSetting.level,
    grade: academicSetting.grade,
    subject: academicSetting.subject,
  });

  const weeklyJP = academicSetting.subjectWeeklyJP || academicSetting.totalHoursPerWeek || officialRule.weeklyJP || 4;
  const annualJP = officialRule.annualJP || (weeklyJP * 36);

  // 1. Header
  docChildren.push(
    ...createDocumentHeader(
      'PROGRAM TAHUNAN (PROTA)',
      `${academicSetting.curriculum} — TAHUN AJARAN ${academicSetting.academicYear || '2026/2027'}`
    )
  );

  // 2. Identity Box with Provenance Metadata
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Alokasi Intrakurikuler per Minggu', `: ${weeklyJP} JP / Minggu`],
      ['Total Alokasi Waktu Tahunan', `: ${annualJP} JP / Tahun (36 Minggu Efektif Asumsi Tahunan)`],
      ['Dasar Regulasi Struktur Kurikulum', `: ${officialRule.regulation}`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // 3. Capaian Pembelajaran (CP) / SKL Singkat
  const isK13Curriculum = academicSetting.curriculumType === 'K13' || academicSetting.curriculum === 'Kurikulum 2013';

  if (isK13Curriculum) {
    if (context.k13Analysis?.items && context.k13Analysis.items.length > 0) {
      const sklText = context.k13Analysis.items[0].skl || 'Memiliki perilaku yang mencerminkan sikap orang beriman, berakhlak mulia, dan bertanggung jawab sesuai standar kompetensi lulusan.';
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: 'A. Standar Kompetensi Lulusan (SKL) & Kompetensi Inti (KI)',
              bold: true,
              size: 22,
              font: 'Arial',
              color: '1E3A8A',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: sklText,
              size: 19,
              font: 'Arial',
            }),
          ],
        })
      );
    }
  } else if (cp?.generalDescription) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: 'A. Capaian Pembelajaran (CP) Fase',
            bold: true,
            size: 22,
            font: 'Arial',
            color: '1E3A8A',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: cp.generalDescription,
            size: 19,
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // 4. Tabel Pemetaan Program Tahunan (Distribusi JP per TP / KD)
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'B. Distribusi Alokasi Waktu Pembelajaran Tahunan (Semester Ganjil & Genap)',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const tableHeaderRow = isK13Curriculum
    ? new TableRow({
        tableHeader: true,
        children: [
          createTableHeaderCell('No', 6),
          createTableHeaderCell('Kompetensi Dasar (KD)', 30, AlignmentType.LEFT),
          createTableHeaderCell('Materi Pokok & Kegiatan Pembelajaran', 34, AlignmentType.LEFT),
          createTableHeaderCell('Alokasi Waktu (JP)', 15),
          createTableHeaderCell('Semester', 15),
        ],
      })
    : new TableRow({
        tableHeader: true,
        children: [
          createTableHeaderCell('No', 6),
          createTableHeaderCell('Kode TP', 14),
          createTableHeaderCell('Tujuan Pembelajaran & Ruang Lingkup Materi', 50, AlignmentType.LEFT),
          createTableHeaderCell('Alokasi Waktu (JP)', 15),
          createTableHeaderCell('Semester', 15),
        ],
      });

  const isSemesterGanjil = academicSetting.semester?.includes('1') || academicSetting.semester?.toLowerCase().includes('ganjil');
  const semesterLabel = isSemesterGanjil ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)';

  let totalJpSum = 0;
  let tableDataRows: TableRow[] = [];

  if (isK13Curriculum) {
    const k13Items = context.k13Analysis?.items || [];
    tableDataRows = k13Items.map((item, index) => {
      const jpVal = weeklyJP;
      totalJpSum += jpVal;
      return new TableRow({
        children: [
          createTableDataCell(`${index + 1}`, 6, AlignmentType.CENTER),
          createTableDataCell(item.kd, 30, AlignmentType.LEFT, true),
          createTableDataCell(`${item.materi || '-'}\nKegiatan: ${item.kegiatan || '-'}`, 34, AlignmentType.LEFT),
          createTableDataCell(`${jpVal} JP`, 15, AlignmentType.CENTER, true),
          createTableDataCell(index < Math.ceil(k13Items.length / 2) ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)', 15, AlignmentType.CENTER),
        ],
      });
    });
  } else {
    // Build rows from ATP items
    const items = atp?.items && atp.items.length > 0 ? atp.items : [];

    tableDataRows = items.map((item, index) => {
      const jpVal = Number(item.jp) || weeklyJP;
      totalJpSum += jpVal;

      return new TableRow({
        children: [
          createTableDataCell(`${index + 1}`, 6, AlignmentType.CENTER),
          createTableDataCell(item.tpCode || `TP.${index + 1}`, 14, AlignmentType.CENTER, true),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.tpStatement, size: 19, font: 'Arial' }),
                  item.materialScope
                    ? new TextRun({ text: `\nMateri Pokok: ${item.materialScope}`, italics: true, size: 18, color: '475569' })
                    : new TextRun({ text: '' }),
                ],
              }),
            ],
          }),
          createTableDataCell(`${jpVal} JP`, 15, AlignmentType.CENTER, true),
          createTableDataCell(index < Math.ceil(items.length / 2) ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)', 15, AlignmentType.CENTER),
        ],
      });
    });
  }

  // Summary Row
  const totalRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        columnSpan: 3,
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'TOTAL ALOKASI WAKTU INTRARIKULER TAHUNAN: ',
                bold: true,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      createTableDataCell(`${totalJpSum} JP`, 15, AlignmentType.CENTER, true),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        children: [new Paragraph({})],
      }),
    ],
  });

  const protaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableHeaderRow, ...tableDataRows, totalRow],
  });

  docChildren.push(protaTable);

  // 5. Signoff
  docChildren.push(...createSignoffBlock(school, profile));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanSubject = (academicSetting.subject || 'Mapel').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanGrade = (academicSetting.grade || 'Kelas').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `PROTA_${cleanSubject}_${cleanGrade}_${new Date().toISOString().slice(0, 10)}.docx`;

  if (!context.skipDownload) {
    saveAs(blob, fileName);
  }

  return {
    success: true,
    type: 'PROTA',
    title: 'Program Tahunan (PROTA)',
    fileName,
    blob,
    record: {
      id: `doc-prota-${Date.now()}`,
      type: 'PROTA',
      title: 'Program Tahunan (PROTA)',
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      fileName,
      academicSettingId: academicSetting.id,
      workspaceId: context.workspace?.id,
    },
  };
}

