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
import { getSubjectJP, calculateAvailableJP, calculateEffectiveDays } from '../../jpEngine';

export async function generatePROMES(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, atp } = context;

  const docChildren: (Paragraph | Table)[] = [];

  const isSemesterGanjil =
    academicSetting.semester?.includes('1') || academicSetting.semester?.toLowerCase().includes('ganjil');
  const semesterLabel = isSemesterGanjil ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)';
  const semesterKey = isSemesterGanjil ? 'SEMESTER_1' : 'SEMESTER_2';
  const months = isSemesterGanjil
    ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  // Look up verified official rule
  const officialRule = getSubjectJP({
    curriculum: academicSetting.curriculum,
    level: academicSetting.level,
    grade: academicSetting.grade,
    subject: academicSetting.subject,
  });

  const weeklyJP = academicSetting.subjectWeeklyJP || academicSetting.totalHoursPerWeek || officialRule.weeklyJP || 4;

  const schoolDaysPerWeek = 5;
  const effectiveResult = calculateEffectiveDays(
    {
      startDate: isSemesterGanjil ? '2026-07-15' : '2027-01-05',
      endDate: isSemesterGanjil ? '2026-12-20' : '2027-06-25',
      schoolDaysPerWeek,
      semester: semesterLabel,
      academicYear: academicSetting.academicYear || '2026/2027',
    },
    context.calendarDays || []
  );

  const availableJP = calculateAvailableJP({
    subjectWeeklyJP: weeklyJP,
    effectiveLearningDays: effectiveResult.effectiveLearningDays || 90,
    schoolDaysPerWeek,
    semester: semesterKey,
    academicYear: academicSetting.academicYear || '2026/2027',
    level: academicSetting.level,
    grade: academicSetting.grade,
    subject: academicSetting.subject,
    officialAnnualJP: officialRule.annualJP,
  });

  // 1. Header
  docChildren.push(
    ...createDocumentHeader(
      'PROGRAM SEMESTER (PROMES)',
      `${academicSetting.curriculum} — ${semesterLabel.toUpperCase()} TP ${academicSetting.academicYear || '2026/2027'}`
    )
  );

  // 2. Identity Box
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Alokasi Intrakurikuler per Minggu', `: ${weeklyJP} JP / Minggu`],
      ['Minggu Efektif Semester', `: ${availableJP.effectiveWeeksRounded} Minggu (${effectiveResult.effectiveLearningDays || 90} Hari Efektif)`],
      ['Total Alokasi Waktu Semester', `: ${availableJP.availableJP} JP`],
      ['Dasar Regulasi Struktur', `: ${officialRule.regulation}`],
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

  // Top header row: No, Kode TP/KD, Materi/Tujuan, Alokasi JP, followed by 6 month cells
  const isK13Curriculum = academicSetting.curriculumType === 'K13' || academicSetting.curriculum === 'Kurikulum 2013';
  const monthHeaderCells = months.map((m) => createTableHeaderCell(m, 7));

  const tableHeaderRow1 = new TableRow({
    tableHeader: true,
    children: [
      createTableHeaderCell('No', 5),
      createTableHeaderCell(isK13Curriculum ? 'Kompetensi Dasar (KD)' : 'Kode TP', isK13Curriculum ? 15 : 10),
      createTableHeaderCell(
        isK13Curriculum ? 'Indikator & Materi Pembelajaran' : 'Tujuan Pembelajaran & Ruang Lingkup Materi',
        isK13Curriculum ? 28 : 33,
        AlignmentType.LEFT
      ),
      createTableHeaderCell('Alokasi JP', 10),
      ...monthHeaderCells,
    ],
  });

  let totalJp = 0;
  let dataRows: TableRow[] = [];

  if (isK13Curriculum) {
    const k13Items = context.k13Analysis?.items || [];
    dataRows = k13Items.map((item, idx) => {
      const jp = weeklyJP;
      totalJp += jp;

      const targetMonthIdx = idx % 6;
      const monthDistributionCells = months.map((_, mIdx) => {
        const isTarget = mIdx === targetMonthIdx;
        return createTableDataCell(isTarget ? `${jp}` : '-', 7, AlignmentType.CENTER);
      });

      return new TableRow({
        children: [
          createTableDataCell(`${idx + 1}`, 5, AlignmentType.CENTER),
          createTableDataCell(item.kd, 15, AlignmentType.LEFT, true),
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.indikator || item.materi || '-', size: 19, font: 'Arial' }),
                  item.materi
                    ? new TextRun({ text: `\nMateri: ${item.materi}`, italics: true, size: 18, color: '475569' })
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
  } else {
    const items = atp?.items && atp.items.length > 0 ? atp.items : [];

    dataRows = items.map((item, idx) => {
      const jp = Number(item.jp) || weeklyJP;
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
  }

  // Asesmen Sumatif & Evaluasi Row
  const evaluasiJp = Math.max(2, weeklyJP);
  totalJp += evaluasiJp;
  const evaluasiMonthCells = months.map((_, mIdx) =>
    createTableDataCell(mIdx === 5 ? `${evaluasiJp}` : '-', 7, AlignmentType.CENTER)
  );

  const evaluasiRow = new TableRow({
    children: [
      createTableDataCell(`${dataRows.length + 1}`, 5, AlignmentType.CENTER),
      createTableDataCell('-', isK13Curriculum ? 15 : 10, AlignmentType.CENTER),
      createTableDataCell('Asesmen Sumatif Akhir Semester & Tindak Lanjut Evaluasi', isK13Curriculum ? 28 : 33),
      createTableDataCell(`${evaluasiJp} JP`, 10, AlignmentType.CENTER, true),
      ...evaluasiMonthCells,
    ],
  });

  // Total Summary Row
  const totalMonthCells = months.map(() => createTableDataCell('-', 7, AlignmentType.CENTER));
  const totalRow = new TableRow({
    children: [
      new TableCell({
        width: { size: isK13Curriculum ? 48 : 48, type: WidthType.PERCENTAGE },
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
          text: '1. Angka pada kolom bulan menunjukkan alokasi jam pelajaran (JP) intrakurikuler tatap muka per unit materi.\n2. Distribusi waktu dirancang berdasar kalender pendidikan satuan pendidikan dan panduan resmi Kemendikdasmen.',
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
