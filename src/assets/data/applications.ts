export const SETUPS = ["Remote", "Hybrid", "On-site"];

export type ApplicationEntry = {
  id: number;
  title: string;
  company: string;
  salary: number | null; // null = not listed
  setup: string;
  remarks: string;
  status: string;
  link: string;
};

// Mock data keyed by date (YYYY-MM-DD). Replace with your Spring Boot API later.
export const MOCK_APPLICATIONS: Record<string, ApplicationEntry[]> = {
  "2026-11-03": [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Acme Corp",
      salary: 60000,
      setup: "Hybrid",
      remarks: "Referred by a friend",
      status: "Applied",
      link: "https://example.com/jobs/frontend-developer",
    },
    {
      id: 2,
      title: "Java Developer",
      company: "Globex",
      salary: 85000,
      setup: "Remote",
      remarks: "Technical interview on Friday",
      status: "Interview",
      link: "https://example.com/jobs/java-developer",
    },
  ],
  "2026-11-04": [
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Initech",
      salary: null,
      setup: "On-site",
      remarks: "Salary not listed",
      status: "Applied",
      link: "https://example.com/jobs/full-stack-engineer",
    },
  ],
  "2026-11-10": [
    {
      id: 4,
      title: "Backend Engineer",
      company: "Umbrella",
      salary: 95000,
      setup: "Remote",
      remarks: "Spring Boot + MySQL",
      status: "Applied",
      link: "https://example.com/jobs/backend-engineer",
    },
    {
      id: 5,
      title: "React Developer",
      company: "Hooli",
      salary: 70000,
      setup: "Hybrid",
      remarks: "",
      status: "Offer",
      link: "https://example.com/jobs/react-developer",
    },
    {
      id: 6,
      title: "QA Engineer",
      company: "Stark Tech",
      salary: 55000,
      setup: "On-site",
      remarks: "Rejected after final round",
      status: "Rejected",
      link: "https://example.com/jobs/qa-engineer",
    },
  ],
};
