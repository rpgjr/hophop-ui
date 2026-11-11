import { useEffect, useState } from "react";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { deleteSiteMapping, getSiteMappings } from "../../api/client";
import { FIELD_LABELS, type SiteMappingGroup } from "../../api/types";
import MappingEditor from "./MappingEditor";

// null = closed, "new" = add a website, a group = edit that website
type Editing = null | "new" | SiteMappingGroup;

export default function MetaTagMappings() {
  const [groups, setGroups] = useState<SiteMappingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    getSiteMappings()
      .then(setGroups)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  const handleDelete = (host: string) => {
    if (!window.confirm(`Remove all saved tags for ${host}?`)) return;
    deleteSiteMapping(host)
      .then(() => setReloadKey((k) => k + 1))
      .catch((err: Error) => setError(err.message));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="max-w-xl opacity-70">
          Tell HopHop which tag on each website holds the job title, company,
          salary and so on. Saved tags are used when you add a job from that
          website.
        </p>
        <button
          className="btn btn-soft btn-primary shrink-0"
          onClick={() => setEditing("new")}
        >
          <CirclePlus size={20} />
          Add website
        </button>
      </div>

      {error && (
        <div role="alert" className="alert alert-error mb-4">
          {error}
        </div>
      )}

      {loading && (
        <span className="loading loading-spinner" aria-label="Loading" />
      )}

      {!loading && groups.length === 0 && (
        <div role="alert" className="alert">
          No websites saved yet. Click Add website and paste one job link.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.host} className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="card-title text-base">{g.host}</h2>
                <div className="flex gap-1">
                  <button
                    className="btn btn-soft btn-square btn-sm"
                    aria-label={`Edit ${g.host}`}
                    onClick={() => setEditing(g)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn btn-soft btn-square btn-sm btn-error"
                    aria-label={`Remove ${g.host}`}
                    onClick={() => handleDelete(g.host)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <table className="table table-sm">
                <tbody>
                  {g.mappings.map((m) => (
                    <tr key={m.field}>
                      <td className="font-semibold">{FIELD_LABELS[m.field]}</td>
                      <td className="font-mono text-xs">
                        <span className="badge badge-ghost badge-sm mr-2">
                          {m.sourceType === "META" ? "meta" : "json-ld"}
                        </span>
                        {m.sourceKey}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <MappingEditor
          // a new key remounts the editor, so it never shows the previous site's rows
          key={editing === "new" ? "new" : editing.host}
          group={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => setReloadKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
