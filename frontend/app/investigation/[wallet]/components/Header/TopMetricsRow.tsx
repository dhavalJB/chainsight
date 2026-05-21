import {
  Wallet,
  ArrowLeftRight,
  Network,
  Activity,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function TopMetricsRow({
  investigation,
}: Props) {
  const riskLevel =
    investigation?.data
      ?.riskAnalysis
      ?.riskLevel || "UNKNOWN";

  const riskScore =
    investigation?.data
      ?.riskAnalysis
      ?.riskScore || 0;

  const balanceTON =
    investigation?.data
      ?.balances
      ?.balanceTON || 0;

  const transactions =
    investigation?.data
      ?.transactionAnalysis
      ?.summary
      ?.totalTransactions || 0;

  const counterparties =
    investigation?.data
      ?.transactionAnalysis
      ?.relationshipIntelligence
      ?.counterparties || 0;

  const activityLevel =
    investigation?.data
      ?.intelligence
      ?.activityLevel || "UNKNOWN";

  /* ===================================== */
  /* RISK COLORS */
  /* ===================================== */

  const riskColor =
    riskLevel === "LOW"
      ? "#00f596"
      : riskLevel === "MEDIUM"
      ? "#ffcc00"
      : "#ff5f57";

  const activityColor =
    activityLevel === "LOW"
      ? "text-green-400"
      : activityLevel ===
        "MEDIUM"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className="
        border
        border-cyan-500/10
        bg-[#07111f]/95
        rounded-2xl
        overflow-hidden
        shadow-[0_0_50px_rgba(0,255,255,0.03)]
        grid
        grid-cols-2
        xl:grid-cols-5
      "
    >
      {/* RISK */}

      <div
        className="
          relative
          overflow-hidden
          px-6
          py-5
          border-r
          border-cyan-500/10
          flex
          items-center
          gap-5
          min-h-[125px]
          bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.05),transparent_60%)]
        "
      >
        {/* GAUGE */}

        <div
          className="
            relative
            w-[120px]
            h-[90px]
            shrink-0
          "
        >
          <svg
            viewBox="0 0 120 90"
            className="
              w-full
              h-full
            "
          >
            {/* GREEN */}

            <path
              d="M15 75 A45 45 0 0 1 45 20"
              fill="none"
              stroke="#00f596"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* YELLOW */}

            <path
              d="M45 20 A45 45 0 0 1 72 22"
              fill="none"
              stroke="#ffcc00"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* RED */}

            <path
              d="M72 22 A45 45 0 0 1 98 75"
              fill="none"
              stroke="#ff5f57"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* NEEDLE */}

            <line
              x1="60"
              y1="75"
              x2={
                riskScore < 35
                  ? "38"
                  : riskScore < 70
                  ? "60"
                  : "82"
              }
              y2={
                riskScore < 35
                  ? "42"
                  : riskScore < 70
                  ? "25"
                  : "42"
              }
              stroke={riskColor}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* CENTER */}

            <circle
              cx="60"
              cy="75"
              r="7"
              fill="#081221"
              stroke="#1e293b"
              strokeWidth="2"
            />
          </svg>

          {/* GLOW */}

          <div
            className="
              absolute
              inset-0
              blur-3xl
              bg-green-500/10
            "
          />
        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-col
            justify-center
          "
        >
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-zinc-500
              mb-2
            "
          >
            Risk Level
          </p>

          <h3
            className="
              text-[42px]
              font-bold
              leading-none
              tracking-tight
            "
            style={{
              color: riskColor,
            }}
          >
            {riskLevel}
          </h3>

          <div className="mt-2">
            <p
              className="
                text-zinc-400
                text-sm
              "
            >
              Risk Score
            </p>

            <p
              className="
                text-[30px]
                font-bold
                leading-none
                mt-1
              "
            >
              <span
                style={{
                  color:
                    riskColor,
                }}
              >
                {riskScore}
              </span>

              <span
                className="
                  text-zinc-500
                "
              >
                {" "}
                / 100
              </span>
            </p>
          </div>
        </div>

        {/* BG */}

        <div
          className="
            absolute
            -left-10
            -top-10
            w-40
            h-40
            rounded-full
            bg-cyan-500/5
            blur-3xl
          "
        />
      </div>

      {/* BALANCE */}

      <div
        className="
          px-6
          py-5
          border-r
          border-cyan-500/10
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-cyan-500/10
            flex
            items-center
            justify-center
          "
        >
          <Wallet
            size={28}
            className="
              text-cyan-400
            "
          />
        </div>

        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-zinc-500
              mb-2
            "
          >
            Total Balance
          </p>

          <h3
            className="
              text-3xl
              font-bold
              text-white
              leading-none
            "
          >
            {balanceTON.toFixed(
              4
            )}{" "}
            TON
          </h3>

          <p
            className="
              text-sm
              text-zinc-400
              mt-2
            "
          >
            Wallet Exposure
          </p>
        </div>
      </div>

      {/* TXS */}

      <div
        className="
          px-6
          py-5
          border-r
          border-cyan-500/10
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-blue-500/10
            flex
            items-center
            justify-center
          "
        >
          <ArrowLeftRight
            size={28}
            className="
              text-blue-400
            "
          />
        </div>

        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-zinc-500
              mb-2
            "
          >
            Transactions
          </p>

          <h3
            className="
              text-3xl
              font-bold
              text-white
              leading-none
            "
          >
            {transactions}
          </h3>

          <p
            className="
              text-sm
              text-zinc-400
              mt-2
            "
          >
            All Time
          </p>
        </div>
      </div>

      {/* COUNTERPARTIES */}

      <div
        className="
          px-6
          py-5
          border-r
          border-cyan-500/10
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-purple-500/10
            flex
            items-center
            justify-center
          "
        >
          <Network
            size={28}
            className="
              text-purple-400
            "
          />
        </div>

        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-zinc-500
              mb-2
            "
          >
            Counterparties
          </p>

          <h3
            className="
              text-3xl
              font-bold
              text-white
              leading-none
            "
          >
            {counterparties}
          </h3>

          <p
            className="
              text-sm
              text-zinc-400
              mt-2
            "
          >
            Unique Addresses
          </p>
        </div>
      </div>

      {/* ACTIVITY */}

      <div
        className="
          px-6
          py-5
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-yellow-500/10
            flex
            items-center
            justify-center
          "
        >
          <Activity
            size={28}
            className="
              text-yellow-400
            "
          />
        </div>

        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-zinc-500
              mb-2
            "
          >
            Activity
          </p>

          <h3
            className={`
              text-3xl
              font-bold
              leading-none
              ${activityColor}
            `}
          >
            {activityLevel}
          </h3>

          <p
            className="
              text-sm
              text-zinc-400
              mt-2
            "
          >
            Behavior Intensity
          </p>
        </div>
      </div>
    </div>
  );
}