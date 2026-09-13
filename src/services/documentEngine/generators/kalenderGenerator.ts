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

export async function generateKalenderAkademik(context: DocumentGenerationContext): Promise<GeneratedDocumentResult> {
  const { school, profile, academicSetting, calendar, calendarDays } = context;

  const docChildren: (Paragraph | Table)[] = [];

  // Header
  docChildren.push(...createDocumentHeader('KALENDER AKADEMIK & JADWAL PENDIDIKAN', academicSetting.curriculum));

  // Metadata Table
  docChildren.push(
    createIdentityMetadataTable(school, profile, academicSetting, [
      ['Rentang Waktu Semester', `: ${calendar?.startDate || '-'} s/d ${calendar?.endDate || '-'}`],
      ['Hari Sekolah / Minggu', `: ${calendar?.schoolDaysPerWeek || 5} Hari Kerja`],
      ['Beban Jam Pelajaran (JP)', `: ${calendar?.jpPerWeek || academicSetting.totalHoursPerWeek || 4} JP / Minggu`],
    ])
  );
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // Section 1: Ringkasan Hari Efektif
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'A. Ringkasan Hari & Minggu Efektif Pembelajaran',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const daysList = calendarDays || [];
  const holidayCount = daysList.filter((d) => d.status === 'holiday').length;
  const eventCount = daysList.filter((d) => d.status === 'schoolEvent').length;

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createTableHeaderCell('No', 10, AlignmentType.CENTER),
          createTableHeaderCell('Komponen Perhitungan', 60, AlignmentType.LEFT),
          createTableHeaderCell('Keterangan / Jumlah', 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('1', 10, AlignmentType.CENTER),
          createTableDataCell('Tahun Ajaran / Semester Aktif', 60),
          createTableDataCell(`${calendar?.academicYear || '2026/2027'} (Semester ${calendar?.semester || '1'})`, 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('2', 10, AlignmentType.CENTER),
          createTableDataCell('Hari Sekolah per Minggu', 60),
          createTableDataCell(`${calendar?.schoolDaysPerWeek || 5} Hari`, 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('3', 10, AlignmentType.CENTER),
          createTableDataCell('Perkiraan Jumlah Pekan Efektif (HE)', 60),
          createTableDataCell('18 - 20 Pekan', 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('4', 10, AlignmentType.CENTER),
          createTableDataCell('Total Alokasi Waktu Mata Pelajaran', 60),
          createTableDataCell(`${(calendar?.jpPerWeek || 4) * 18} JP / Semester`, 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('5', 10, AlignmentType.CENTER),
          createTableDataCell('Jumlah Hari Libur Nasional & Khusus Tercatat', 60),
          createTableDataCell(`${holidayCount} Hari`, 30, AlignmentType.CENTER),
        ],
      }),
      new TableRow({
        children: [
          createTableDataCell('6', 10, AlignmentType.CENTER),
          createTableDataCell('Jumlah Agenda Kegiatan Sekolah / Asesmen', 60),
          createTableDataCell(`${eventCount} Kegiatan`, 30, AlignmentType.CENTER),
        ],
      }),
    ],
  });

  docChildren.push(summaryTable);
  docChildren.push(new Paragraph({ spacing: { after: 180 } }));

  // Section 2: Agenda Kegiatan Khusus & Libur
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: 'B. Matriks Agenda & Catatan Kalender Pendidikan',
          bold: true,
          size: 22,
          font: 'Arial',
          color: '1E3A8A',
        }),
      ],
    })
  );

  const eventRows: TableRow[] = [
    new TableRow({
      children: [
        createTableHeaderCell('No', 8, AlignmentType.CENTER),
        createTableHeaderCell('Tanggal', 22, AlignmentType.CENTER),
        createTableHeaderCell('Status / Jenis Hari', 30, AlignmentType.LEFT),
        createTableHeaderCell('Keterangan Kegiatan / Peristiwa', 40, AlignmentType.LEFT),
      ],
    }),
  ];

  if (daysList.length === 0) {
    eventRows.push(
      new TableRow({
        children: [
          createTableDataCell('1', 8, AlignmentType.CENTER),
          createTableDataCell(calendar?.startDate || 'Awal Semester', 22, AlignmentType.CENTER),
          createTableDataCell('Hari Efektif Belajar', 30),
          createTableDataCell('Awal Kegiatan Belajar Mengajar', 40),
        ],
      })
    );
  } else {
    daysList.forEach((day, index) => {
      const statusLabel =
        day.status === 'holiday'
          ? 'Libur Nasional / Semester'
          : day.status === 'schoolEvent'
          ? 'Kegiatan Khusus Sekolah'
          : day.status === 'effective'
          ? 'Hari Efektif Belajar'
          : 'Lainnya';

      eventRows.push(
        new TableRow({
          children: [
            createTableDataCell((index + 1).toString(), 8, AlignmentType.CENTER),
            createTableDataCell(day.date, 22, AlignmentType.CENTER),
            createTableDataCell(statusLabel, 30),
            createTableDataCell(day.notes || '-', 40),
          ],
        })
      );
    });
  }

  docChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: eventRows }));
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
  const fileName = `Kalender_Pendidikan_${safeSubject}_${safeGrade}.docx`;

  if (!context.skipDownload) {
    saveAs(blob, fileName);
  }

  return {
    success: true,
    type: 'KALENDER_AKADEMIK',
    title: `Kalender Akademik - ${academicSetting.subject} ${academicSetting.grade}`,
    fileName,
    blob,
    record: {
      id: `doc-kalender-${Date.now()}`,
      type: 'KALENDER_AKADEMIK',
      title: `Kalender Akademik - ${academicSetting.subject} ${academicSetting.grade}`,
      status: 'completed',
      lastGenerated: new Date().toISOString(),
      fileName,
      academicSettingId: academicSetting.id,
      workspaceId: context.workspace?.id,
    },
  };
}
