import {
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function BehaviorIntelligence({
  investigation,
}: Props) {
  const intelligence =
    investigation?.data
      ?.intelligence || {};

  const relationship =
    investigation?.data
      ?.transactionAnalysis
      ?.relationshipIntelligence || {};

  const temporal =
    investigation?.data
      ?.transactionAnalysis
      ?.temporalIntelligence || {};

  const risk =
    investigation?.data
      ?.riskAnalysis || {};

  const p2pScore =
    intelligence?.p2pScore || 0;

  const activityLevel =
    intelligence?.activityLevel ||
    "UNKNOWN";

  const merchantProbability =
    intelligence?.merchantProbability ||
    0;

  const routingTransactions =
    relationship?.routingTransactions ||
    0;

  const repeatedAmounts =
    temporal?.repeatedAmounts ||
    0;

  const counterparties =
    relationship?.counterparties ||
    0;

  /* ===================================== */
  /* RADAR POINTS */
  /* ===================================== */

  const exchangeExposure =
    Math.min(
      risk?.exchangeExposure ||
        20,
      100
    );

  const repetitionScore =
    Math.min(
      repeatedAmounts * 8,
      100
    );

  const routingComplexity =
    Math.min(
      routingTransactions * 10,
      100
    );

  const temporalRisk =
    Math.min(
      temporal?.riskScore ||
        20,
      100
    );

  const rapidTransfers =
    Math.min(
      temporal?.rapidBursts ||
        10,
      100
    );

  /* ===================================== */
  /* SVG POINTS */
  /* ===================================== */

  const points = `
    160,${
      205 -
      exchangeExposure *
        1.5
    }
    ${
      65 +
      repetitionScore *
        1.5
    },110
    ${
      255 -
      routingComplexity *
        0.8
    },170
    ${
      95 +
      temporalRisk *
        0.5
    },178
    ${
      120 +
      rapidTransfers *
        0.5
    },120
  `;

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
          BEHAVIOR{" "}
          INTELLIGENCE
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
              duration-200
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
              Behavioral risk
              analysis based on
              operational patterns.
            </div>
          </div>
        </div>
      </div>

      {/* RADAR */}

      <div
        className="
          relative
          flex
          items-center
          justify-center
          py-2
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute
            w-[260px]
            h-[260px]
            rounded-full
            bg-red-500/5
            blur-3xl
          "
        />

        <svg
          width="320"
          height="250"
          viewBox="0 0 320 250"
          className="
            relative
            z-10
          "
        >
          {/* OUTER */}

          <polygon
            points="160,30 255,90 225,205 95,205 65,90"
            fill="none"
            stroke="#22304a"
            strokeWidth="2"
          />

          {/* MID */}

          <polygon
            points="160,60 225,102 205,180 115,180 95,102"
            fill="none"
            stroke="#22304a"
            strokeWidth="1.5"
          />

          {/* INNER */}

          <polygon
            points="160,90 195,114 185,156 135,156 125,114"
            fill="none"
            stroke="#22304a"
            strokeWidth="1"
          />

          {/* AXIS */}

          <line
            x1="160"
            y1="30"
            x2="160"
            y2="205"
            stroke="#22304a"
          />

          <line
            x1="65"
            y1="90"
            x2="225"
            y2="205"
            stroke="#22304a"
          />

          <line
            x1="255"
            y1="90"
            x2="95"
            y2="205"
            stroke="#22304a"
          />

          {/* DATA */}

          <polygon
            points={points}
            fill="rgba(255,60,60,0.25)"
            stroke="#ff4d4d"
            strokeWidth="3"
          />

          {/* LABELS */}

          <text
            x="122"
            y="18"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Exchange
          </text>

          <text
            x="118"
            y="38"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Exposure
          </text>

          <text
            x="18"
            y="95"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Repetition
          </text>

          <text
            x="40"
            y="115"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Score
          </text>

          <text
            x="260"
            y="95"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Routing
          </text>

          <text
            x="250"
            y="115"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Complexity
          </text>

          <text
            x="58"
            y="212"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Temporal
          </text>

          <text
            x="78"
            y="232"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Risk
          </text>

          <text
            x="218"
            y="212"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Rapid
          </text>

          <text
            x="200"
            y="232"
            fill="#a1a1aa"
            fontSize="16"
            fontWeight="500"
          >
            Transfers
          </text>
        </svg>
      </div>

      {/* DIVIDER */}

      <div
        className="
          border-t
          border-cyan-500/10
          my-5
        "
      />

      {/* METRICS */}

      <div
        className="
          flex
          flex-col
          gap-3
          text-[17px]
        "
      >
        <Metric
          label="P2P Score"
          value={`${p2pScore}`}
          danger={
            p2pScore > 250
          }
        />

        <Metric
          label="Activity Level"
          value={activityLevel}
          danger={
            activityLevel ===
            "HIGH"
          }
        />

        <Metric
          label="Merchant Probability"
          value={`${merchantProbability}%`}
        />

        <Metric
          label="Routing Transactions"
          value={String(
            routingTransactions
          )}
        />

        <Metric
          label="Repeated Amounts"
          value={String(
            repeatedAmounts
          )}
        />

        <Metric
          label="Unique Counterparties"
          value={String(
            counterparties
          )}
        />
      </div>
    </div>
  );
}

/* ========================= */

interface MetricProps {
  label: string;

  value: string;

  danger?: boolean;
}

function Metric({
  label,

  value,

  danger,
}: MetricProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
      "
    >
      <span
        className="
          text-zinc-300
          font-medium
        "
      >
        {label}
      </span>

      <span
        className={`
          font-semibold
          ${
            danger
              ? "text-red-400"
              : "text-white"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}