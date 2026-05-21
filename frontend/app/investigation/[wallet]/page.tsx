"use client";

import { useEffect, useState } from "react";

import InvestigationHeader from "./components/Header/InvestigationHeader";

import TopMetricsRow from "./components/Header/TopMetricsRow";

import BehaviorIntelligence from "./components/Behavior/BehaviorIntelligence";

import OperationalSummary from "./components/Operational/OperationalSummary";

import FundFlowMap from "./components/FundFlow/FundFlowMap";

import TemporalAnalysis from "./components/Temporal/TemporalAnalysis";

import TransactionIntelligence from "./components/Transaction/TransactionIntelligence";

import RiskAssessment from "./components/Risk/RiskAssessment";

import InvestigationFooter from "./components/Footer/InvestigationFooter";

export default function Page() {
  const [investigation, setInvestigation] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchInvestigation =
      async () => {
        try {
          setLoading(true);

          const response =
            await fetch(
              "http://localhost:5000/api/investigation/latest"
            );

          const data =
            await response.json();

          if (!data.success) {
            setError(
              data.error ||
                "Failed to load investigation"
            );

            return;
          }

          setInvestigation(
            data.investigation
          );
        } catch (error) {
          console.error(error);

          setError(
            "Backend connection failed"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchInvestigation();
  }, []);

  /* ===================================== */
  /* LOADING */
  /* ===================================== */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#020817]
          flex
          items-center
          justify-center
          text-cyan-400
          text-xl
        "
      >
        Loading Investigation...
      </main>
    );
  }

  /* ===================================== */
  /* ERROR */
  /* ===================================== */

  if (error || !investigation) {
    return (
      <main
        className="
          min-h-screen
          bg-[#020817]
          flex
          items-center
          justify-center
          text-red-400
          text-xl
        "
      >
        {error || "No investigation found"}
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#020817]
        p-5
        flex
        flex-col
        gap-5
      "
    >
      {/* HEADER */}

      <InvestigationHeader
        investigation={
          investigation
        }
      />

      {/* METRICS */}

      <TopMetricsRow
        investigation={
          investigation
        }
      />

      {/* ===================================== */}
      {/* MAIN INVESTIGATION GRID */}
      {/* ===================================== */}

      <section
        className="
          grid
          grid-cols-12
          gap-5
          min-h-[520px]
          items-stretch
        "
      >
        {/* LEFT PANEL */}

        <div
          className="
            col-span-3
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <OperationalSummary
            investigation={
              investigation
            }
          />
        </div>

        {/* CENTER PANEL */}

        <div
          className="
            col-span-6
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <FundFlowMap
            investigation={
              investigation
            }
          />
        </div>

        {/* RIGHT PANEL */}

        <div
          className="
            col-span-3
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <BehaviorIntelligence
            investigation={
              investigation
            }
          />
        </div>
      </section>

      {/* ===================================== */}
      {/* ANALYTICS GRID */}
      {/* ===================================== */}

      <section
        className="
          grid
          grid-cols-12
          gap-5
          min-h-[420px]
          items-stretch
        "
      >
        {/* TEMPORAL */}

        <div
          className="
            col-span-3
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <TemporalAnalysis
            investigation={
              investigation
            }
          />
        </div>

        {/* TRANSACTION */}

        <div
          className="
            col-span-6
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <TransactionIntelligence
            investigation={
              investigation
            }
          />
        </div>

        {/* RISK */}

        <div
          className="
            col-span-3
            rounded-2xl
            border
            border-cyan-500/10
            bg-[#07111f]/95
            shadow-[0_0_40px_rgba(0,255,255,0.03)]
            p-5
            overflow-hidden
          "
        >
          <RiskAssessment
            investigation={
              investigation
            }
          />
        </div>
      </section>

      <InvestigationFooter />
    </main>
  );
}