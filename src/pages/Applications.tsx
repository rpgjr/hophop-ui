import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ApplicationsTable from "../components/applications/ApplicationsTable";

export default function Applications() {
  const { date } = useParams<{ date: string }>();

  const isValid = !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValid) {
    return (
      <div className="mx-auto max-w-6xl">
        <div role="alert" className="alert alert-error">
          Invalid date.
        </div>
        <Link to="/" className="btn mt-4">
          Back to calendar
        </Link>
      </div>
    );
  }

  const [y, m, d] = date.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/" className="btn btn-ghost btn-sm mb-3">
        <ArrowLeft size={16} />
        Back to calendar
      </Link>
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">{label}</h1>

      {/* key makes the table start fresh when the date in the URL changes */}
      <ApplicationsTable key={date} date={date} />
    </div>
  );
}
