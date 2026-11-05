import { ExternalLink, Eye, Trash2 } from "lucide-react";
import type { ApplicationEntry } from "../../api/types";

type Props = {
  entry: ApplicationEntry;
  onRemove: (entry: ApplicationEntry) => void;
};

export default function ActionButtons({ entry, onRemove }: Props) {
  return (
    <div className="flex gap-1">
      <a
        href={entry.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-soft btn-primary btn-square btn-sm"
        aria-label="Open job posting"
        title="Open job posting"
      >
        <ExternalLink size={16} />
      </a>
      <button
        className="btn btn-soft btn-square btn-sm btn-success hover:text-white"
        aria-label="Remove application"
        title="Remove application"
      >
        <Eye size={16} />
      </button>

      <button
        className="btn btn-soft btn-square btn-sm btn-error hover:text-white"
        onClick={() => onRemove(entry)}
        aria-label="Remove application"
        title="Remove application"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
