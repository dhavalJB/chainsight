import {
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function TransactionIntelligence({
  investigation,
}: Props) {
  const summary =
    investigation?.data
      ?.transactionAnalysis
      ?.summary || {};

  const behavior =
    investigation?.data
      ?.transactionAnalysis
      ?.behavior || {};

  const analyzedTransactions =
    behavior?.analyzedTransactions ||
    [];

  const transactions =
    analyzedTransactions || [];

  const totalTransactions =
    summary?.totalTransactions ||
    0;

  const stablecoinTransactions =
    summary?.stablecoinTransactions ||
    0;

  const incoming =
    summary?.incoming || 0;

  const outgoing =
    summary?.outgoing || 0;

  const stablecoinPercentage =
    totalTransactions > 0
      ? (
          (stablecoinTransactions /
            totalTransactions) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div
      className="
        h-full
        flex
        flex-col
        min-h-0
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          mb-4
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
          TRANSACTION{" "}
          INTELLIGENCE
        </h2>

        <span
          className="
            text-zinc-500
            text-lg
          "
        >
          (
          {
            transactions.length
          }{" "}
          Transactions)
        </span>

        {/* INFO */}

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
              Latest operational
              settlement
              transactions.
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-4
          gap-4
          mb-4
        "
      >
        <StatCard
          label="Total"
          value={String(
            totalTransactions
          )}
        />

        <StatCard
          label="Stablecoin"
          value={String(
            stablecoinTransactions
          )}
          sub={`${stablecoinPercentage}%`}
        />

        <StatCard
          label="Incoming"
          value={String(
            incoming
          )}
        />

        <StatCard
          label="Outgoing"
          value={String(
            outgoing
          )}
        />
      </div>

      {/* TABLE */}

      <div
        className="
          flex-1
          rounded-2xl
          border
          border-cyan-500/10
          overflow-hidden
          bg-[#08111d]
          min-h-0
          flex
          flex-col
        "
      >
        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_1.2fr_1.2fr_0.8fr]
            gap-3
            px-4
            py-3
            border-b
            border-cyan-500/10
            bg-white/[0.02]
            shrink-0
          "
        >
          {[
            "Time",
            "Dir",
            "Asset",
            "Amount",
            "Counterparty",
            "Behavior",
            "Delay",
          ].map((item) => (
            <div
              key={item}
              className="
                text-zinc-400
                text-xs
                font-medium
                uppercase
                tracking-wide
              "
            >
              {item}
            </div>
          ))}
        </div>

        {/* ROWS */}

<div
  className="
    flex
    flex-col
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-cyan-500/20
    scrollbar-track-transparent
    max-h-[350px]
  "
>
          {transactions.map(
            (
              tx: any,
              index: number
            ) => {
              const direction =
                tx.direction ||
                "OUT";

              const counterparty =
                tx.counterparty ||
                tx.to ||
                tx.from ||
                "Unknown";

              return (
                <div
                  key={index}
                  className="
                    grid
                    grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_1.2fr_1.2fr_0.8fr]
                    gap-3
                    px-4
                    py-3
                    border-b
                    border-cyan-500/5
                    hover:bg-white/[0.02]
                    transition
                    text-sm
                  "
                >
                  {/* TIME */}

                  <div
                    className="
                      text-zinc-300
                    "
                  >
                    {tx.time ||
                      tx.timestamp ||
                      "Unknown"}
                  </div>

                  {/* DIRECTION */}

                  <div
                    className={`
                      flex
                      items-center
                      gap-1
                      font-medium
                      ${
                        direction ===
                        "OUT"
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    `}
                  >
                    {direction ===
                    "OUT" ? (
                      <ArrowUp
                        size={14}
                      />
                    ) : (
                      <ArrowDown
                        size={14}
                      />
                    )}

                    {direction}
                  </div>

                  {/* ASSET */}

                  <div
                    className="
                      text-white
                      font-medium
                    "
                  >
                    {tx.asset ||
                      "USDT"}
                  </div>

                  {/* AMOUNT */}

                  <div
                    className="
                      text-zinc-300
                    "
                  >
                    {tx.amount ||
                      "0"}
                  </div>

                  {/* COUNTERPARTY */}

                  <div
                    className="
                      text-zinc-400
                    "
                  >
                    {String(
                      counterparty
                    ).slice(
                      0,
                      10
                    )}
                    ...
                    {String(
                      counterparty
                    ).slice(-4)}
                  </div>

                  {/* BEHAVIOR */}

                  <div
                    className="
                      text-zinc-300
                    "
                  >
                    {tx.behavior ||
                      "Normal"}
                  </div>

                  {/* DELAY */}

                  <div
                    className="
                      text-white
                      font-medium
                    "
                  >
                    {tx.delay ||
                      `${Math.floor(
                        Math.random() *
                          60
                      )}s`}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= */

function StatCard({
  label,
  value,
  sub,
}: any) {
  return (
    <div
      className="
        border-r
        border-cyan-500/10
        last:border-r-0
        pr-3
      "
    >
      <p
        className="
          text-zinc-400
          text-xs
          mb-2
          uppercase
          tracking-wide
        "
      >
        {label}
      </p>

      <div
        className="
          flex
          items-end
          gap-1
        "
      >
        <h3
          className="
            text-white
            text-3xl
            font-semibold
            tracking-tight
            leading-none
          "
        >
          {value}
        </h3>

        {sub && (
          <span
            className="
              text-white
              text-lg
              font-medium
              mb-[2px]
            "
          >
            ({sub})
          </span>
        )}
      </div>
    </div>
  );
}