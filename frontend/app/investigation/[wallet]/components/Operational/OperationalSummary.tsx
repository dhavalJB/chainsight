import {
  CheckCircle2,
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function OperationalSummary({
  investigation,
}: Props) {
  const relationshipSignals =
    investigation?.data
      ?.transactionAnalysis
      ?.relationshipIntelligence
      ?.signals || [];

  const riskFindings =
    investigation?.data
      ?.riskAnalysis
      ?.findings || [];

  const temporalFindings =
    investigation?.data
      ?.transactionAnalysis
      ?.temporalIntelligence
      ?.findings || [];

  const allFindings = [
    ...relationshipSignals,
    ...riskFindings,
    ...temporalFindings,
  ].slice(0, 8);

  const counterparties =
    investigation?.data
      ?.transactionAnalysis
      ?.relationshipIntelligence
      ?.counterparties || 0;

  const walletCategory =
    investigation?.data
      ?.intelligence
      ?.walletCategory ||
    "Unknown Wallet";

  const activityPattern =
    investigation?.data
      ?.transactionAnalysis
      ?.temporalIntelligence
      ?.activityPattern ||
    "Unknown Pattern";

  const launderingRisk =
    investigation?.data
      ?.amlAnalysis
      ?.launderingRisk ||
    investigation?.data
      ?.riskAnalysis
      ?.riskLevel ||
    "UNKNOWN";

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
          mb-5
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
          OPERATIONAL{" "}
          SUMMARY
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
              Operational routing
              intelligence summary.
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div
        className="
          flex
          flex-col
          gap-5
          text-zinc-300
          text-[17px]
          leading-[1.9]
        "
      >
        <p>
          This wallet demonstrates{" "}
          {activityPattern.toLowerCase()}{" "}
          behavior involving{" "}
          {counterparties}{" "}
          operational
          counterparties.
        </p>

        <p>
          Wallet classification
          indicates{" "}
          {walletCategory.toLowerCase()}{" "}
          activity with recurring
          transfer relationships
          across monitored routes.
        </p>

        <p>
          Current laundering risk
          assessment is{" "}
          {launderingRisk.toLowerCase()}{" "}
          with observable routing
          and settlement behavior
          patterns.
        </p>
      </div>

      {/* DIVIDER */}

      <div
        className="
          border-t
          border-cyan-500/10
          my-6
        "
      />

      {/* FINDINGS */}

      <div
        className="
          flex
          flex-col
          gap-4
        "
      >
        <h3
          className="
            text-white
            text-lg
            font-semibold
            tracking-wide
          "
        >
          KEY FINDINGS
        </h3>

        <div
          className="
            flex
            flex-col
            gap-4
          "
        >
          {allFindings.length >
          0 ? (
            allFindings.map(
              (
                finding: string,
                index: number
              ) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <CheckCircle2
                    size={20}
                    className="
                      text-green-400
                      shrink-0
                      mt-[2px]
                    "
                  />

                  <p
                    className="
                      text-zinc-300
                      text-[16px]
                      leading-6
                    "
                  >
                    {finding}
                  </p>
                </div>
              )
            )
          ) : (
            <p
              className="
                text-zinc-500
                text-sm
              "
            >
              No operational
              findings detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}