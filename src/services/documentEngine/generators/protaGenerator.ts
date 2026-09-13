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

export async function generatePROTA(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp, tp, cp } = context;

  const docChildren: (Paragraph | Table)[] = [];

  // 1. Header
  docChildren.push(
    ...createDocumentHeader('PROGRAM TAHUNAN (PROTA)', `${academicSetting.curriculum} — TAHUN AJARAN ${academicSetting.academicYear || '2025/2026'}`)
  );

  // 2. Identity Box
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Alokasi Waktu per Minggu', `: ${academicSetting.totalHoursPerWeek || 4} JP / Minggu`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // 3. Capaian Pembelajaran (CP) Singkat
  if (cp?.generalDescription) {
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

  // 4. Tabel Pemetaan Program Tahunan (Distribusi JP per TP)
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'B. Distribusi Alokasi Waktu Pembelajaran Tahunan',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const tableHeaderRow = new TableRow({
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

  // Build rows from ATP items
  const items = atp?.items && atp.items.length > 0 ? atp.items : [];
  let totalJpSum = 0;

  const tableDataRows = items.map((item, index) => {
    const jpVal = Number(item.jp) || 4;
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
        createTableDataCell(semesterLabel, 15, AlignmentType.CENTER),
      ],
    });
  });

  // Project / Cadangan / Asesmen Akhir row for realism
  const cadanganJp = 4;
  totalJpSum += cadanganJp;
  const cadanganRow = new TableRow({
    children: [
      createTableDataCell(`${items.length + 1}`, 6, AlignmentType.CENTER),
      createTableDataCell('-', 14, AlignmentType.CENTER),
      createTableDataCell('Cadangan / Asesmen Sumatif Akhir Semester & Penguatan Kokurikuler', 50),
      createTableDataCell(`${cadanganJp} JP`, 15, AlignmentType.CENTER, true),
      createTableDataCell(semesterLabel, 15, AlignmentType.CENTER),
    ],
  });

  // Total JP Row
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
                text: 'JUMLAH ALOKASI WAKTU TAHUNAN: ',
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
    rows: [tableHeaderRow, ...tableDataRows, cadanganRow, totalRow],
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
