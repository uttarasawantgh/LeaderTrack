import { useAppContext } from "../context/AppContext";
import { getTodayDate } from "../utils/streak";

export default function BedtimeWidget() {
  const { data, actions } = useAppContext();
  const today = getTodayDate();
  const completedToday = data.bedtimeLogs.includes(today);

  function handleToggle() {
    // Default to the first book if available
    const defaultBookId = data.books[0]?.id ?? "navigating-change";
    actions.toggleBedtime(today, defaultBookId);
  }

  return (
    <section className="mb-6">
      <div
        className="rounded-xl bg-bg-card border border-border-subtle p-4 relative overflow-hidden"
        style={{ borderLeft: "4px solid #7c3aed" }}
      >
        <div className="mb-3">
          <h2 className="text-sm font-semibold" style={{ color: "#7c3aed" }}>
            🌙 Evening Reading Routine
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Mark your screen-free physical reading as complete
          </p>
        </div>

        {completedToday ? (
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm font-medium text-success">
                Completed
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Tonight's ritual is done
            </p>
            <button
              type="button"
              onClick={handleToggle}
              className="text-xs text-text-secondary underline hover:text-text-primary transition-colors duration-150 cursor-pointer"
            >
              Undo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: "#7c3aed" }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span>Done: Evening Reading Session</span>
              <span className="text-xs opacity-70 font-normal">
                Tap when you've finished your evening reading
              </span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}