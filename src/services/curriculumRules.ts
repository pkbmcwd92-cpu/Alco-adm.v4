import { CurriculumType } from '../types';
import { getSubjectJP, MASTER_CURRICULUM_STRUCTURE, getCurriculumType } from './jpEngine';

export * from './jpEngine';

export interface OfficialJPRule {
  level: 'SD' | 'SMP' | 'SMA' | 'SMK';
  grade: string;
  subject: string;
  weeklyJP: number;
  annualJP?: number;
  regulationReference: string;
  curriculumType: CurriculumType;
}

export interface JPRuleLookupResult {
  weeklyJP: number;
  annualJP?: number;
  isOfficial: boolean;
  regulationReference?: string;
  curriculumType: CurriculumType;
}

/**
 * Standard Official Structure of Curriculum for Indonesia (Backwards-compatible view)
 */
export const OFFICIAL_JP_DATABASE: OfficialJPRule[] = MASTER_CURRICULUM_STRUCTURE.map((item) => ({
  level: item.level as 'SD' | 'SMP' | 'SMA' | 'SMK',
  grade: item.grade,
  subject: item.subject,
  weeklyJP: item.weeklyJP,
  annualJP: item.annualJP,
  regulationReference: item.regulation,
  curriculumType: item.curriculumType,
}));

/**
 * Looks up official weekly hours per week (JP) based on level, grade, subject, and curriculum.
 * Delegates to centralized getSubjectJP in jpEngine.ts.
 */
export function lookupOfficialWeeklyJP(
  curriculum: string,
  level: string = 'SD',
  grade: string = 'Kelas 1',
  subject: string = 'Bahasa Indonesia'
): JPRuleLookupResult {
  const result = getSubjectJP({
    curriculum,
    level,
    grade,
    subject,
  });

  return {
    weeklyJP: result.weeklyJP,
    annualJP: result.annualJP,
    isOfficial: result.isOfficial,
    regulationReference: result.isOfficial ? result.regulation : undefined,
    curriculumType: result.curriculumType,
  };
}
