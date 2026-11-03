import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_APPLICATIONS } from "../../assets/data/applications";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Calendar() {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toDateKey(new Date());

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (offset: number) =>
    setViewDate(new Date(year, month + offset, 1));

  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card bg-base-100 w-full shadow-xl sm:min-h-[calc(100vh-10rem)]">
      <div className="card-body p-3 sm:p-6">
        {/* Month header */}
        <div className="flex items-center justify-between">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="card-title text-lg sm:text-2xl">{monthLabel}</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold opacity-60 sm:gap-2 sm:text-sm">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days: square cells on mobile, stretch to fill height on sm and up */}
        <div className="grid grid-cols-7 gap-1 sm:flex-1 sm:auto-rows-fr sm:gap-2">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;

            const key = toDateKey(new Date(year, month, day));
            const isToday = key === todayKey;
            const count = MOCK_APPLICATIONS[key]?.length ?? 0;

            return (
              <button
                key={key}
                onClick={() => navigate(`/applications/${key}`)}
                className={`rounded-box flex aspect-square flex-col items-center justify-center gap-0.5 border p-1 transition-colors sm:aspect-auto sm:min-h-24 sm:justify-start sm:gap-1 sm:p-2 ${
                  isToday
                    ? "bg-primary text-primary-content border-primary"
                    : "border-base-300 hover:bg-base-200"
                }`}
              >
                <span className="text-sm font-semibold sm:text-lg">{day}</span>
                {count > 0 && (
                  <span className="badge badge-secondary badge-xs whitespace-nowrap sm:badge-sm">
                    {count}
                    <span className="hidden sm:inline">&nbsp;applied</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
