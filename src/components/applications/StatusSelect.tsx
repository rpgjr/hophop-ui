import { STATUSES } from "../../assets/data/statuses";

type Props = {
  value: string;
  label: string; // job title, for screen readers
  onChange: (status: string) => void;
};

export default function StatusSelect({ value, label, onChange }: Props) {
  // keep showing the current value even if it was removed from the list
  const options = STATUSES.includes(value) ? STATUSES : [...STATUSES, value];

  return (
    <select
      className="select select-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Status for ${label}`}
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
