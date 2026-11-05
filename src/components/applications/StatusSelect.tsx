import type { Status } from "../../api/types";

type Props = {
  value: Status;
  statuses: Status[];
  label: string; // job title, for screen readers
  onChange: (statusId: number) => void;
};

export default function StatusSelect({ value, statuses, label, onChange }: Props) {
  return (
    <select
      className="select select-sm font-semibold"
      style={{ color: value.color, borderColor: value.color }}
      value={value.id}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={`Status for ${label}`}
    >
      {statuses.map((s) => (
        <option key={s.id} value={s.id} style={{ color: s.color }}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
