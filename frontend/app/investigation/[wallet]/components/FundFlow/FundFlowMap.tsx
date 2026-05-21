"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Info,
  Landmark,
  Store,
  Shield,
} from "lucide-react";

interface Props {
  investigation: any;
}

export default function FundFlowMap({
  investigation,
}: Props) {
  const [mode, setMode] =
    useState("flow");

  const custody =
    investigation?.data
      ?.transactionAnalysis
      ?.custody;

  const riskAnalysis =
    investigation?.data
      ?.riskAnalysis;

  const temporal =
    investigation?.data
      ?.transactionAnalysis
      ?.temporalIntelligence;

  const relationship =
    investigation?.data
      ?.transactionAnalysis
      ?.relationshipIntelligence;

  const aml =
    investigation?.data
      ?.amlAnalysis;

  const nodes =
    custody?.nodes || [];

  const edges =
    custody?.edges || [];

  const mainWallet =
    nodes[0];

  const latestEdges =
    useMemo(() => {
      return edges.slice(0, 6);
    }, [edges]);

  /* ====================== */
  /* MODE RENDERING */
  /* ====================== */

  const renderMode = () => {
    switch (mode) {
      /* ================== */
      /* RELATIONSHIP */
      /* ================== */

      case "relationship":
        return (
          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                w-[320px]
                h-[320px]
                rounded-full
                border
                border-cyan-500/10
                relative
                flex
                items-center
                justify-center
              "
            >
              {nodes
                .slice(0, 4)
                .map(
                  (
                    node: any,
                    index: number
                  ) => {
                    const positions =
                      [
                        "top-5 left-1/2 -translate-x-1/2",
                        "left-0 top-1/2 -translate-y-1/2",
                        "right-0 top-1/2 -translate-y-1/2",
                        "bottom-5 left-1/2 -translate-x-1/2",
                      ];

                    return (
                      <div
                        key={
                          node.id
                        }
                        className={`
                          absolute
                          ${
                            positions[
                              index
                            ]
                          }
                        `}
                      >
                        <RelationshipNode
                          label={
                            node.walletType ||
                            "Wallet"
                          }
                          color={
                            node.walletType ===
                            "Exchange"
                              ? "amber"
                              : node.walletType ===
                                "Merchant"
                              ? "blue"
                              : "green"
                          }
                        />
                      </div>
                    );
                  }
                )}

              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  bg-green-500/10
                  border
                  border-green-500/30
                  flex
                  items-center
                  justify-center
                  text-white
                  font-semibold
                  text-center
                  px-3
                "
              >
                Main Wallet
              </div>
            </div>

            <p
              className="
                mt-10
                text-zinc-400
                max-w-[500px]
              "
            >
              Relationship
              intelligence across{" "}
              {
                relationship?.counterparties
              }{" "}
              connected wallets and
              settlement paths.
            </p>
          </div>
        );

      /* ================== */
      /* TIMELINE */
      /* ================== */

      case "timeline":
        return (
          <div
            className="
              h-full
              flex
              flex-col
              justify-center
              px-10
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-10
              "
            >
              <span
                className="
                  text-zinc-400
                "
              >
                First Activity
              </span>

              <span
                className="
                  text-zinc-400
                "
              >
                Latest Activity
              </span>
            </div>

            <div
              className="
                relative
                h-[4px]
                rounded-full
                bg-cyan-500/10
              "
            >
              {latestEdges.map(
                (
                  _: any,
                  index: number
                ) => (
                  <TimelineEvent
                    key={index}
                    left={`${
                      10 +
                      index *
                        14
                    }%`}
                    color={
                      index % 3 ===
                      0
                        ? "red"
                        : index %
                            2 ===
                          0
                        ? "green"
                        : "cyan"
                    }
                  />
                )
              )}
            </div>

            <div
              className="
                mt-12
                text-center
                text-zinc-400
                text-lg
              "
            >
              {
                temporal?.activityPattern
              }
            </div>
          </div>
        );

      /* ================== */
      /* AML */
      /* ================== */

      case "aml":
        return (
          <div
            className="
              h-full
              grid
              grid-cols-2
              gap-5
              p-4
            "
          >
            <AMLCard
              title="Risk Level"
              value={
                riskAnalysis?.riskLevel ||
                "UNKNOWN"
              }
              green={
                riskAnalysis?.riskLevel ===
                "LOW"
              }
              yellow={
                riskAnalysis?.riskLevel ===
                "MEDIUM"
              }
            />

            <AMLCard
              title="Risk Score"
              value={String(
                riskAnalysis?.riskScore ||
                  0
              )}
            />

            <AMLCard
              title="Counterparties"
              value={String(
                relationship?.counterparties ||
                  0
              )}
            />

            <AMLCard
              title="Activity"
              value={
                investigation?.data
                  ?.intelligence
                  ?.activityLevel ||
                "UNKNOWN"
              }
            />
          </div>
        );

      /* ================== */
      /* FLOW */
      /* ================== */

      default:
        return (
          <div
            className="
              relative
              h-full
              overflow-x-auto
              overflow-y-hidden
            "
          >
            <div
              className="
                relative
                min-w-[1800px]
                h-full
                px-16
                py-10
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  opacity-[0.04]
                  bg-[radial-gradient(#38bdf8_1px,transparent_1px)]
                  [background-size:22px_22px]
                "
              />

              <div
                className="
                  relative
                  flex
                  items-center
                  gap-32
                  h-full
                "
              >
                {nodes.map(
                  (
                    node: any,
                    index: number
                  ) => {
                    const edge =
                      latestEdges[
                        index
                      ];

                    return (
                      <FlowStep
                        key={
                          node.id ||
                          index
                        }
                        title={
                          node.walletType ||
                          "Wallet"
                        }
                        subtitle={
                          node.label ||
                          "Operational Node"
                        }
                        wallet={
                          node.wallet
                        }
                        type={
                          node.walletType
                        }
                        amount={
                          edge?.amount ||
                          "0"
                        }
                        asset={
                          edge?.asset ||
                          "USDT"
                        }
                        delay={`${Math.floor(
                          Math.random() *
                            60
                        )}s`}
                        big={
                          index === 0
                        }
                      />
                    );
                  }
                )}
              </div>

              {/* FOOTER */}

              <div
                className="
                  absolute
                  bottom-5
                  left-1/2
                  -translate-x-1/2
                  text-zinc-500
                  text-sm
                  flex
                  items-center
                  gap-3
                  whitespace-nowrap
                "
              >
                <span>
                  Dynamic custody
                  routing visualization
                </span>

                <span>•</span>

                <span>
                  Connected wallet
                  intelligence
                </span>

                <span>•</span>

                <span>
                  Real investigation
                  data
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

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
          justify-between
          mb-6
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
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
            FUND FLOW MAP
          </h2>

          <Info
            size={18}
            className="
              text-zinc-500
            "
          />
        </div>

        <button
          className="
            h-11
            px-4
            rounded-xl
            border
            border-cyan-500/10
            bg-[#081221]
            text-sm
            text-zinc-300
          "
        >
          Legend
        </button>
      </div>

      {/* MODES */}

      <div
        className="
          flex
          gap-3
          mb-8
          flex-wrap
        "
      >
        <ModeButton
          active={
            mode === "flow"
          }
          label="Flow Mode"
          onClick={() =>
            setMode("flow")
          }
        />

        <ModeButton
          active={
            mode ===
            "relationship"
          }
          label="Relationship Mode"
          onClick={() =>
            setMode(
              "relationship"
            )
          }
        />

        <ModeButton
          active={
            mode ===
            "timeline"
          }
          label="Timeline Mode"
          onClick={() =>
            setMode(
              "timeline"
            )
          }
        />

        <ModeButton
          active={
            mode === "aml"
          }
          label="AML Mode"
          onClick={() =>
            setMode("aml")
          }
        />
      </div>

      {/* MAP */}

      <div
        className="
          relative
          flex-1
          min-h-[420px]
          rounded-3xl
          border
          border-cyan-500/10
          bg-[#07111d]
          overflow-hidden
          p-10
        "
      >
        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            bg-[radial-gradient(#38bdf8_1px,transparent_1px)]
            [background-size:22px_22px]
          "
        />

        {renderMode()}
      </div>
    </div>
  );
}

/* ====================== */

function WalletNode({
  title,
  subtitle,
  wallet,
  type,
  big,
}: any) {
  const styles =
    getStyles(type);

  return (
    <div
      className={`
        relative
        rounded-3xl
        border
        ${styles.border}
        ${styles.bg}
        ${styles.glow}
        backdrop-blur-xl
        p-5
        ${
          big
            ? "w-[260px]"
            : "w-[240px]"
        }
      `}
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            text-white
            ${styles.iconBg}
          `}
        >
          {styles.icon}
        </div>

        <div>
          <h3
            className="
              text-white
              text-lg
              font-semibold
              mb-1
            "
          >
            {title}
          </h3>

          <p
            className="
              text-zinc-300
              text-sm
              mb-2
            "
          >
            {wallet?.slice(
              0,
              12
            )}
            ...
            {wallet?.slice(
              -6
            )}
          </p>

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function FlowStep({
  title,
  subtitle,
  wallet,
  type,
  amount,
  asset,
  delay,
  big,
}: any) {
  return (
    <div
      className="
        relative
        flex
        items-center
      "
    >
      <WalletNode
        title={title}
        subtitle={subtitle}
        wallet={wallet}
        type={type}
        big={big}
      />

      <div
        className="
          absolute
          left-full
          top-1/2
          ml-8
          -translate-y-1/2
          w-24
        "
      >
        <div
          className="
            h-[2px]
            bg-zinc-500
            relative
          "
        >
          <div
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              w-0
              h-0
              border-t-[6px]
              border-b-[6px]
              border-l-[10px]
              border-t-transparent
              border-b-transparent
              border-l-zinc-400
            "
          />
        </div>

        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2
            -top-12
            text-center
            whitespace-nowrap
          "
        >
          <p
            className="
              text-white
              text-sm
              font-medium
            "
          >
            {asset} {amount}
          </p>

          <p
            className="
              text-zinc-500
              text-xs
            "
          >
            {delay}
          </p>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`
        h-11
        px-5
        rounded-xl
        border
        text-sm
        transition
        ${
          active
            ? `
              border-blue-500/40
              bg-blue-500/20
              text-white
            `
            : `
              border-cyan-500/10
              bg-[#081221]
              text-zinc-400
            `
        }
      `}
    >
      {label}
    </button>
  );
}

function AMLCard({
  title,
  value,
  green,
  yellow,
}: any) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-cyan-500/10
        bg-[#081221]
        p-5
      "
    >
      <p
        className="
          text-zinc-500
          text-sm
          mb-3
        "
      >
        {title}
      </p>

      <h3
        className={`
          text-3xl
          font-bold
          ${
            green
              ? "text-green-400"
              : yellow
              ? "text-yellow-400"
              : "text-white"
          }
        `}
      >
        {value}
      </h3>
    </div>
  );
}

function TimelineEvent({
  left,
  color,
}: any) {
  return (
    <div
      style={{ left }}
      className={`
        absolute
        top-1/2
        -translate-y-1/2
        w-5
        h-5
        rounded-full
        border-4
        ${
          color === "red"
            ? "bg-red-400 border-red-500"
            : color === "green"
            ? "bg-green-400 border-green-500"
            : color === "yellow"
            ? "bg-yellow-400 border-yellow-500"
            : "bg-cyan-400 border-cyan-500"
        }
      `}
    />
  );
}

function RelationshipNode({
  label,
  color,
}: any) {
  return (
    <div
      className={`
        w-24
        h-24
        rounded-full
        border
        flex
        items-center
        justify-center
        text-sm
        font-medium
        ${
          color === "amber"
            ? `
              bg-amber-500/10
              border-amber-500/30
              text-amber-300
            `
            : color === "blue"
            ? `
              bg-blue-500/10
              border-blue-500/30
              text-blue-300
            `
            : `
              bg-green-500/10
              border-green-500/30
              text-green-300
            `
        }
      `}
    >
      {label}
    </div>
  );
}

function getStyles(
  type: string
) {
  switch (type) {
    case "Exchange":
      return {
        border:
          "border-amber-500/50",
        bg: "bg-amber-500/10",
        iconBg:
          "bg-amber-500/20",
        icon: (
          <Landmark
            size={18}
          />
        ),
        glow:
          "shadow-[0_0_30px_rgba(245,158,11,0.12)]",
      };

    case "Merchant":
      return {
        border:
          "border-blue-500/50",
        bg: "bg-blue-500/10",
        iconBg:
          "bg-blue-500/20",
        icon: (
          <Store
            size={18}
          />
        ),
        glow:
          "shadow-[0_0_30px_rgba(59,130,246,0.12)]",
      };

    default:
      return {
        border:
          "border-green-500/50",
        bg: "bg-green-500/10",
        iconBg:
          "bg-green-500/20",
        icon: (
          <Shield
            size={18}
          />
        ),
        glow:
          "shadow-[0_0_30px_rgba(34,197,94,0.12)]",
      };
  }
}