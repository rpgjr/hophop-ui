import { useEffect, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import {
  createSiteMapping,
  inspectSite,
  suggestMappings,
  updateSiteMapping,
} from "../../api/client";
import {
  FIELD_LABELS,
  FORM_FIELDS,
  type Candidate,
  type FormField,
  type MappingEntry,
  type SiteMappingGroup,
  type SourceType,
} from "../../api/types";

type Row = { sourceType: SourceType; sourceKey: string };
type Rows = Record<FormField, Row>;

const emptyRows = (): Rows =>
  Object.fromEntries(
    FORM_FIELDS.map((f) => [f, { sourceType: "META", sourceKey: "" }]),
  ) as Rows;

const toRows = (entries: MappingEntry[]): Rows => {
  const rows = emptyRows();
  for (const e of entries) {
    rows[e.field] = { sourceType: e.sourceType, sourceKey: e.sourceKey };
  }
  return rows;
};

type Props = {
  group: SiteMappingGroup | null; // null = a new website
  onClose: () => void;
  onSaved: () => void;
};

export default function MappingEditor({ group, onClose, onSaved }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [host, setHost] = useState(group?.host ?? "");
  // true when this website already has rules, so Save must update instead of create
  const [exists, setExists] = useState(group !== null);
  const [url, setUrl] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [rows, setRows] = useState<Rows>(() => toRows(group?.mappings ?? []));
  const [busy, setBusy] = useState<"inspect" | "ai" | "save" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // show the dialog as soon as the editor mounts
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleInspect = () => {
    setBusy("inspect");
    setError(null);
    inspectSite(url.trim())
      .then((res) => {
        setHost(res.host);
        setExists(res.mappings.length > 0);
        setCandidates(res.candidates);
        // load rules saved earlier for this website, unless the user already filled some in
        const empty = FORM_FIELDS.every((f) => !rows[f].sourceKey);
        if (empty && res.mappings.length > 0) setRows(toRows(res.mappings));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setBusy(null));
  };

  const handleSuggest = () => {
    setBusy("ai");
    setError(null);
    suggestMappings(url.trim())
      .then((entries) => setRows(toRows(entries)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setBusy(null));
  };

  const handleSave = () => {
    const entries: MappingEntry[] = FORM_FIELDS.filter(
      (f) => rows[f].sourceKey.trim() !== "",
    ).map((f) => ({
      field: f,
      sourceType: rows[f].sourceType,
      sourceKey: rows[f].sourceKey.trim(),
    }));

    setBusy("save");
    setError(null);
    (exists ? updateSiteMapping : createSiteMapping)(host, entries)
      .then(() => {
        onSaved();
        dialogRef.current?.close();
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setBusy(null));
  };

  const setRow = (field: FormField, change: Partial<Row>) =>
    setRows((prev) => ({ ...prev, [field]: { ...prev[field], ...change } }));

  const sampleFor = (row: Row) =>
    candidates.find((c) => c.type === row.sourceType && c.key === row.sourceKey)
      ?.value;

  const hasUrl = url.trim() !== "";

  return (
    // onClose fires on Esc, the X button and the backdrop, so the parent can unmount the editor
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-4xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
            ✕
          </button>
        </form>
        <h3 className="mb-1 text-lg font-bold">
          {group ? `Edit ${group.host}` : "Add website"}
        </h3>
        <p className="mb-4 text-sm opacity-70">
          Paste any one job link from the website. HopHop lists its tags and you
          pick which tag fills each field. Use Suggest with AI to pick for you.
        </p>

        {error && (
          <div role="alert" className="alert alert-error mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="url"
            className="input min-w-0 flex-1"
            placeholder="https://... (a job link from this website)"
            aria-label="Sample job link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="btn btn-soft"
            disabled={!hasUrl || busy !== null}
            onClick={handleInspect}
          >
            {busy === "inspect" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <Search size={18} />
            )}
            Find tags
          </button>
          <button
            className="btn btn-soft btn-secondary"
            disabled={!hasUrl || busy !== null}
            onClick={handleSuggest}
          >
            {busy === "ai" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <Sparkles size={18} />
            )}
            Suggest with AI
          </button>
        </div>

        {host && (
          <p className="mb-3 text-sm">
            Website: <span className="font-mono font-semibold">{host}</span>
          </p>
        )}

        {/* the lists the key boxes suggest from, one per source type */}
        {(["META", "JSON_LD"] as const).map((type) => (
          <datalist key={type} id={`keys-${type}`}>
            {candidates
              .filter((c) => c.type === type)
              .map((c) => (
                <option key={c.key} value={c.key}>
                  {c.value}
                </option>
              ))}
          </datalist>
        ))}

        <div className="flex flex-col gap-2">
          {FORM_FIELDS.map((field) => {
            const row = rows[field];
            const sample = sampleFor(row);
            return (
              <div
                key={field}
                className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[9rem_7rem_1fr]"
              >
                <span className="text-sm font-semibold">
                  {FIELD_LABELS[field]}
                </span>
                <select
                  className="select select-sm w-full"
                  aria-label={`Source type for ${FIELD_LABELS[field]}`}
                  value={row.sourceType}
                  onChange={(e) =>
                    setRow(field, { sourceType: e.target.value as SourceType })
                  }
                >
                  <option value="META">Meta tag</option>
                  <option value="JSON_LD">JSON-LD</option>
                </select>
                <div className="min-w-0">
                  <input
                    className="input input-sm w-full font-mono"
                    list={`keys-${row.sourceType}`}
                    placeholder="Not mapped"
                    aria-label={`Tag for ${FIELD_LABELS[field]}`}
                    value={row.sourceKey}
                    onChange={(e) =>
                      setRow(field, { sourceKey: e.target.value })
                    }
                  />
                  {sample && (
                    <p
                      className="mt-0.5 truncate text-xs opacity-60"
                      title={sample}
                    >
                      e.g. {sample}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={!host || busy !== null}
            onClick={handleSave}
          >
            {busy === "save" && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Save mapping
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
