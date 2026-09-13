import {
  CurriculumType,
  MasterCurriculumStructure,
  SubjectJPQuery,
  SubjectJPResult,
  TeachingAssignment,
  AdditionalDuty,
  TeacherLoadValidationResult,
  AvailableJPCalculation,
  JPVerificationStatus,
} from '../types';

/**
 * MASTER STRUKTUR KURIKULUM RESMI PEMERINTAH (KEMENDIKBUDRISTEK / KEMENAG)
 *
 * Sumber Regulasi Sah:
 * 1. Kurikulum Merdeka:
 *    - Kepmendikbudristek No. 12/2024 (Kurikulum pada PAUD, Dikdas, dan Dikmen)
 *    - BSKAP No. 032/H/KR/2024 (Capaian Pembelajaran dan Struktur Kurikulum)
 *    - Salinan Resmi: https://kurikulum.kemdikbud.go.id/
 * 2. Kurikulum 2013:
 *    - Permendikbud No. 37/2018 jo Permendikbud No. 35/2018 & 36/2018
 *    - Salinan Resmi: https://jdih.kemdikbud.go.id/
 *
 * Ketentuan:
 * - Tidak boleh mengarang angka alokasi JP.
 * - Mapel yang belum diverifikasi diberi status 'UNVERIFIED' ("Belum diverifikasi").
 */
export const MASTER_CURRICULUM_STRUCTURE: MasterCurriculumStructure[] = [
  // =========================================================================
  // KURIKULUM MERDEKA - SD / MI (Fase A: Kelas 1 - 2)
  // Regulasi: Kepmendikbudristek No. 12/2024 (Tahun 2024, Berlaku sejak 2024-03-26)
  // =========================================================================

  // --- SD KELAS 1 (Fase A) ---
  {
    id: 'km-sd-1-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 3 JP/minggu (108 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 4 JP/minggu (144 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 72,
    totalAnnualJP: 288,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 6 JP/minggu (216 JP/tahun) + Kokurikuler P5 72 JP/tahun',
  },
  {
    id: 'km-sd-1-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Matematika',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 4 JP/minggu (144 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi total 4 JP/minggu (Intrakurikuler 108-144 JP/tahun + P5 36 JP/tahun)',
  },
  {
    id: 'km-sd-1-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Rupa',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-senimusik',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Musik',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-senitari',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Tari',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-seniteater',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Teater',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Bahasa Inggris',
    weeklyJP: 2,
    annualJP: 72,
    totalAnnualJP: 72,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Mata Pelajaran Pilihan SD',
  },
  {
    id: 'km-sd-1-mulok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Pergub/Perda Muatan Lokal & Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Muatan Lokal (Bahasa Daerah)',
    weeklyJP: 2,
    annualJP: 72,
    totalAnnualJP: 72,
    source: 'Dinas Pendidikan Provinsi / Daerah',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Muatan lokal maksimal 2 JP/minggu (72 JP/tahun)',
  },

  // --- SD KELAS 2 (Fase A) ---
  {
    id: 'km-sd-2-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Bahasa Indonesia',
    weeklyJP: 7,
    annualJP: 252,
    kokurikulerJP: 72,
    totalAnnualJP: 324,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Bahasa Indonesia Kelas 2 alokasi 7 JP/minggu (252 JP intrakurikuler)',
  },
  {
    id: 'km-sd-2-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Matematika Kelas 2 alokasi 5 JP/minggu (180 JP intrakurikuler)',
  },
  {
    id: 'km-sd-2-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Seni Rupa',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Bahasa Inggris',
    weeklyJP: 2,
    annualJP: 72,
    totalAnnualJP: 72,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // --- SD KELAS 3, 4, 5 (Fase B & C) ---
  // Kelas 3 (Fase B)
  {
    id: 'km-sd-3-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 72,
    totalAnnualJP: 288,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-ipas',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'IPAS Kelas 3 alokasi 5 JP/minggu (180 JP intrakurikuler)',
  },
  {
    id: 'km-sd-3-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Seni Rupa',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-3-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 3',
    subject: 'Bahasa Inggris',
    weeklyJP: 2,
    annualJP: 72,
    totalAnnualJP: 72,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // Kelas 4 (Fase B)
  {
    id: 'km-sd-4-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 72,
    totalAnnualJP: 288,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-ipas',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Seni Rupa',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Bahasa Inggris',
    weeklyJP: 2,
    annualJP: 72,
    totalAnnualJP: 72,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // Kelas 5 (Fase C)
  {
    id: 'km-sd-5-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-5-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-5-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 72,
    totalAnnualJP: 288,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-5-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-5-ipas',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-5-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 5',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // --- SD KELAS 6 (Fase C) - Alokasi 32 minggu/tahun ---
  {
    id: 'km-sd-6-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 96,
    kokurikulerJP: 32,
    totalAnnualJP: 128,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Kelas 6 diasumsikan 32 minggu efektif per tahun',
  },
  {
    id: 'km-sd-6-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 4,
    annualJP: 128,
    kokurikulerJP: 32,
    totalAnnualJP: 160,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-6-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 192,
    kokurikulerJP: 64,
    totalAnnualJP: 256,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-6-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 160,
    kokurikulerJP: 32,
    totalAnnualJP: 192,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-6-ipas',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    weeklyJP: 5,
    annualJP: 160,
    kokurikulerJP: 32,
    totalAnnualJP: 192,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-6-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase C',
    grade: 'Kelas 6',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 128,
    kokurikulerJP: 32,
    totalAnnualJP: 160,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // =========================================================================
  // KURIKULUM MERDEKA - SMP / MTs (Fase D: Kelas 7 - 9)
  // Regulasi: Kepmendikbudristek No. 12/2024
  // =========================================================================

  // --- SMP KELAS 7 & 8 ---
  {
    id: 'km-smp-7-agama',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Agama dan Budi Pekerti',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Pancasila',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Bahasa Indonesia',
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    totalAnnualJP: 216,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Matematika',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-ipa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    totalAnnualJP: 180,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-ips',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Bahasa Inggris',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    totalAnnualJP: 144,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-informatika',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Informatika',
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    totalAnnualJP: 108,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-seni',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Kepmendikbudristek No. 12/2024',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Seni dan Prakarya',
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    totalAnnualJP: 108,
    source: 'BSKAP Kemendikbudristek RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // =========================================================================
  // KURIKULUM 2013 (K13) - SD & SMP
  // Regulasi: Permendikbud No. 37/2018 jo Permendikbud No. 35/2018 & 36/2018
  // =========================================================================
  {
    id: 'k13-sd-1-pjok',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    totalAnnualJP: 144,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-1-bindo',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Bahasa Indonesia',
    weeklyJP: 8,
    annualJP: 288,
    totalAnnualJP: 288,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-1-mtk',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Matematika',
    weeklyJP: 5,
    annualJP: 180,
    totalAnnualJP: 180,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-pjok',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    weeklyJP: 4,
    annualJP: 144,
    totalAnnualJP: 144,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-bindo',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Bahasa Indonesia',
    weeklyJP: 6,
    annualJP: 216,
    totalAnnualJP: 216,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-mtk',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Matematika',
    weeklyJP: 6,
    annualJP: 216,
    totalAnnualJP: 216,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-ipa',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    weeklyJP: 3,
    annualJP: 108,
    totalAnnualJP: 108,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-ips',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37/2018',
    regulationYear: 2018,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    weeklyJP: 3,
    annualJP: 108,
    totalAnnualJP: 108,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-28',
    verificationStatus: 'VERIFIED',
  },
];

/**
 * DAFTAR STANDAR EKUIVALENSI TUGAS TAMBAHAN GURU RESMI
 * Regulasi: Permendikbud No. 15 Tahun 2018 Pasal 6 jo Permendikbudristek No. 25 Tahun 2024
 */
export const OFFICIAL_ADDITIONAL_DUTIES_REFERENCE: Array<{
  role: string;
  equivalentWeeklyJP: number;
  description: string;
}> = [
  {
    role: 'Wakil Kepala Satuan Pendidikan',
    equivalentWeeklyJP: 12,
    description: 'Ekuivalen dengan 12 (dua belas) jam tatap muka per minggu',
  },
  {
    role: 'Ketua Program Keahlian (SMK)',
    equivalentWeeklyJP: 12,
    description: 'Ekuivalen dengan 12 (dua belas) jam tatap muka per minggu',
  },
  {
    role: 'Kepala Perpustakaan Satuan Pendidikan',
    equivalentWeeklyJP: 12,
    description: 'Ekuivalen dengan 12 (dua belas) jam tatap muka per minggu',
  },
  {
    role: 'Kepala Laboratorium / Bengkel / Unit Produksi',
    equivalentWeeklyJP: 12,
    description: 'Ekuivalen dengan 12 (dua belas) jam tatap muka per minggu',
  },
  {
    role: 'Pembimbing Khusus pada Satuan Pendidikan Inklusif',
    equivalentWeeklyJP: 6,
    description: 'Ekuivalen dengan 6 (enam) jam tatap muka per minggu',
  },
  {
    role: 'Wali Kelas',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per minggu',
  },
  {
    role: 'Pembina Organisasi Siswa Intra Sekolah (OSIS)',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per minggu',
  },
  {
    role: 'Pembina Ekstrakurikuler',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per minggu',
  },
  {
    role: 'Koordinator Projek Penguatan Profil Pelajar Pancasila (P5)',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per rombel/fase',
  },
  {
    role: 'Koordinator Pengembangan Keprofesian Berkelanjutan (PKB)',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per minggu',
  },
  {
    role: 'Koordinator Penilaian Kinerja Guru (PKG)',
    equivalentWeeklyJP: 2,
    description: 'Ekuivalen dengan 2 (dua) jam tatap muka per minggu',
  },
  {
    role: 'Guru Piket',
    equivalentWeeklyJP: 1,
    description: 'Ekuivalen dengan 1 (satu) jam tatap muka per minggu',
  },
];

/**
 * Normalizes user curriculum string into standard enum
 */
export function getCurriculumType(curriculumString?: string): CurriculumType {
  if (!curriculumString) return 'KURIKULUM_MERDEKA';
  const lower = curriculumString.toLowerCase();
  if (lower.includes('2013') || lower.includes('k13') || lower.includes('k-13')) {
    return 'K13';
  }
  return 'KURIKULUM_MERDEKA';
}

/**
 * Normalizes grade string (e.g. "4", "Kelas 4", "IV" -> "Kelas 4")
 */
export function normalizeGrade(gradeStr?: string): string {
  if (!gradeStr) return 'Kelas 1';
  const trimmed = gradeStr.trim();
  if (/^kelas\s+/i.test(trimmed)) {
    return trimmed.replace(/^kelas\s+/i, 'Kelas ');
  }
  if (/^\d+$/.test(trimmed)) {
    return `Kelas ${trimmed}`;
  }
  return trimmed;
}

/**
 * 1. getSubjectJP(): Mengambil alokasi JP resmi suatu mata pelajaran dari Master Struktur Kurikulum
 *
 * Jangan samakan 24 JP guru dengan JP mata pelajaran!
 * 24 JP adalah beban kerja minimal guru tatap muka, sedangkan JP mata pelajaran
 * berasal dari Struktur Kurikulum resmi pemerintah.
 */
export function getSubjectJP(query: SubjectJPQuery): SubjectJPResult {
  const curType = query.curriculumType || getCurriculumType(query.curriculum);
  const normLevel = (query.level || 'SD').toUpperCase() as 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'SMK';
  const normGrade = normalizeGrade(query.grade || 'Kelas 1');
  const rawSubject = (query.subject || '').trim();
  const normSubject = rawSubject.toLowerCase();

  // 1. Coba pencarian eksak
  const exact = MASTER_CURRICULUM_STRUCTURE.find(
    (item) =>
      item.curriculumType === curType &&
      item.level === normLevel &&
      item.grade.toLowerCase() === normGrade.toLowerCase() &&
      item.subject.toLowerCase() === normSubject
  );

  if (exact) {
    return {
      weeklyJP: exact.weeklyJP,
      annualJP: exact.annualJP,
      kokurikulerJP: exact.kokurikulerJP,
      totalAnnualJP: exact.totalAnnualJP,
      isOfficial: true,
      verificationStatus: exact.verificationStatus,
      statusLabel: exact.verificationStatus === 'VERIFIED' ? 'Terverifikasi Resmi' : 'Belum diverifikasi',
      regulation: exact.regulation,
      regulationYear: exact.regulationYear,
      source: exact.source,
      sourceUrl: exact.sourceUrl,
      effectiveFrom: exact.effectiveFrom,
      curriculumType: curType,
      matchedRule: exact,
      explanation: `Mata Pelajaran ${exact.subject} (${exact.grade} ${exact.level}): ${exact.weeklyJP} JP/minggu sesuai ${exact.regulation}.`,
    };
  }

  // 2. Coba pencarian fuzzy / alias (misal: "PJOK", "IPAS", "Pendidikan Pancasila / PKn")
  const fuzzy = MASTER_CURRICULUM_STRUCTURE.find((item) => {
    if (item.curriculumType !== curType || item.level !== normLevel) return false;
    const itemSub = item.subject.toLowerCase();
    return (
      itemSub.includes(normSubject) ||
      normSubject.includes(itemSub) ||
      (normSubject.includes('pjok') && itemSub.includes('pjok')) ||
      (normSubject.includes('ipas') && itemSub.includes('ipas')) ||
      ((normSubject.includes('pancasila') || normSubject.includes('pkn') || normSubject.includes('ppkn')) &&
        itemSub.includes('pancasila')) ||
      (normSubject.includes('matematika') && itemSub.includes('matematika')) ||
      (normSubject.includes('indonesia') && itemSub.includes('indonesia')) ||
      (normSubject.includes('inggris') && itemSub.includes('inggris')) ||
      (normSubject.includes('agama') && itemSub.includes('agama')) ||
      (normSubject.includes('seni rupa') && itemSub.includes('seni rupa')) ||
      (normSubject.includes('seni musik') && itemSub.includes('seni musik'))
    );
  });

  if (fuzzy) {
    return {
      weeklyJP: fuzzy.weeklyJP,
      annualJP: fuzzy.annualJP,
      kokurikulerJP: fuzzy.kokurikulerJP,
      totalAnnualJP: fuzzy.totalAnnualJP,
      isOfficial: true,
      verificationStatus: fuzzy.verificationStatus,
      statusLabel: fuzzy.verificationStatus === 'VERIFIED' ? 'Terverifikasi Resmi' : 'Belum diverifikasi',
      regulation: fuzzy.regulation,
      regulationYear: fuzzy.regulationYear,
      source: fuzzy.source,
      sourceUrl: fuzzy.sourceUrl,
      effectiveFrom: fuzzy.effectiveFrom,
      curriculumType: curType,
      matchedRule: fuzzy,
      explanation: `Mata Pelajaran ${fuzzy.subject} (${normGrade} ${normLevel}): ${fuzzy.weeklyJP} JP/minggu sesuai ${fuzzy.regulation}.`,
    };
  }

  // 3. Jika tidak ditemukan di database resmi:
  // JANGAN mengarang nilai sebagai resmi! Kembalikan status "Belum diverifikasi"
  const defaultFallbackJP = normLevel === 'SD' ? 4 : normLevel === 'SMP' ? 3 : 2;
  return {
    weeklyJP: defaultFallbackJP,
    isOfficial: false,
    verificationStatus: 'UNVERIFIED',
    statusLabel: 'Belum diverifikasi',
    regulation: 'Struktur Mandiri / Belum Diverifikasi',
    regulationYear: new Date().getFullYear(),
    source: 'Nilai Default / Input Pengguna',
    curriculumType: curType,
    explanation: `Mata pelajaran "${rawSubject || '-'}" belum diverifikasi dalam struktur regulasi resmi. Nilai standar awal: ${defaultFallbackJP} JP/minggu (dapat disesuaikan mandiri).`,
  };
}

/**
 * 2. calculateAvailableJP(): Menghitung JP Tersedia berdasarkan rumus resmi
 * Formula Inti: JP per minggu × minggu efektif = JP tersedia
 */
export function calculateAvailableJP(
  jpPerWeek: number,
  effectiveWeeks: number,
  details?: {
    semester?: string;
    academicYear?: string;
    level?: string;
    grade?: string;
    subject?: string;
  }
): AvailableJPCalculation {
  const safeJp = Math.max(0, Number(jpPerWeek) || 0);
  const safeWeeks = Math.max(0, Number(effectiveWeeks) || 0);
  const availableJP = safeJp * safeWeeks;

  return {
    jpPerWeek: safeJp,
    effectiveWeeks: safeWeeks,
    availableJP,
    formula: 'JP per minggu × minggu efektif = JP tersedia',
    formulaCalculation: `${safeJp} JP/minggu × ${safeWeeks} minggu efektif = ${availableJP} JP tersedia`,
    details: details || {},
  };
}

/**
 * 3. calculateSemesterJP(): Menghitung total alokasi JP untuk 1 semester
 */
export function calculateSemesterJP(jpPerWeek: number, semesterEffectiveWeeks: number): number {
  return Math.max(0, Number(jpPerWeek) || 0) * Math.max(0, Number(semesterEffectiveWeeks) || 0);
}

/**
 * 4. calculateAnnualJP(): Menghitung total alokasi JP untuk 1 tahun pelajaran
 */
export function calculateAnnualJP(jpPerWeek: number, annualEffectiveWeeks: number): number {
  return Math.max(0, Number(jpPerWeek) || 0) * Math.max(0, Number(annualEffectiveWeeks) || 0);
}

/**
 * 5. validateTeacherTeachingLoad():
 * Memvalidasi pemenuhan Beban Kerja Tatap Muka Guru sesuai Permendikbud No. 15 Tahun 2018 jo Permendikbudristek No. 25 Tahun 2024
 *
 * Konsep:
 * - Beban Tatap Muka Guru = Σ (Jumlah Rombel Kelas × JP Mapel per Minggu)
 * - Beban Kerja Total Guru = Beban Tatap Muka + Ekuivalensi Tugas Tambahan
 * - Standar Pemenuhan Sertifikasi/Tunjangan Profesi: 24 s.d. 40 JP per minggu
 */
export function validateTeacherTeachingLoad(
  assignments: TeachingAssignment[] = [],
  additionalDuties: AdditionalDuty[] = [],
  teacherName?: string
): TeacherLoadValidationResult {
  // 1. Hitung total JP tatap muka riil
  const assignmentsBreakdown = assignments.map((a) => {
    const classCount = Math.max(1, Number(a.classCount) || 1);
    const weeklyJP = Math.max(0, Number(a.weeklyJP) || 0);
    const subtotalJP = classCount * weeklyJP;
    return {
      subject: a.subject || 'Mata Pelajaran',
      grade: a.grade || 'Rombel',
      weeklyJP,
      classCount,
      subtotalJP,
    };
  });

  const totalDirectTeachingJP = assignmentsBreakdown.reduce((sum, item) => sum + item.subtotalJP, 0);

  // 2. Hitung total JP tugas tambahan
  const additionalDutiesBreakdown = additionalDuties.map((d) => ({
    role: d.role,
    equivalentWeeklyJP: Math.max(0, Number(d.equivalentWeeklyJP) || 0),
    decreeNumber: d.decreeNumber,
  }));

  const totalAdditionalDutiesJP = additionalDutiesBreakdown.reduce(
    (sum, item) => sum + item.equivalentWeeklyJP,
    0
  );

  // 3. Hitung total beban kerja
  const totalWorkloadJP = totalDirectTeachingJP + totalAdditionalDutiesJP;
  const minimumRequirementJP = 24;
  const maximumRequirementJP = 40;

  const isMinimumFulfilled = totalWorkloadJP >= minimumRequirementJP;
  const isWithinMaximum = totalWorkloadJP <= maximumRequirementJP;

  let status: 'BELUM_MEMENUHI' | 'MEMENUHI' | 'MELEBIHI_BATAS_MAKSIMAL' = 'MEMENUHI';
  let statusLabel = 'Memenuhi Ketentuan (24 - 40 JP)';
  let statusDescription = `Beban mengajar ${totalWorkloadJP} JP/minggu telah memenuhi standar pemenuhan beban kerja guru (24 - 40 JP/minggu).`;

  if (!isMinimumFulfilled) {
    status = 'BELUM_MEMENUHI';
    const shortage = minimumRequirementJP - totalWorkloadJP;
    statusLabel = `Kurang ${shortage} JP (Total: ${totalWorkloadJP} / 24 JP)`;
    statusDescription = `Beban mengajar saat ini ${totalWorkloadJP} JP/minggu, masih kurang ${shortage} JP untuk memenuhi batas minimal 24 JP/minggu (Permendikbud No. 15 Tahun 2018).`;
  } else if (!isWithinMaximum) {
    status = 'MELEBIHI_BATAS_MAKSIMAL';
    const excess = totalWorkloadJP - maximumRequirementJP;
    statusLabel = `Melebihi Batas Maksimal (+${excess} JP)`;
    statusDescription = `Total beban mengajar ${totalWorkloadJP} JP/minggu telah melebihi batas maksimal yang diperkenankan (40 JP/minggu).`;
  }

  return {
    teacherName,
    totalDirectTeachingJP,
    totalAdditionalDutiesJP,
    totalWorkloadJP,
    minimumRequirementJP,
    maximumRequirementJP,
    isMinimumFulfilled,
    isWithinMaximum,
    status,
    statusLabel,
    statusDescription,
    breakdown: {
      assignments: assignmentsBreakdown,
      additionalDuties: additionalDutiesBreakdown,
    },
    regulatoryBasis: 'Permendikbud No. 15 Tahun 2018 jo Permendikbudristek No. 25 Tahun 2024',
  };
}

/**
 * 6. deriveEffectiveJP(): Menurunkan JP mata pelajaran untuk `totalHoursPerWeek`
 * Menjamin `totalHoursPerWeek` diperlakukan sebagai derived value atau controlled override
 */
export function deriveEffectiveJP(setting: {
  curriculum?: string;
  curriculumType?: CurriculumType;
  level?: string;
  grade?: string;
  subject?: string;
  totalHoursPerWeek?: number;
  isHoursOverridden?: boolean;
}): {
  weeklyJP: number;
  isOfficial: boolean;
  isOverridden: boolean;
  ruleResult: SubjectJPResult;
  sourceExplanation: string;
} {
  const ruleResult = getSubjectJP({
    curriculum: setting.curriculum,
    curriculumType: setting.curriculumType,
    level: setting.level,
    grade: setting.grade,
    subject: setting.subject,
  });

  if (setting.isHoursOverridden && setting.totalHoursPerWeek !== undefined && setting.totalHoursPerWeek > 0) {
    return {
      weeklyJP: setting.totalHoursPerWeek,
      isOfficial: ruleResult.isOfficial && setting.totalHoursPerWeek === ruleResult.weeklyJP,
      isOverridden: true,
      ruleResult,
      sourceExplanation: `Manual Override Guru (${setting.totalHoursPerWeek} JP/minggu). Standar resmi: ${ruleResult.weeklyJP} JP/minggu (${ruleResult.regulation}).`,
    };
  }

  return {
    weeklyJP: ruleResult.weeklyJP,
    isOfficial: ruleResult.isOfficial,
    isOverridden: false,
    ruleResult,
    sourceExplanation: ruleResult.explanation,
  };
}
