export type PeriodType = 'class' | 'recess' | 'exam' | 'vacation';

export interface Period {
  date_start: string;
  date_end: string;
  type: PeriodType;
}

// Used to represent a term or semester
export interface Term {
  type: string;
  label: string;
  periods: Period[];
}

export interface Year {
  label: string;
  terms: Term[];
}

export interface Uni {
  name: string;
  years: Year[];
}
