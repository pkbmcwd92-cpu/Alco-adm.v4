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
import { getSubjectJP } from '../../jpEngine';

export async function generateAlokasiWaktu(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp, calendar, timeAllocations, k13Analysis } = context;

  const docChildren: (Paragraph | Table)[] = [];

  const isK13Curriculum = academicSetting.curriculumType === 'K13' || academicSetting.curriculum === 'Kurikulum 2013';

  // Look up verified official rule
  const officialRule = getSubjectJP({
    curriculum: academicSetting.curriculum,
    level: academicSetting.level,
    grade: academicSetting.grade,
    subject: academicSetting.subject,
  });

  const weeklyJP = academicSetting.subjectWeeklyJP || calendar?.jpPerWeek || academicSetting.totalHoursPerWeek || officialRule.weeklyJP || 4;

  // Header
  docChildren.push(
    ...createDocumentHeader(
      'RINCIAN DISTRIBUSI ALOKASI WAKTU PEMBELAJARAN',
      `${academicSetting.curriculum} — TP ${academicSetting.academicYear || '2026/2027'}`
    )
  );

  // Metadata Table
  const totalATPJP = isK13Curriculum
    ? (k13Analysis?.items?.length || 0) * weeklyJP
    : atp?.items?.reduce((acc, curr) => acc + (Number(curr.jp) || 0), 0) || 0;

  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Tahun Ajaran / Semester', `: ${academicSetting.academicYear || '2026/2027'} / ${academicSetting.semester || 'Semester 1'}`],
      ['Beban JP Intrakurikuler per Minggu', `: ${weeklyJP} JP / Minggu`],
      ['Total Alokasi Pembelajaran Terdata', `: ${totalATPJP} Jam Pelajaran (JP)`],
      ['Dasar Regulasi Struktur', `: ${officialRule.regulation}`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // Section
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: isK13Curriculum
            ? 'A. Pemetaan Waktu Berdasarkan Analisis Kompetensi Dasar (KD)'
            : 'A. Pemetaan Waktu Berdasarkan Alur Tujuan Pembelajaran (ATP)',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const rows: TableRow[] = [
    new TableRow({
      children: [
        createTableHeaderCell('No', 8, AlignmentType.CENTER),
        createTableHeaderCell(isK13Curriculum ? 'Kompetensi Dasar (KD)' : 'Kode TP', 16, AlignmentType.CENTER),
        createTableHeaderCell(isK13Curriculum ? 'Materi Pokok & Kegiatan' : 'Tujuan Pembelajaran (TP) & Lingkup Materi', 48, AlignmentType.LEFT),
        createTableHeaderCell('Alokasi JP', 14, AlignmentType.CENTER),
        createTableHeaderCell('Distribusi Pekan Ke-', 14, AlignmentType.CENTER),
      ],
    }),
  ];

  let cumulativeWeeks = 0;

  if (isK13Curriculum) {
    const k13Items = k13Analysis?.items || [];
    if (k13Items.length === 0) {
      rows.push(
        new TableRow({
          children: [
            createTableDataCell('1', 8, AlignmentType.CENTER),
            createTableDataCell('KD 3.1 & 4.1', 16, AlignmentType.CENTER),
            createTableDataCell('Kompetensi Dasar Semester Aktif', 48),
            createTableDataCell(`${weeklyJP * 2} JP`, 14, AlignmentType.CENTER),
            createTableDataCell('Pekan 1 - 2', 14, AlignmentType.CENTER),
          ],
        })
      );
    } else {
      k13Items.forEach((item, index) => {
        const itemJP = weeklyJP;
        const estimatedWeeks = Math.max(1, Math.ceil(itemJP / weeklyJP));
        const startW = cumulativeWeeks + 1;
        const endW = cumulativeWeeks + estimatedWeeks;
        cumulativeWeeks = endW;

        rows.push(
          new TableRow({
            children: [
              createTableDataCell((index + 1).toString(), 8, AlignmentType.CENTER),
              createTableDataCell(item.kd, 16, AlignmentType.LEFT, true),
              createTableDataCell(`${item.materi || '-'}\n• Kegiatan: ${item.kegiatan || '-'}`, 48),
              createTableDataCell(`${itemJP} JP`, 14, AlignmentType.CENTER, true),
              createTableDataCell(startW === endW ? `Pekan ${startW}` : `Pekan ${startW} - ${endW}`, 14, AlignmentType.CENTER),
            ],
          })
        );
      });
    }
  } else {
    const atpItems = atp?.items || [];
    if (atpItems.length === 0) {
      rows.push(
        new TableRow({
          children: [
            createTableDataCell('1', 8, AlignmentType.CENTER),
            createTableDataCell('TP 1', 16, AlignmentType.CENTER),
            createTableDataCell('Tujuan Pembelajaran Semester Aktif', 48),
            createTableDataCell(`${weeklyJP * 2} JP`, 14, AlignmentType.CENTER),
            createTableDataCell('Pekan 1 - 2', 14, AlignmentType.CENTER),
          ],
        })
      );
    } else {
      atpItems.forEach((item, index) => {
        const itemJP = Number(item.jp) || weeklyJP;
        const estimatedWeeks = Math.max(1, Math.ceil(itemJP / weeklyJP));
        const startW = cumulativeWeeks + 1;
        const endW = cumulativeWeeks + estimatedWeeks;
        cumulativeWeeks = endW;

        const matchedAlloc = (timeAllocations || []).find((t) => t.tpId === item.id || t.atpItemId === item.id);
        const weekDisplay = matchedAlloc?.weekNumber ? `Pekan ${matchedAlloc.weekNumber}` : startW === endW ? `Pekan ${startW}` : `Pekan ${startW} - ${endW}`;

        rows.push(
          new TableRow({
            children: [
              createTableDataCell((index + 1).toString(), 8, AlignmentType.CENTER),
              createTableDataCell(item.tpCode || `TP.${index + 1}`, 16, AlignmentType.CENTER),
              createTableDataCell(
                `${item.tpStatement || '-'}\n• Ruang Lingkup Materi: ${item.materialScope || '-'}`,
                48
              ),
              createTableDataCell(`${itemJP} JP`, 14, AlignmentType.CENTER, true),
              createTableDataCell(weekDisplay, 14, AlignmentType.CENTER),
            ],
          })
        );
      });
    }
  }

  // Summary row
  rows.push(
    new TableRow({
      children: [
        createTableHeaderCell('', 8, AlignmentType.CENTER),
        createTableHeaderCell('TOTAL', 16, AlignmentType.CENTER),
        createTableHeaderCell('Total Alokasi Waktu Pembelajaran Terjadwal', 48, AlignmentType.LEFT),
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
