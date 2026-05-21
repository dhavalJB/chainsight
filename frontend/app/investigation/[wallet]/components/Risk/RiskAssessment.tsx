import {
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function RiskAssessment({
  investigation,
}: Props) {
  const risk =
    investigation?.data
      ?.riskAnalysis || {};

  const intelligence =
    investigation?.data
      ?.intelligence || {};

  const riskScore =
    risk?.riskScore || 0;

  const riskLevel =
    risk?.riskLevel ||
    "UNKNOWN";

  const launderingProbability =
    risk?.launderingProbability ||
    0;

  const exchangeExposure =
    risk?.exchangeExposure ||
    0;

  const routingComplexity =
    risk?.routingComplexity ||
    "Low";

  const confidence =
    risk?.confidence ||
    "High";

  /* ===================================== */
  /* COLORS */
  /* ===================================== */

  const riskColor =
    riskScore < 35
      ? "#65d84e"
      : riskScore < 70
      ? "#facc15"
      : "#ef4444";

  const riskTextColor =
    riskScore < 35
      ? "text-green-400"
      : riskScore < 70
      ? "text-yellow-400"
      : "text-red-400";

  /* ===================================== */
  /* POINTER */
  /* ===================================== */

  const pointerX =
    riskScore < 35
      ? 105
      : riskScore < 70
      ? 125
      : 155;

  const pointerY =
    riskScore < 35
      ? 65
      : riskScore < 70
      ? 48
      : 65;

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
          RISK{" "}
          ASSESSMENT
        </h2>

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
              AML and operational
              risk intelligence.
            </div>
          </div>
        </div>
      </div>

      {/* GAUGE */}

      <div
        className="
          relative
          flex
          items-center
          justify-center
          mb-8
        "
      >
        {/* SVG */}

        <svg
          width="250"
          height="150"
          viewBox="0 0 250 150"
        >
          {/* GREEN */}

          <path
            d="
              M35 120
              A90 90 0 0 1 90 40
            "
            fill="none"
            stroke="#65d84e"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* YELLOW */}

          <path
            d="
              M90 40
              A90 90 0 0 1 160 40
            "
            fill="none"
            stroke="#facc15"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* RED */}

          <path
            d="
              M160 40
              A90 90 0 0 1 215 120
            "
            fill="none"
            stroke="#ef4444"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* POINTER */}

          <line
            x1="125"
            y1="120"
            x2={pointerX}
            y2={pointerY}
            stroke="#111827"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* CENTER */}

          <circle
            cx="125"
            cy="120"
            r="10"
            fill="#07111f"
            stroke="#1e293b"
            strokeWidth="3"
          />
        </svg>

        {/* SCORE */}

        <div
          className="
            absolute
            top-[58px]
            flex
            flex-col
            items-center
          "
        >
          <h3
            className="
              text-white
              text-5xl
              font-bold
              leading-none
            "
          >
            {riskScore}
          </h3>

          <p
            className="
              text-zinc-400
              text-2xl
              mt-1
            "
          >
            / 100
          </p>

          <p
            className={`
              text-2xl
              font-semibold
              mt-3
              ${riskTextColor}
            `}
          >
            {riskLevel}
          </p>
        </div>
      </div>

      {/* DIVIDER */}

      <div
        className="
          border-t
          border-cyan-500/10
          mb-5
        "
      />

      {/* METRICS */}

      <div
        className="
          flex
          flex-col
          gap-4
          mt-auto
        "
      >
        <RiskMetric
          label="Laundering Probability"
          value={`${launderingProbability}%`}
        />

        <RiskMetric
          label="Exchange Exposure"
          value={`${exchangeExposure}%`}
        />

        <RiskMetric
          label="Routing Complexity"
          value={routingComplexity}
          green={
            routingComplexity ===
            "Low"
          }
        />

        <RiskMetric
          label="Overall Confidence"
          value={confidence}
          green={
            confidence ===
            "High"
          }
        />
      </div>
    </div>
  );
}

/* ========================= */

function RiskMetric({
  label,
  value,
  green,
}: any) {
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
          text-base
        "
      >
        {label}
      </span>

      <span
        className={`
          text-base
          font-semibold
          ${
            green
              ? "text-green-400"
              : "text-white"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}