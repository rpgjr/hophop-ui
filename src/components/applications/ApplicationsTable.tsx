import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  deleteApplication,
  getApplications,
  getStatuses,
  updateApplicationStatus,
} from "../../api/client";
import type { ApplicationEntry, Currency, Status } from "../../api/types";
import { CURRENCY_LOCALE, CURRENCY_SYMBOLS } from "../../config";
import ActionButtons from "./ActionButtons";
import StatusSelect from "./StatusSelect";

type SortKey = "salary" | "setup" | "status";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function formatSalary(
  min: number | null,
  max: number | null,
  currency: Currency,
): string {
  if (min === null) return "—";
  const fmt = (n: number) =>
    `${CURRENCY_SYMBOLS[currency]}${n.toLocaleString(CURRENCY_LOCALE)}`;
  return max === null || max === min ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

// Below md, each row turns into a card and each cell shows its data-label
const ROW =
  "max-md:mb-3 max-md:block max-md:rounded-box max-md:border max-md:border-base-300 max-md:bg-base-100 max-md:p-3";
const CELL =
  "max-md:flex max-md:items-center max-md:justify-between max-md:gap-4 max-md:px-0 max-md:py-1.5 max-md:before:text-xs max-md:before:font-semibold max-md:before:opacity-60 max-md:before:content-[attr(data-label)]";

function SortHeader({
  label,
  column,
  sort,
  onSort,
}: {
  label: string;
  column: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  let icon = <ArrowUpDown size={14} className="opacity-40" />;
  if (sort && sort.key === column) {
    icon = sort.dir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  }

  return (
    <th>
      <button
        className="flex items-center gap-1 font-semibold"
        onClick={() => onSort(column)}
      >
        {label}
        {icon}
      </button>
    </th>
  );
}

export default function ApplicationsTable({ date }: { date: string }) {
  const [entries, setEntries] = useState<ApplicationEntry[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>(null);

  // click once = ascending, twice = descending, third time = no sort
  const handleSort = (key: SortKey) => {
    if (!sort || sort.key !== key) setSort({ key, dir: "asc" });
    else if (sort.dir === "asc") setSort({ key, dir: "desc" });
    else setSort(null);
  };

  useEffect(() => {
    Promise.all([getApplications(date, date), getStatuses()])
      .then(([apps, sts]) => {
        setEntries(apps);
        setStatuses(sts);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [date]);

  const handleStatusChange = (id: number, statusId: number) => {
    updateApplicationStatus(id, statusId)
      .then((updated) =>
        setEntries((prev) => prev.map((e) => (e.id === id ? updated : e))),
      )
      .catch((err: Error) => setError(err.message));
  };

  const handleRemove = (entry: ApplicationEntry) => {
    if (!window.confirm(`Remove "${entry.title}" at ${entry.company}?`)) return;
    deleteApplication(entry.id)
      .then(() => setEntries((prev) => prev.filter((e) => e.id !== entry.id)))
      .catch((err: Error) => setError(err.message));
  };

  const sorted = useMemo(() => {
    if (!sort) return entries;
    const dir = sort.dir === "asc" ? 1 : -1;

    return [...entries].sort((a, b) => {
      if (sort.key === "salary") {
        if (a.salaryMin === null) return 1; // no salary always goes last
        if (b.salaryMin === null) return -1;
        return (a.salaryMin - b.salaryMin) * dir;
      }
      if (sort.key === "setup") {
        return a.setup.localeCompare(b.setup) * dir;
      }
      return a.status.name.localeCompare(b.status.name) * dir;
    });
  }, [entries, sort]);

  if (loading) {
    return <span className="loading loading-spinner" aria-label="Loading" />;
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div role="alert" className="alert">
        No applications on this date.
      </div>
    );
  }

  return (
    <>
      {/* Mobile only: table headers are hidden there, so sorting is a dropdown */}
      <select
        className="select select-sm mb-3 w-full md:hidden"
        value={sort ? `${sort.key}-${sort.dir}` : ""}
        onChange={(e) => {
          if (!e.target.value) return setSort(null);
          const [key, dir] = e.target.value.split("-");
          setSort({ key: key as SortKey, dir: dir as "asc" | "desc" });
        }}
        aria-label="Sort applications"
      >
        <option value="">Sort: default</option>
        <option value="salary-desc">Salary: high to low</option>
        <option value="salary-asc">Salary: low to high</option>
        <option value="setup-asc">Setup: A to Z</option>
        <option value="status-asc">Status: A to Z</option>
        <option value="status-desc">Status: Z to A</option>
      </select>

      <div className="rounded-box border-base-300 overflow-x-auto md:border">
        <table className="table max-md:block md:table-zebra">
          <thead className="max-md:hidden">
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Company</th>
              <SortHeader
                label="Salary"
                column="salary"
                sort={sort}
                onSort={handleSort}
              />
              <SortHeader
                label="Setup"
                column="setup"
                sort={sort}
                onSort={handleSort}
              />
              <th>Remarks</th>
              <SortHeader
                label="Status"
                column="status"
                sort={sort}
                onSort={handleSort}
              />
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {sorted.map((e) => (
              <tr key={e.id} className={ROW}>
                <td className="max-md:hidden">{e.id}</td>
                <td
                  data-label="Job Title"
                  className={`${CELL} max-md:font-semibold`}
                >
                  {e.title}
                </td>
                <td data-label="Company" className={CELL}>
                  {e.company}
                </td>
                <td data-label="Salary" className={`${CELL} whitespace-nowrap`}>
                  {formatSalary(e.salaryMin, e.salaryMax, e.salaryCurrency)}
                </td>
                <td data-label="Setup" className={CELL}>
                  <span className="badge badge-outline">{e.setup}</span>
                </td>
                <td
                  data-label="Remarks"
                  className={`${CELL} md:max-w-48 md:truncate`}
                  title={e.remarks ?? undefined}
                >
                  {e.remarks || "—"}
                </td>
                <td data-label="Status" className={CELL}>
                  <StatusSelect
                    value={e.status}
                    statuses={statuses}
                    label={e.title}
                    onChange={(s) => handleStatusChange(e.id, s)}
                  />
                </td>
                <td data-label="Action" className={CELL}>
                  <ActionButtons entry={e} onRemove={handleRemove} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
