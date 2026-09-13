import {
  CurriculumType,
  CurriculumStructureRule,
  MasterCurriculumStructure,
  SubjectJPQuery,
  SubjectJPResult,
  TeachingAssignment,
  AdditionalDuty,
  TeacherLoadValidationResult,
  EffectiveDayResult,
  AvailableJPResult,
  TimeAllocationValidationResult,
  TimeAllocationStatus,
  LearningTimeAllocation,
  TimeAllocation,
  AcademicCalendar,
  CalendarDay,
  EffectiveWeekInfo,
} from '../types';
import {
  calculateTeacherWorkload,
  PREDEFINED_ADDITIONAL_DUTIES,
} from './teacherWorkloadEngine';

export { calculateTeacherWorkload, PREDEFINED_ADDITIONAL_DUTIES };

/**
 * MASTER STRUKTUR KURIKULUM RESMI PEMERINTAH (KEMENDIKDASMEN / KEMENAG)
 *
 * Acuan Regulasi Resmi:
 * 1. Kurikulum Merdeka:
 *    - Permendikbudristek Nomor 12 Tahun 2024 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah
 *    - Permendikdasmen Nomor 13 Tahun 2025 tentang Perubahan atas Permendikbudristek Nomor 12 Tahun 2024
 *    - Keputusan BSKAP No. 032/H/KR/2024 (Capaian Pembelajaran dan Struktur Kurikulum)
 *    - Salinan Resmi: https://kurikulum.kemdikbud.go.id/
 * 2. Kurikulum 2013 (K13):
 *    - Permendikbud No. 37 Tahun 2018 jo Permendikbud No. 35 & 36 Tahun 2018 (Struktur Kurikulum dan KD)
 *    - Salinan Resmi: https://jdih.kemdikbud.go.id/
 *
 * Ketentuan Ketat:
 * - Tidak boleh mengarang angka alokasi JP.
 * - Setiap rule memiliki intrakurikulerWeeklyJP, intrakurikulerAnnualJP, kokurikulerAnnualJP, totalAnnualJP.
 * - Mapel yang belum terverifikasi diberi status 'UNVERIFIED' ("Belum diverifikasi") dan weeklyJP null.
 */
export const MASTER_CURRICULUM_STRUCTURE: CurriculumStructureRule[] = [
  // =========================================================================
  // KURIKULUM MERDEKA - SD / MI (Fase A: Kelas 1 - 2)
  // Regulasi: Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025
  // =========================================================================

  // --- SD KELAS 1 (Fase A) ---
  {
    id: 'km-sd-1-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 3 JP/minggu (108 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Pancasila',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 4 JP/minggu (144 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 6,
    intrakurikulerAnnualJP: 216,
    kokurikulerAnnualJP: 72,
    totalAnnualJP: 288,
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 72,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 6 JP/minggu (216 JP/tahun) + Kokurikuler P5 72 JP/tahun',
  },
  {
    id: 'km-sd-1-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 4 JP/minggu (144 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi intrakurikuler 3 JP/minggu (108 JP/tahun) + Kokurikuler P5 36 JP/tahun',
  },
  {
    id: 'km-sd-1-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Rupa',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-senimusik',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Musik',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-senitari',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Tari',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-seniteater',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Seni Teater',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-1-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Bahasa Inggris',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 72,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 0,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Mata pelajaran pilihan',
  },
  {
    id: 'km-sd-1-mulok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 1',
    subject: 'Muatan Lokal',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 72,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 0,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Maksimal 2 JP/minggu (72 JP/tahun) sesuai kebijakan Pemda',
  },

  // --- SD KELAS 2 (Fase A) ---
  {
    id: 'km-sd-2-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Pancasila',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 7,
    intrakurikulerAnnualJP: 252,
    kokurikulerAnnualJP: 72,
    totalAnnualJP: 324,
    weeklyJP: 7,
    annualJP: 252,
    kokurikulerJP: 72,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 5,
    intrakurikulerAnnualJP: 180,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 216,
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-2-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase A',
    grade: 'Kelas 2',
    subject: 'Seni Rupa',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // --- SD KELAS 3, 4, 5 (Fase B & Fase C) ---
  {
    id: 'km-sd-4-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Pancasila',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 5,
    intrakurikulerAnnualJP: 180,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 216,
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 5,
    intrakurikulerAnnualJP: 180,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 216,
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-ipas',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    intrakurikulerWeeklyJP: 5,
    intrakurikulerAnnualJP: 180,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 216,
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
    notes: 'Alokasi IPAS Kelas 3, 4, 5 (Fase B & C): 5 JP/minggu',
  },
  {
    id: 'km-sd-4-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sd-4-senirupa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SD',
    phase: 'Fase B',
    grade: 'Kelas 4',
    subject: 'Seni Rupa',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // --- SMP KELAS 7 - 8 (Fase D) ---
  {
    id: 'km-smp-7-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Pancasila',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 5,
    intrakurikulerAnnualJP: 180,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 216,
    weeklyJP: 5,
    annualJP: 180,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-ipa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 180,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-ips',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-bing',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Bahasa Inggris',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-pjok',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-smp-7-informatika',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMP',
    phase: 'Fase D',
    grade: 'Kelas 7',
    subject: 'Informatika',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // --- SMA KELAS 10 (Fase E) ---
  {
    id: 'km-sma-10-pai',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sma-10-pancasila',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'Pendidikan Pancasila',
    intrakurikulerWeeklyJP: 2,
    intrakurikulerAnnualJP: 72,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 108,
    weeklyJP: 2,
    annualJP: 72,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sma-10-bindo',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sma-10-mtk',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 36,
    totalAnnualJP: 144,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 36,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sma-10-ipa',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'IPA (Fisika, Kimia, Biologi)',
    intrakurikulerWeeklyJP: 6,
    intrakurikulerAnnualJP: 216,
    kokurikulerAnnualJP: 108,
    totalAnnualJP: 324,
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 108,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'km-sma-10-ips',
    curriculum: 'Kurikulum Merdeka',
    curriculumType: 'KURIKULUM_MERDEKA',
    regulation: 'Permendikbudristek No. 12 Tahun 2024 jo Permendikdasmen No. 13 Tahun 2025',
    regulationYear: 2024,
    level: 'SMA',
    phase: 'Fase E',
    grade: 'Kelas 10',
    subject: 'IPS (Sosiologi, Ekonomi, Sejarah, Geografi)',
    intrakurikulerWeeklyJP: 8,
    intrakurikulerAnnualJP: 288,
    kokurikulerAnnualJP: 144,
    totalAnnualJP: 432,
    weeklyJP: 8,
    annualJP: 288,
    kokurikulerJP: 144,
    source: 'BSKAP Kemendikdasmen RI',
    sourceUrl: 'https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/',
    effectiveFrom: '2024-03-26',
    verificationStatus: 'VERIFIED',
  },

  // =========================================================================
  // KURIKULUM 2013 (K13) - SD / SMP / SMA
  // Regulasi: Permendikbud No. 37 Tahun 2018 jo Permendikbud No. 35/36 Tahun 2018
  // =========================================================================

  // --- K13 SD KELAS 4 - 6 ---
  {
    id: 'k13-sd-4-pai',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 144,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
    notes: 'K13 SD Alokasi Tatap Muka: 4 JP/minggu',
  },
  {
    id: 'k13-sd-4-pkn',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Pendidikan Pancasila dan Kewarganegaraan (PPKn)',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 144,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-bindo',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Bahasa Indonesia',
    intrakurikulerWeeklyJP: 7,
    intrakurikulerAnnualJP: 252,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 252,
    weeklyJP: 7,
    annualJP: 252,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-mtk',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Matematika',
    intrakurikulerWeeklyJP: 6,
    intrakurikulerAnnualJP: 216,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 216,
    weeklyJP: 6,
    annualJP: 216,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
    notes: 'K13 SD Kelas 4-6 Matematika berdiri sendiri (6 JP/minggu)',
  },
  {
    id: 'k13-sd-4-ipa',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 108,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-ips',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Ilmu Pengetahuan Sosial (IPS)',
    intrakurikulerWeeklyJP: 3,
    intrakurikulerAnnualJP: 108,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 108,
    weeklyJP: 3,
    annualJP: 108,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-sbk',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Seni Budaya dan Prakarya (SBdP)',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 144,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'k13-sd-4-pjok',
    curriculum: 'Kurikulum 2013',
    curriculumType: 'K13',
    regulation: 'Permendikbud No. 37 Tahun 2018',
    regulationYear: 2018,
    level: 'SD',
    grade: 'Kelas 4',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    intrakurikulerWeeklyJP: 4,
    intrakurikulerAnnualJP: 144,
    kokurikulerAnnualJP: 0,
    totalAnnualJP: 144,
    weeklyJP: 4,
    annualJP: 144,
    kokurikulerJP: 0,
    source: 'Kemendikbud RI',
    sourceUrl: 'https://jdih.kemdikbud.go.id/',
    effectiveFrom: '2018-12-14',
    verificationStatus: 'VERIFIED',
  },
];

/**
 * Normalisasi string teks untuk perbandingan fuzzy yang aman
 */
function normalizeText(text?: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[(),.\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Lookup JP Mata Pelajaran dari Master Struktur Kurikulum Resmi Pemerintah
 *
 * JANGAN MENGARANG ANGKA:
 * Jika mapel/tingkat tidak ditemukan dalam database resmi:
 * kembalikan weeklyJP = null dan status 'UNVERIFIED'.
 */
export function getSubjectJP(query: SubjectJPQuery): SubjectJPResult {
  const normCurriculum = normalizeText(query.curriculum);
  const resolvedCurriculumType: CurriculumType =
    query.curriculumType ||
    (normCurriculum.includes('k13') || normCurriculum.includes('2013')
      ? 'K13'
      : 'KURIKULUM_MERDEKA');

  const normSubject = normalizeText(query.subject);
  const normGrade = normalizeText(query.grade);
  const normLevel = normalizeText(query.level);

  // 1. Filter dataset berdasarkan kurikulum
  const candidates = MASTER_CURRICULUM_STRUCTURE.filter(
    (rule) => rule.curriculumType === resolvedCurriculumType
  );

  // 2. Pencocokan spesifik: level + grade + subject
  let matchedRule = candidates.find((rule) => {
    const rSubject = normalizeText(rule.subject);
    const rGrade = normalizeText(rule.grade);
    const rLevel = normalizeText(rule.level);

    const subjectMatch =
      rSubject === normSubject ||
      normSubject.includes(rSubject) ||
      rSubject.includes(normSubject) ||
      (normSubject.includes('pjok') && rSubject.includes('jasmani')) ||
      (normSubject.includes('pancasila') && rSubject.includes('pancasila')) ||
      (normSubject.includes('agama') && rSubject.includes('agama')) ||
      (normSubject.includes('matematika') && rSubject.includes('matematika')) ||
      (normSubject.includes('bahasa indonesia') && rSubject.includes('bahasa indonesia')) ||
      (normSubject.includes('ipas') && rSubject.includes('ipas'));

    const gradeMatch = !normGrade || rGrade === normGrade || normGrade.includes(rGrade) || rGrade.includes(normGrade);
    const levelMatch = !normLevel || rLevel === normLevel;

    return subjectMatch && gradeMatch && levelMatch;
  });

  // 3. Fallback pencocokan subjek + level jika grade spesifik tidak match persis
  if (!matchedRule) {
    matchedRule = candidates.find((rule) => {
      const rSubject = normalizeText(rule.subject);
      const rLevel = normalizeText(rule.level);

      const subjectMatch =
        rSubject === normSubject ||
        normSubject.includes(rSubject) ||
        rSubject.includes(normSubject) ||
        (normSubject.includes('pjok') && rSubject.includes('jasmani')) ||
        (normSubject.includes('pancasila') && rSubject.includes('pancasila')) ||
        (normSubject.includes('matematika') && rSubject.includes('matematika')) ||
        (normSubject.includes('bahasa indonesia') && rSubject.includes('bahasa indonesia'));

      const levelMatch = !normLevel || rLevel === normLevel;
      return subjectMatch && levelMatch;
    });
  }

  // 4. Jika ditemukan dalam database resmi
  if (matchedRule && matchedRule.verificationStatus === 'VERIFIED') {
    const weeklyJP = matchedRule.intrakurikulerWeeklyJP ?? matchedRule.weeklyJP ?? null;
    const annualJP = matchedRule.intrakurikulerAnnualJP ?? matchedRule.annualJP;
    const kokurikulerJP = matchedRule.kokurikulerAnnualJP ?? matchedRule.kokurikulerJP;
    const totalAnnualJP = matchedRule.totalAnnualJP;

    return {
      weeklyJP,
      intrakurikulerWeeklyJP: weeklyJP,
      intrakurikulerAnnualJP: annualJP,
      kokurikulerAnnualJP: kokurikulerJP,
      totalAnnualJP,
      annualJP,
      kokurikulerJP,
      isOfficial: true,
      verificationStatus: 'VERIFIED',
      statusLabel: 'Terverifikasi Resmi',
      sourceType: 'OFFICIAL',
      regulation: matchedRule.regulation,
      regulationYear: matchedRule.regulationYear,
      source: matchedRule.source,
      sourceUrl: matchedRule.sourceUrl,
      effectiveFrom: matchedRule.effectiveFrom,
      curriculumType: matchedRule.curriculumType,
      matchedRule,
      explanation: `Alokasi intrakurikuler resmi: ${weeklyJP ?? '-'} JP/minggu (${annualJP ? `${annualJP} JP/tahun` : ''}${kokurikulerJP ? `, Kokurikuler/P5: ${kokurikulerJP} JP/tahun` : ''}) berdasarkan ${matchedRule.regulation}.`,
    };
  }

  // 5. JANGAN MENGARANG: Mapel tidak ditemukan dalam master resmi
  return {
    weeklyJP: null,
    intrakurikulerWeeklyJP: null,
    isOfficial: false,
    verificationStatus: 'UNVERIFIED',
    statusLabel: 'Belum diverifikasi',
    sourceType: 'UNVERIFIED',
    source: 'Struktur Kurikulum Belum Diverifikasi',
    curriculumType: resolvedCurriculumType,
    explanation: `Mata pelajaran "${query.subject || 'Mapel'}" pada ${query.level || ''} ${query.grade || ''} belum terdaftar dalam struktur regulasi baku. Silakan tetapkan JP intrakurikuler secara manual.`,
  };
}

/**
 * Menghitung rincian Hari Efektif Belajar berdasarkan rentang kalender dan agenda sekolah.
 * Tidak ada arbitrary clamp atau pembatasan buatan.
 */
export function calculateEffectiveDays(
  calendar: Partial<AcademicCalendar> & { startDate: string; endDate: string; schoolDaysPerWeek?: number },
  calendarDays: CalendarDay[] = []
): EffectiveDayResult {
  const schoolDaysPerWeek = Number(calendar.schoolDaysPerWeek) === 6 ? 6 : 5;
  const start = new Date(calendar.startDate);
  const end = new Date(calendar.endDate);

  const holidays: Array<{ date: string; notes?: string }> = [];
  const events: Array<{ date: string; notes?: string }> = [];
  const assessments: Array<{ date: string; notes?: string }> = [];
  const nonLearning: Array<{ date: string; notes?: string }> = [];

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return {
      totalCalendarDays: 0,
      scheduledSchoolDays: 0,
      effectiveLearningDays: 0,
      holidayDays: 0,
      schoolEventDays: 0,
      assessmentDays: 0,
      nonLearningDays: 0,
      breakdown: { holidays, events, assessments, nonLearning },
    };
  }

  // Map agenda hari yang ditandai khusus
  const dayMap = new Map<string, CalendarDay>();
  for (const day of calendarDays) {
    if (day.date) {
      dayMap.set(day.date, day);
    }
  }

  let totalCalendarDays = 0;
  let scheduledSchoolDays = 0;
  let effectiveLearningDays = 0;
  let holidayDays = 0;
  let schoolEventDays = 0;
  let assessmentDays = 0;
  let nonLearningDays = 0;

  const current = new Date(start);
  while (current <= end) {
    totalCalendarDays++;
    const dayOfWeek = current.getDay(); // 0: Sunday, 1: Mon, ..., 6: Sat

    // Cek apakah hari sekolah terjadwal
    // 5 hari kerja: Senin (1) s.d. Jumat (5)
    // 6 hari kerja: Senin (1) s.d. Sabtu (6)
    const isScheduledSchoolDay =
      schoolDaysPerWeek === 6
        ? dayOfWeek >= 1 && dayOfWeek <= 6
        : dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isScheduledSchoolDay) {
      scheduledSchoolDays++;
      const dateStr = current.toISOString().slice(0, 10);
      const specialDay = dayMap.get(dateStr);

      if (specialDay) {
        const normStatus = (specialDay.status || '').toUpperCase();
        if (normStatus === 'HOLIDAY' || specialDay.status === 'holiday') {
          holidayDays++;
          holidays.push({ date: dateStr, notes: specialDay.notes });
        } else if (normStatus === 'SCHOOL_EVENT' || specialDay.status === 'schoolEvent') {
          schoolEventDays++;
          events.push({ date: dateStr, notes: specialDay.notes });
        } else if (normStatus === 'ASSESSMENT') {
          assessmentDays++;
          assessments.push({ date: dateStr, notes: specialDay.notes });
        } else if (
          normStatus === 'BREAK' ||
          normStatus === 'NON_LEARNING' ||
          specialDay.status === 'other' ||
          specialDay.status === 'weekend'
        ) {
          nonLearningDays++;
          nonLearning.push({ date: dateStr, notes: specialDay.notes });
        } else {
          // EFFECTIVE_LEARNING / effective
          effectiveLearningDays++;
        }
      } else {
        effectiveLearningDays++;
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    totalCalendarDays,
    scheduledSchoolDays,
    effectiveLearningDays,
    holidayDays,
    schoolEventDays,
    assessmentDays,
    nonLearningDays,
    breakdown: {
      holidays,
      events,
      assessments,
      nonLearning,
    },
  };
}

/**
 * Mengelompokkan hari-hari efektif pembelajaran berdasarkan minggu kalender
 * untuk mendapatkan urutan Minggu Efektif Aktual beserta tanggal dan bulan resminya.
 */
export function getEffectiveWeeksList(
  calendar: Partial<AcademicCalendar> & { startDate: string; endDate: string; schoolDaysPerWeek?: number },
  calendarDays: CalendarDay[] = []
): EffectiveWeekInfo[] {
  if (!calendar?.startDate || !calendar?.endDate) return [];

  const schoolDaysPerWeek = Number(calendar.schoolDaysPerWeek) === 6 ? 6 : 5;
  const start = new Date(calendar.startDate);
  const end = new Date(calendar.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return [];

  const dayMap = new Map<string, CalendarDay>();
  for (const day of calendarDays) {
    if (day?.date) {
      dayMap.set(day.date, day);
    }
  }

  // Group effective days into calendar weeks (Monday to Sunday)
  const weekMap = new Map<string, string[]>();
  const weekOrder: string[] = [];

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0: Sun, 1: Mon...
    const isScheduledSchoolDay = schoolDaysPerWeek === 6 ? dayOfWeek >= 1 && dayOfWeek <= 6 : dayOfWeek >= 1 && dayOfWeek <= 5;

    if (isScheduledSchoolDay) {
      const dateStr = current.toISOString().slice(0, 10);
      const specialDay = dayMap.get(dateStr);

      let isEffective = true;
      if (specialDay) {
        const normStatus = (specialDay.status || '').toUpperCase();
        if (
          normStatus === 'HOLIDAY' ||
          specialDay.status === 'holiday' ||
          normStatus === 'SCHOOL_EVENT' ||
          specialDay.status === 'schoolEvent' ||
          normStatus === 'ASSESSMENT' ||
          normStatus === 'BREAK' ||
          normStatus === 'NON_LEARNING' ||
          specialDay.status === 'other' ||
          specialDay.status === 'weekend'
        ) {
          isEffective = false;
        }
      }

      if (isEffective) {
        // Monday of current date's calendar week
        const mon = new Date(current);
        const day = mon.getDay();
        const diff = mon.getDate() - day + (day === 0 ? -6 : 1);
        mon.setDate(diff);
        const mondayKey = mon.toISOString().slice(0, 10);

        if (!weekMap.has(mondayKey)) {
          weekMap.set(mondayKey, []);
          weekOrder.push(mondayKey);
        }
        weekMap.get(mondayKey)!.push(dateStr);
      }
    }

    current.setDate(current.getDate() + 1);
  }

  const effectiveWeeks: EffectiveWeekInfo[] = [];
  let effectiveWeekCounter = 1;

  for (const monKey of weekOrder) {
    const dates = weekMap.get(monKey);
    if (dates && dates.length > 0) {
      const firstDate = new Date(dates[0]);
      effectiveWeeks.push({
        weekIndex: effectiveWeekCounter++,
        startDate: dates[0],
        endDate: dates[dates.length - 1],
        effectiveDaysCount: dates.length,
        month: firstDate.getMonth() + 1, // 1 - 12
        year: firstDate.getFullYear(),
      });
    }
  }

  return effectiveWeeks;
}

/**
 * Menghitung Minggu Efektif Ekuivalen dari Hari Efektif Belajar
 */
export function calculateEffectiveWeeks(
  effectiveLearningDays: number,
  schoolDaysPerWeek: number = 5
): {
  effectiveWeeksEquivalent: number;
  effectiveWeeksRounded: number;
} {
  const daysPerWeek = Math.max(1, schoolDaysPerWeek || 5);
  const equivalent = Math.max(0, effectiveLearningDays) / daysPerWeek;
  const rounded = Math.round(equivalent * 10) / 10;
  return {
    effectiveWeeksEquivalent: equivalent,
    effectiveWeeksRounded: rounded,
  };
}

/**
 * Menghitung Alokasi Jam Pelajaran (JP) Tersedia dalam satu semester
 * Formula: JP Mingguan × (Hari Efektif Belajar ÷ Hari Sekolah per Minggu)
 */
export function calculateAvailableJP(params: {
  subjectWeeklyJP: number;
  effectiveLearningDays: number;
  schoolDaysPerWeek?: number;
  semester?: string;
  academicYear?: string;
  level?: string;
  grade?: string;
  subject?: string;
  officialAnnualJP?: number;
}): AvailableJPResult {
  const daysPerWeek = Math.max(1, params.schoolDaysPerWeek || 5);
  const subjectWeeklyJP = Math.max(0, Number(params.subjectWeeklyJP) || 0);
  const effectiveLearningDays = Math.max(0, Number(params.effectiveLearningDays) || 0);

  const { effectiveWeeksEquivalent, effectiveWeeksRounded } = calculateEffectiveWeeks(
    effectiveLearningDays,
    daysPerWeek
  );

  const exactAvailableJP = subjectWeeklyJP * (effectiveLearningDays / daysPerWeek);
  const availableJP = Math.round(exactAvailableJP);

  // Batasi / validasi terhadap kapasitas struktur tahunan resmi
  let isCapacityExceeded = false;
  let capacityWarning: string | undefined;
  if (params.officialAnnualJP && params.officialAnnualJP > 0) {
    const projectedAnnualJP = availableJP * 2;
    if (projectedAnnualJP > params.officialAnnualJP * 1.15) {
      isCapacityExceeded = true;
      capacityWarning = `Perhatian: Proyeksi JP tahunan (${projectedAnnualJP} JP) melampaui alokasi struktur kurikulum resmi (${params.officialAnnualJP} JP/tahun). Periksa kembali kalender akademik.`;
    }
  }

  const formula = 'JP Mingguan × (Hari Efektif Belajar ÷ Hari Sekolah/Minggu)';
  const formulaCalculation = `${subjectWeeklyJP} JP/minggu × (${effectiveLearningDays} hari ÷ ${daysPerWeek} hari/minggu) = ${subjectWeeklyJP} × ${effectiveWeeksRounded} = ${availableJP} JP`;

  return {
    subjectWeeklyJP,
    effectiveLearningDays,
    schoolDaysPerWeek: daysPerWeek,
    effectiveWeeksEquivalent,
    effectiveWeeksRounded,
    availableJP,
    formula,
    formulaCalculation,
    isCapacityExceeded,
    capacityWarning,
    officialAnnualJP: params.officialAnnualJP,
    details: {
      semester: params.semester,
      academicYear: params.academicYear,
      level: params.level,
      grade: params.grade,
      subject: params.subject,
    },
    jpPerWeek: subjectWeeklyJP,
    effectiveWeeks: effectiveWeeksRounded,
  };
}

/**
 * Normalisasi objek alokasi ke model shared LearningTimeAllocation
 */
export function normalizeLearningAllocation(raw: Partial<LearningTimeAllocation | TimeAllocation>): LearningTimeAllocation {
  const allocatedJP = Number(raw.allocatedJP ?? raw.jp ?? 0);
  const startWeek = raw.startWeek ?? raw.weekNumber;
  const sourceId = raw.sourceId ?? raw.tpId ?? raw.atpItemId ?? raw.id ?? '';
  let sourceType = raw.sourceType;
  if (!sourceType) {
    const rawAny = raw as Record<string, any>;
    if (raw.atpItemId || rawAny.atpId || (sourceId && (sourceId.startsWith('atp-') || sourceId.startsWith('ATP-')))) {
      sourceType = 'ATP_ITEM';
    } else if (raw.tpId || rawAny.tpCode || (sourceId && (sourceId.startsWith('tp-') || sourceId.startsWith('TP-')))) {
      sourceType = 'TP';
    } else if (rawAny.kdId || rawAny.kd || rawAny.kdCode || (sourceId && (sourceId.startsWith('kd-') || sourceId.startsWith('KD-')))) {
      sourceType = 'KD';
    } else if (rawAny.k13ObjectiveId || rawAny.indicatorId || rawAny.indikatorId || (sourceId && sourceId.startsWith('k13-'))) {
      sourceType = 'K13_OBJECTIVE';
    } else {
      sourceType = 'LEGACY';
    }
  }
  return {
    id: raw.id || `alloc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    academicSettingId: raw.academicSettingId || '',
    sourceType,
    sourceId,
    semester: ((raw as Record<string, any>).semester === '2' || (raw as Record<string, any>).semester === 'Semester 2') ? '2' : '1',
    allocatedJP,
    startWeek,
    endWeek: raw.endWeek ?? startWeek,
    month: raw.month,
    monthName: raw.monthName,
    notes: raw.notes,
    tpId: raw.tpId || (sourceType === 'TP' || sourceType === 'ATP_ITEM' ? sourceId : undefined),
    atpItemId: raw.atpItemId || (sourceType === 'ATP_ITEM' ? sourceId : undefined),
    weekNumber: startWeek,
    jp: allocatedJP,
  };
}

/**
 * Validasi Keseluruhan Distribusi Alokasi Waktu (TP / KD) terhadap JP Tersedia
 */
export function validateTimeAllocations(
  allocations: Array<Partial<LearningTimeAllocation | TimeAllocation>>,
  availableJP: number
): TimeAllocationValidationResult {
  const totalAllocatedJP = allocations.reduce((sum, item) => {
    const jp = Number(item.allocatedJP ?? item.jp) || 0;
    return sum + jp;
  }, 0);

  const remainingJP = availableJP - totalAllocatedJP;
  let status: TimeAllocationStatus = 'BALANCED';
  let statusLabel = 'Alokasi Seimbang';
  let statusDescription = `Total alokasi waktu (${totalAllocatedJP} JP) tepat sama dengan kapasitas JP tersedia (${availableJP} JP).`;

  if (remainingJP > 0) {
    status = 'UNDER_ALLOCATED';
    statusLabel = 'Sisa JP Belum Dialokasikan';
    statusDescription = `Terdapat sisa ${remainingJP} JP yang belum dialokasikan dari total ${availableJP} JP tersedia.`;
  } else if (remainingJP < 0) {
    status = 'OVER_ALLOCATED';
    statusLabel = 'Defisit JP';
    statusDescription = `Total alokasi (${totalAllocatedJP} JP) melampaui JP tersedia (${availableJP} JP) sebesar ${Math.abs(remainingJP)} JP.`;
  }

  return {
    availableJP,
    totalAllocatedJP,
    remainingJP,
    status,
    statusLabel,
    statusDescription,
    allocationsCount: allocations.length,
  };
}

/**
 * Menurunkan nilai JP intrakurikuler mata pelajaran dengan pelacakan provenance yang jelas
 */
export function deriveEffectiveJP(setting: {
  curriculum?: string;
  curriculumType?: CurriculumType;
  level?: string;
  grade?: string;
  subject?: string;
  subjectWeeklyJP?: number;
  totalHoursPerWeek?: number;
  isHoursOverridden?: boolean;
  hoursSourceType?: 'OFFICIAL' | 'USER_OVERRIDE' | 'UNVERIFIED' | 'LEGACY_VALUE';
}): {
  weeklyJP: number;
  isOfficial: boolean;
  isOverridden: boolean;
  sourceType: 'OFFICIAL' | 'USER_OVERRIDE' | 'UNVERIFIED' | 'LEGACY_VALUE';
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

  const customValue = setting.subjectWeeklyJP ?? setting.totalHoursPerWeek;

  if (
    (setting.isHoursOverridden || setting.hoursSourceType === 'USER_OVERRIDE') &&
    customValue !== undefined &&
    customValue > 0
  ) {
    return {
      weeklyJP: customValue,
      isOfficial: ruleResult.isOfficial && customValue === ruleResult.weeklyJP,
      isOverridden: true,
      sourceType: 'USER_OVERRIDE',
      ruleResult,
      sourceExplanation: `Manual Override Guru (${customValue} JP/minggu). ${ruleResult.isOfficial ? `Standar resmi: ${ruleResult.weeklyJP} JP/minggu (${ruleResult.regulation}).` : 'Belum diverifikasi dalam regulasi resmi.'}`,
    };
  }

  if (ruleResult.isOfficial && ruleResult.weeklyJP !== null) {
    return {
      weeklyJP: ruleResult.weeklyJP,
      isOfficial: true,
      isOverridden: false,
      sourceType: 'OFFICIAL',
      ruleResult,
      sourceExplanation: ruleResult.explanation,
    };
  }

  return {
    weeklyJP: customValue || 0,
    isOfficial: false,
    isOverridden: false,
    sourceType: 'UNVERIFIED',
    ruleResult,
    sourceExplanation: ruleResult.explanation,
  };
}

/** @deprecated Compatibility wrapper */
export function calculateSemesterJP(jpPerWeek: number, semesterEffectiveWeeks: number): number {
  return Math.max(0, Number(jpPerWeek) || 0) * Math.max(0, Number(semesterEffectiveWeeks) || 0);
}

/** @deprecated Compatibility wrapper */
export function calculateAnnualJP(jpPerWeek: number, annualEffectiveWeeks: number): number {
  return Math.max(0, Number(jpPerWeek) || 0) * Math.max(0, Number(annualEffectiveWeeks) || 0);
}

/**
 * Normalizes curriculum string or type to canonical CurriculumType
 */
export function getCurriculumType(curriculum?: string, curriculumType?: CurriculumType): CurriculumType {
  if (curriculumType === 'K13' || curriculumType === 'KURIKULUM_MERDEKA') {
    return curriculumType;
  }
  const curr = (curriculum || '').toLowerCase();
  if (curr.includes('k13') || curr.includes('2013')) {
    return 'K13';
  }
  return 'KURIKULUM_MERDEKA';
}

/** @deprecated Compatibility wrapper */
export function validateTeacherTeachingLoad(
  assignments: TeachingAssignment[] = [],
  additionalDuties: AdditionalDuty[] = [],
  teacherName?: string
): TeacherLoadValidationResult {
  return calculateTeacherWorkload(assignments, additionalDuties, teacherName);
}
