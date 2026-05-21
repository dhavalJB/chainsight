import {
  ShieldCheck,
  Info,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function InvestigationFooter({
  investigation,
}: Props) {
  const risk =
    investigation?.data
      ?.riskAnalysis || {};

  const intelligence =
    investigation?.data
      ?.intelligence || {};

  const summary =
    investigation?.data
      ?.transactionAnalysis
      ?.summary || {};

  const findings = [
    {
      label:
        "Mixer Exposure",

      value:
        risk?.mixerExposure
          ? "Detected"
          : "Not Detected",
    },

    {
      label:
        "Suspicious Tokens",

      value: String(
        risk?.suspiciousTokens ||
          0
      ),
    },

    {
      label:
        "High Risk Protocols",

      value: String(
        risk?.highRiskProtocols ||
          0
      ),
    },

    {
      label:
        "Fake Stablecoins",

      value: String(
        risk?.fakeStablecoins ||
          0
      ),
    },

    {
      label:
        "Counterparties",

      value: String(
        summary?.counterparties ||
          0
      ),
    },

    {
      label:
        "Overall AML Risk",

      value:
        risk?.riskLevel ||
        "UNKNOWN",

      highlight: true,
    },
  ];

  return (
    <section
      className="
        grid
        grid-cols-12
        gap-5
        items-start
      "
    >
      {/* AML */}

      <div
        className="
          col-span-8
          h-fit
          rounded-2xl
          border
          border-cyan-500/10
          bg-[#07111f]/95
          shadow-[0_0_40px_rgba(0,255,255,0.03)]
          p-5
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
              text-[24px]
              font-semibold
              tracking-tight
            "
          >
            AML &{" "}
            INTELLIGENCE{" "}
            FINDINGS
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
                AML intelligence
                exposure summary.
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}

        <div
          className="
            grid
            grid-cols-3
            gap-4
          "
        >
          {findings.map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-cyan-500/10
                  bg-[#081221]
                  px-4
                  py-4
                  flex
                  items-center
                  gap-3
                "
              >
                {/* ICON */}

                <div
                  className={`
                    w-11
                    h-11
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${
                      item.highlight
                        ? "bg-red-500/10"
                        : "bg-green-500/10"
                    }
                  `}
                >
                  <ShieldCheck
                    size={20}
                    className={
                      item.highlight
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  />
                </div>

                {/* TEXT */}

                <div>
                  <p
                    className="
                      text-zinc-400
                      text-sm
                      mb-1
                    "
                  >
                    {item.label}
                  </p>

                  <h3
                    className={`
                      text-2xl
                      font-semibold
                      ${
                        item.highlight
                          ? risk
                              ?.riskLevel ===
                            "HIGH"
                            ? "text-red-400"
                            : risk
                                ?.riskLevel ===
                              "MEDIUM"
                            ? "text-yellow-400"
                            : "text-green-400"
                          : "text-white"
                      }
                    `}
                  >
                    {item.value}
                  </h3>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* LIVE ANALYSIS */}

      <div
        className="
          col-span-4
          h-fit
          rounded-2xl
          border
          border-cyan-500/10
          bg-[#07111f]/95
          shadow-[0_0_40px_rgba(0,255,255,0.03)]
          p-5
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
              text-[24px]
              font-semibold
              tracking-tight
            "
          >
            LIVE MONITORING
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
          </div>
        </div>

        {/* DESCRIPTION */}

        <p
          className="
            text-zinc-300
            text-[15px]
            leading-7
            mb-6
          "
        >
          Wallet categorized as{" "}
          <span
            className="
              text-white
              font-semibold
            "
          >
            {
              intelligence?.walletCategory
            }
          </span>{" "}
          with{" "}
          <span
            className="
              text-cyan-400
              font-semibold
            "
          >
            {
              intelligence?.activityLevel
            }
          </span>{" "}
          operational activity.
          Continuous monitoring
          can detect routing
          changes, suspicious
          movements, and emerging
          settlement patterns.
        </p>

        {/* BUTTON */}

        <button
          className="
            h-[58px]
            rounded-2xl
            bg-cyan-500
            text-black
            text-lg
            font-semibold
            hover:bg-cyan-400
            transition
            shadow-[0_0_35px_rgba(34,211,238,0.25)]
          "
        >
          Start Live Analysis
        </button>
      </div>
    </section>
  );
}