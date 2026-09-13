import { CurriculumType } from './index';

export type JPVerificationStatus = 'VERIFIED' | 'UNVERIFIED';

/**
 * Model Master Struktur Kurikulum Resmi Pemerintah
 */
export interface MasterCurriculumStructure {
  id: string;
  curriculum: string; // e.g. "Kurikulum Merdeka", "Kurikulum 2013"
  curriculumType: CurriculumType; // 'KURIKULUM_MERDEKA' | 'K13'
  regulation: string; // e.g. "Kepmendikbudristek No. 12/2024", "Permendikbud No. 37/2018"
  regulationYear: string | number; // "2024", "2018"
  level: 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'SMK';
  phase?: string; // "Fase Pondasi", "Fase A", "Fase B", "Fase C", "Fase D", "Fase E", "Fase F"
  grade: string; // e.g. "Kelas 1", "Kelas 4", "Kelas 7", "Kelas 10"
  subject: string; // e.g. "Pendidikan Pancasila", "Bahasa Indonesia", "PJOK"
  weeklyJP: number; // Alokasi Tatap Muka / Intrakurikuler per Minggu
  annualJP: number; // Alokasi Total JP Intrakurikuler per Tahun
  kokurikulerJP?: number; // Alokasi P5 / Kokurikuler per Tahun (jika ada)
  totalAnnualJP?: number; // Total Intrakurikuler + Kokurikuler per Tahun
  source: string; // e.g. "BSKAP Kemendikbudristek RI"
  sourceUrl?: string; // e.g. "https://kurikulum.kemdikbud.go.id"
  effectiveFrom: string; // YYYY-MM-DD
  effectiveUntil?: string; // YYYY-MM-DD (jika sudah dicabut/diganti)
  verificationStatus: JPVerificationStatus; // 'VERIFIED' | 'UNVERIFIED'
  notes?: string;
}

/**
 * Parameter Query Pencarian JP Mata Pelajaran
 */
export interface SubjectJPQuery {
  curriculum?: string;
  curriculumType?: CurriculumType;
  level?: string;
  grade?: string;
  subject?: string;
  academicYear?: string;
}

/**
 * Hasil Lookup JP Mata Pelajaran
 */
export interface SubjectJPResult {
  weeklyJP: number;
  annualJP?: number;
  kokurikulerJP?: number;
  totalAnnualJP?: number;
  isOfficial: boolean;
  verificationStatus: JPVerificationStatus;
  statusLabel: string; // "Terverifikasi Resmi" | "Belum diverifikasi"
  regulation: string;
  regulationYear: string | number;
  source: string;
  sourceUrl?: string;
  effectiveFrom?: string;
  curriculumType: CurriculumType;
  matchedRule?: MasterCurriculumStructure;
  explanation: string;
}

/**
 * Penugasan Mengajar Guru per Rombel / Kelas
 */
export interface TeachingAssignment {
  id?: string;
  subject: string;
  level: 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'SMK' | string;
  grade: string; // e.g. "Kelas 4A", "Kelas 7B"
  curriculum?: string;
  weeklyJP: number; // JP per minggu per rombel dari struktur kurikulum (atau override resmi)
  classCount: number; // Jumlah rombel kelas (default 1)
  isCertifiedSubject?: boolean; // Linier dengan sertifikat pendidik
  notes?: string;
}

/**
 * Tugas Tambahan Guru dan Ekuivalensi Beban Mengajarnya (Permendikbud 15/2018)
 */
export interface AdditionalDuty {
  id?: string;
  role: string; // e.g. "Wakil Kepala Sekolah", "Wali Kelas", "Kepala Perpustakaan", "Pembina OSIS/Ekskul", "Koordinator P5"
  equivalentWeeklyJP: number; // Ekuivalensi JP per minggu
  decreeNumber?: string; // Nomor SK Penugasan
  notes?: string;
}

/**
 * Hasil Validasi Beban Mengajar Guru
 */
export interface TeacherLoadValidationResult {
  teacherName?: string;
  totalDirectTeachingJP: number; // Total JP tatap muka riil (Σ classCount × weeklyJP)
  totalAdditionalDutiesJP: number; // Total JP tugas tambahan
  totalWorkloadJP: number; // Total Beban Pembelajaran Guru (tatap muka + tugas tambahan)
  minimumRequirementJP: number; // Standar minimal: 24 JP/minggu
  maximumRequirementJP: number; // Standar maksimal: 40 JP/minggu
  isMinimumFulfilled: boolean; // totalWorkloadJP >= 24
  isWithinMaximum: boolean; // totalWorkloadJP <= 40
  status: 'BELUM_MEMENUHI' | 'MEMENUHI' | 'MELEBIHI_BATAS_MAKSIMAL';
  statusLabel: string;
  statusDescription: string;
  breakdown: {
    assignments: Array<{
      subject: string;
      grade: string;
      weeklyJP: number;
      classCount: number;
      subtotalJP: number;
    }>;
    additionalDuties: Array<{
      role: string;
      equivalentWeeklyJP: number;
      decreeNumber?: string;
    }>;
  };
  regulatoryBasis: string; // e.g. "Permendikbud No. 15 Tahun 2018 jo Permendikbudristek No. 25 Tahun 2024"
}

/**
 * Hasil Perhitungan Alokasi Waktu Pembelajaran
 */
export interface AvailableJPCalculation {
  jpPerWeek: number;
  effectiveWeeks: number;
  availableJP: number;
  formula: string; // "JP per minggu × minggu efektif = JP tersedia"
  formulaCalculation: string; // "4 JP/minggu × 18 minggu = 72 JP"
  details: {
    semester?: string;
    academicYear?: string;
    level?: string;
    grade?: string;
    subject?: string;
  };
}
