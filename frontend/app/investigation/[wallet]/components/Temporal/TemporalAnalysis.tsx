import {
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function TemporalAnalysis({
  investigation,
}: Props) {
  const temporal =
    investigation?.data
      ?.transactionAnalysis
      ?.temporalIntelligence || {};

  const activityPattern =
    temporal?.activityPattern ||
    "Unknown Pattern";

  const rapidBursts =
    temporal?.rapidBursts || 0;

  const nightActivity =
    temporal?.nightActivity || 0;

  const mostActiveHour =
    temporal?.mostActiveHour ||
    "00:00";

  const hours = [
    "00",
    "02",
    "04",
    "06",
    "08",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
  ];

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  /* ===================================== */
  /* DYNAMIC HEATMAP */
  /* ===================================== */

  const heatmap =
    temporal?.heatmap || [
      [0, 0, 1, 3, 3, 3, 1, 1, 1, 2, 1, 1],
      [0, 0, 0, 3, 3, 3, 0, 3, 0, 0, 1, 1],
      [1, 0, 1, 3, 3, 2, 1, 0, 1, 1, 2, 1],
      [0, 1, 1, 3, 1, 1, 1, 3, 1, 0, 0, 0],
      [0, 2, 0, 3, 3, 2, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 3, 3, 1, 3, 0, 0, 0, 1],
      [0, 0, 2, 3, 2, 3, 1, 0, 0, 0, 1, 0],
    ];

  return (
    <div
      className="
        h-full
        flex
        flex-col
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-2
          mb-6
        "
      >
        <h2
          className="
            text-white
            text-[28px]
            font-semibold
            tracking-tight
          "
        >
          TEMPORAL ANALYSIS
        </h2>

        <div
          className="
            relative
            group
            cursor-pointer
            mt-1
          "
        >
          <Info
            size={18}
            className="
              text-zinc-500
              hover:text-cyan-400
              transition
            "
          />

          {/* TOOLTIP */}

          <div
            className="
              absolute
              left-1/2
              top-7
              -translate-x-1/2
              opacity-0
              group-hover:opacity-100
              pointer-events-none
              transition
              z-50
            "
          >
            <div
              className="
                whitespace-nowrap
                rounded-xl
                border
                border-cyan-500/10
                bg-[#081221]
                px-3
                py-2
                text-xs
                text-zinc-300
                shadow-[0_0_25px_rgba(0,255,255,0.06)]
              "
            >
              Activity timing and
              settlement behavior.
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-3
          gap-5
          mb-8
        "
      >
        <StatCard
          label="Most Active Hour (UTC)"
          value={mostActiveHour}
        />

        <StatCard
          label="Rapid Bursts"
          value={String(
            rapidBursts
          )}
        />

        <StatCard
          label="Night Activity"
          value={String(
            nightActivity
          )}
        />
      </div>

      {/* HEATMAP */}

      <div
        className="
          flex
          flex-col
          gap-3
        "
      >
        {/* HOURS */}

        <div
          className="
            grid
            grid-cols-[50px_repeat(12,minmax(0,1fr))]
            gap-2
            pl-1
          "
        >
          <div />

          {hours.map(
            (hour) => (
              <div
                key={hour}
                className="
                  text-center
                  text-sm
                  text-zinc-400
                  font-medium
                "
              >
                {hour}
              </div>
            )
          )}
        </div>

        {/* GRID */}

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          {days.map(
            (
              day,
              rowIndex
            ) => (
              <div
                key={day}
                className="
                  grid
                  grid-cols-[50px_repeat(12,minmax(0,1fr))]
                  gap-2
                  items-center
                "
              >
                {/* DAY */}

                <div
                  className="
                    text-sm
                    text-zinc-300
                    font-medium
                  "
                >
                  {day}
                </div>

                {/* CELLS */}

                {(
                  heatmap[
                    rowIndex
                  ] || []
                ).map(
                  (
                    value: number,
                    cellIndex: number
                  ) => (
                    <div
                      key={
                        cellIndex
                      }
                      className={`
                        aspect-square
                        rounded-[6px]
                        border
                        border-cyan-500/10
                        ${
                          value === 0
                            ? "bg-[#09111d]"
                            : value === 1
                            ? "bg-blue-950"
                            : value === 2
                            ? "bg-blue-700"
                            : "bg-blue-500"
                        }
                      `}
                    />
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* FOOTER */}

      <div
        className="
          mt-auto
          pt-6
        "
      >
        <p
          className="
            text-zinc-400
            text-lg
          "
        >
          Pattern:{" "}

          <span
            className="
              text-white
              font-medium
            "
          >
            {activityPattern}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ========================= */

function StatCard({
  label,
  value,
}: any) {
  return (
    <div
      className="
        border-r
        border-cyan-500/10
        last:border-r-0
        pr-4
      "
    >
      <p
        className="
          text-zinc-400
          text-sm
          mb-3
        "
      >
        {label}
      </p>

      <h3
        className="
          text-white
          text-5xl
          font-semibold
          tracking-tight
        "
      >
        {value}
      </h3>
    </div>
  );
}