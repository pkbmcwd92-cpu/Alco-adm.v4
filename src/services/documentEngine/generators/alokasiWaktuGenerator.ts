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

export async function generateAlokasiWaktu(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp, calendar, timeAllocations } = context;

  const docChildren: (Paragraph | Table)[] = [];

  // Header
  docChildren.push(...createDocumentHeader('DISTRIBUSI ALOKASI WAKTU PEMBELAJARAN', academicSetting.curriculum));

  // Metadata Table
  const totalATPJP = atp?.items?.reduce((acc, curr) => acc + (Number(curr.jp) || 0), 0) || 0;
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Tahun Ajaran / Semester', `: ${academicSetting.academicYear} / ${academicSetting.semester}`],
      ['Beban JP per Minggu', `: ${calendar?.jpPerWeek || academicSetting.totalHoursPerWeek || 4} JP`],
      ['Total Alokasi Waktu ATP', `: ${totalATPJP} Jam Pelajaran (JP)`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // Section: Distribusi Per Tujuan Pembelajaran
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'A. Pemetaan Waktu Berdasarkan Alur Tujuan Pembelajaran (ATP)',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const atpItems = atp?.items || [];
  const rows: TableRow[] = [
    new TableRow({
      children: [
        createTableHeaderCell('No', 8, AlignmentType.CENTER),
        createTableHeaderCell('Kode TP', 14, AlignmentType.CENTER),
        createTableHeaderCell('Tujuan Pembelajaran (TP) & Lingkup Materi', 50, AlignmentType.LEFT),
        createTableHeaderCell('Alokasi JP', 14, AlignmentType.CENTER),
        createTableHeaderCell('Distribusi Pekan Ke-', 14, AlignmentType.CENTER),
      ],
    }),
  ];

  let cumulativeWeeks = 0;
  const jpPerWeek = calendar?.jpPerWeek || Number(academicSetting.totalHoursPerWeek) || 4;

  if (atpItems.length === 0) {
    rows.push(
      new TableRow({
        children: [
          createTableDataCell('1', 8, AlignmentType.CENTER),
          createTableDataCell('TP 1', 14, AlignmentType.CENTER),
          createTableDataCell('Tujuan Pembelajaran Semester Aktif', 50),
          createTableDataCell(`${jpPerWeek * 2} JP`, 14, AlignmentType.CENTER),
          createTableDataCell('Pekan 1 - 2', 14, AlignmentType.CENTER),
        ],
      })
    );
  } else {
    atpItems.forEach((item, index) => {
      const itemJP = Number(item.jp) || jpPerWeek;
      const estimatedWeeks = Math.max(1, Math.ceil(itemJP / jpPerWeek));
      const startW = cumulativeWeeks + 1;
      const endW = cumulativeWeeks + estimatedWeeks;
      cumulativeWeeks = endW;

      const matchedAlloc = (timeAllocations || []).find((t) => t.tpId === item.id || t.atpItemId === item.id);
      const weekDisplay = matchedAlloc?.weekNumber ? `Pekan ${matchedAlloc.weekNumber}` : startW === endW ? `Pekan ${startW}` : `Pekan ${startW} - ${endW}`;

      rows.push(
        new TableRow({
          children: [
            createTableDataCell((index + 1).toString(), 8, AlignmentType.CENTER),
            createTableDataCell(item.tpCode || `TP.${index + 1}`, 14, AlignmentType.CENTER),
            createTableDataCell(
              `${item.tpStatement || '-'}\n• Materi: ${item.materialScope || '-'}`,
              50
            ),
            createTableDataCell(`${itemJP} JP`, 14, AlignmentType.CENTER),
            createTableDataCell(weekDisplay, 14, AlignmentType.CENTER),
          ],
        })
      );
    });
  }

  // Summary row
  rows.push(
    new TableRow({
      children: [
        createTableHeaderCell('', 8, AlignmentType.CENTER),
        createTableHeaderCell('TOTAL', 14, AlignmentType.CENTER),
        createTableHeaderCell('Total Beban Belajar Terstruktur Semester', 50, AlignmentType.LEFT),
        createTableHeaderCell(`${totalATPJP} JP`, 14, AlignmentType.CENTER),
        createTableHeaderCell(`± ${cumulativeWeeks} Pekan`, 14, AlignmentType.CENTER),
      ],
    })
  );

  docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  docChildren.push(new Paragraph({ spacing: { after: 240 } }));

  // Signatures
  docChildren.push(...createSignoffBlock(school, profile));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeSubject = (academicSetting.subject || 'Mapel').replace(/[^a-zA-Z0-9]/g, '_');
  const safeGrade = (academicSetting.grade || 'Kelas').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Alokasi_Waktu_${safeSubject}_${safeGrade}.docx`;

  if (!context.skipDownload) {
    saveAs(blob, fileName);
  }

  return {
    success: true,
    type: 'ALOKASI_WAKTU',
    title: `Alokasi Waktu - ${academicSetting.subject} ${academicSetting.grade}`,
    fileName,
    blob,
    record: {
      id: `doc-alokasi-${Date.now()}`,
      type: 'ALOKASI_WAKTU',
      title: `Alokasi Waktu - ${academicSetting.subject} ${academicSetting.grade}`,
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      fileName,
      academicSettingId: academicSetting.id,
      workspaceId: context.workspace?.id,
    },
  };
}
