export const SETUPS = ["Onsite", "Hybrid", "WFH"] as const;
export const CURRENCIES = ["PHP", "USD"] as const;
export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contractual",
] as const;

export type Setup = (typeof SETUPS)[number];
export type Currency = (typeof CURRENCIES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type Status = {
  id: number;
  name: string;
  color: string; // hex, e.g. #3b82f6
};

export type ApplicationEntry = {
  id: number;
  title: string;
  company: string;
  salaryMin: number | null; // null = not listed
  salaryMax: number | null; // null or = salaryMin for a single amount
  salaryCurrency: Currency;
  employmentType: EmploymentType | null;
  setup: Setup;
  remarks: string | null;
  link: string;
  appliedDate: string; // YYYY-MM-DD
  status: Status;
};
