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

export async function generatePROMES(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp } = context;

  const docChildren: (Paragraph | Table)[] = [];

  const isSemesterGanjil =
    academicSetting.semester?.includes('1') || academicSetting.semester?.toLowerCase().includes('ganjil');
  const semesterLabel = isSemesterGanjil ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)';
  const months = isSemesterGanjil
    ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  // 1. Header
  docChildren.push(
    ...createDocumentHeader(
      'PROGRAM SEMESTER (PROMES)',
      `${academicSetting.curriculum} — ${semesterLabel.toUpperCase()} TP ${academicSetting.academicYear || '2025/2026'}`
    )
  );

  // 2. Identity Box
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Jumlah Jam per Minggu', `: ${academicSetting.totalHoursPerWeek || 4} JP`],
      ['Total Minggu Efektif', `: 18 Minggu Efektif`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // 3. Matrix Table
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'Matriks Distribusi Alokasi Waktu Pembelajaran Mingguan',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  // Top header row: No, Kode TP, Materi/Tujuan, Alokasi JP, followed by 6 month cells
  const monthHeaderCells = months.map((m) => createTableHeaderCell(m, 7));

  const tableHeaderRow1 = new TableRow({
    tableHeader: true,
    children: [
      createTableHeaderCell('No', 5),
      createTableHeaderCell('Kode TP', 10),
      createTableHeaderCell('Tujuan Pembelajaran & Ruang Lingkup Materi', 33, AlignmentType.LEFT),
      createTableHeaderCell('Alokasi JP', 10),
      ...monthHeaderCells,
    ],
  });

  const items = atp?.items && atp.items.length > 0 ? atp.items : [];
  let totalJp = 0;

  const dataRows = items.map((item, idx) => {
    const jp = Number(item.jp) || 4;
    totalJp += jp;

    // Distribute JP across the 6 months in a realistic staggered pattern
    const targetMonthIdx = idx % 6;
    const monthDistributionCells = months.map((_, mIdx) => {
      const isTarget = mIdx === targetMonthIdx;
      return createTableDataCell(isTarget ? `${jp}` : '-', 7, AlignmentType.CENTER);
    });

    return new TableRow({
      children: [
        createTableDataCell(`${idx + 1}`, 5, AlignmentType.CENTER),
        createTableDataCell(item.tpCode || `TP.${idx + 1}`, 10, AlignmentType.CENTER, true),
        new TableCell({
          width: { size: 33, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: item.tpStatement, size: 19, font: 'Arial' }),
                item.materialScope
                  ? new TextRun({ text: `\nMateri: ${item.materialScope}`, italics: true, size: 18, color: '475569' })
                  : new TextRun({ text: '' }),
              ],
            }),
          ],
        }),
        createTableDataCell(`${jp} JP`, 10, AlignmentType.CENTER, true),
        ...monthDistributionCells,
      ],
    });
  });

  // Asesmen Sumatif & Remedial Row
  const evaluasiJp = 4;
  totalJp += evaluasiJp;
  const evaluasiMonthCells = months.map((_, mIdx) =>
    createTableDataCell(mIdx === 5 ? `${evaluasiJp}` : '-', 7, AlignmentType.CENTER)
  );

  const evaluasiRow = new TableRow({
    children: [
      createTableDataCell(`${items.length + 1}`, 5, AlignmentType.CENTER),
      createTableDataCell('-', 10, AlignmentType.CENTER),
      createTableDataCell('Asesmen Sumatif Akhir Semester & Tindak Lanjut Remedial/Pengayaan', 33),
      createTableDataCell(`${evaluasiJp} JP`, 10, AlignmentType.CENTER, true),
      ...evaluasiMonthCells,
    ],
  });

  // Total Summary Row
  const totalMonthCells = months.map(() => createTableDataCell('-', 7, AlignmentType.CENTER));
  const totalRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 48, type: WidthType.PERCENTAGE },
        columnSpan: 3,
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'TOTAL JAM SEMESTER: ',
                bold: true,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),
        ],
      }),
      createTableDataCell(`${totalJp} JP`, 10, AlignmentType.CENTER, true),
      ...totalMonthCells,
    ],
  });

  const promesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableHeaderRow1, ...dataRows, evaluasiRow, totalRow],
  });

  docChildren.push(promesTable);

  // Keterangan Pelaksanaan
  docChildren.push(
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'Catatan Pelaksanaan:',
          bold: true,
          size: 19,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: '1. Angka pada kolom bulan menunjukkan alokasi jam pelajaran (JP) tatap muka per unit materi.\n2. Jadwal mingguan dapat disesuaikan dengan kalender pendidikan dan agenda khusus satuan pendidikan.',
          size: 18,
          font: 'Arial',
          italics: true,
          color: '475569',
        }),
      ],
    })
  );

  // 4. Signoff Block
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
  const fileName = `PROMES_${cleanSubject}_${cleanGrade}_${new Date().toISOString().slice(0, 10)}.docx`;

  if (!context.skipDownload) {
    saveAs(blob, fileName);
  }

  return {
    success: true,
    type: 'PROMES',
    title: 'Program Semester (PROMES)',
    fileName,
    blob,
    record: {
      id: `doc-promes-${Date.now()}`,
      type: 'PROMES',
      title: 'Program Semester (PROMES)',
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      fileName,
      academicSettingId: academicSetting.id,
      workspaceId: context.workspace?.id,
    },
  };
}
