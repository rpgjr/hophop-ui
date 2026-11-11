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

// ---- meta tag mappings (Settings > Meta tags) ----
export const FORM_FIELDS = [
  "TITLE",
  "COMPANY",
  "SALARY_MIN",
  "SALARY_MAX",
  "SALARY_CURRENCY",
  "EMPLOYMENT_TYPE",
  "SETUP",
  "LOCATION",
  "DESCRIPTION",
  "REMARKS",
] as const;
export type FormField = (typeof FORM_FIELDS)[number];

export const FIELD_LABELS: Record<FormField, string> = {
  TITLE: "Job title",
  COMPANY: "Company",
  SALARY_MIN: "Salary min",
  SALARY_MAX: "Salary max",
  SALARY_CURRENCY: "Currency",
  EMPLOYMENT_TYPE: "Employment type",
  SETUP: "Setup",
  LOCATION: "Location",
  DESCRIPTION: "Description",
  REMARKS: "Remarks",
};

export type SourceType = "META" | "JSON_LD";

export type MappingEntry = {
  field: FormField;
  sourceType: SourceType;
  sourceKey: string;
};

export type SiteMappingGroup = { host: string; mappings: MappingEntry[] };

// one tag found on a sample page
export type Candidate = { type: SourceType; key: string; value: string };

export type InspectResult = {
  host: string;
  candidates: Candidate[];
  mappings: MappingEntry[]; // rules already saved for this host
};
