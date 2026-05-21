"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Search,
} from "lucide-react";

export default function HomePage() {
  const router =
    useRouter();

  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSearch =
    async () => {
      if (!query.trim()) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            `http://localhost:5000/api/wallet/search/${query}`
          );

        const data =
          await response.json();

        /* FAILED */

        if (
          !data.success
        ) {
          alert(
            data.message ||
            "Investigation failed"
          );

          return;
        }

        /* SUCCESS */

        router.push(
          `/investigation/${query}?id=${data.investigationId}`
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to connect backend"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main
      className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          text-center
        "
      >
        {/* LOGO */}

        <div
          className="
            mb-6
          "
        >
          <h1
            className="
              text-6xl
              font-bold
              tracking-tight
            "
          >
            ChainSight
          </h1>

          <p
            className="
              text-zinc-400
              mt-4
              text-lg
            "
          >
            Cryptocurrency
            Investigation &
            AML Intelligence
            Platform
          </p>
        </div>

        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            gap-3
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            px-5
            py-4
            shadow-2xl
          "
        >
          <Search
            size={22}
            className="
              text-zinc-500
            "
          />

          <input
            type="text"
            placeholder="Enter wallet address or transaction hash"
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                handleSearch();
              }
            }}
            className="
              flex-1
              bg-transparent
              outline-none
              text-lg
              placeholder:text-zinc-500
            "
          />

          <button
            onClick={
              handleSearch
            }
            className="
              bg-white
              text-black
              px-5
              py-2
              rounded-xl
              font-medium
              hover:opacity-90
              transition
            "
          >
            Investigate
          </button>
        </div>

        {/* FEATURES */}

        <div
          className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >
            <h3
              className="
                font-semibold
                mb-2
              "
            >
              Wallet Tracing
            </h3>

            <p
              className="
                text-sm
                text-zinc-400
              "
            >
              Recursive custody
              graph analysis
              across wallets.
            </p>
          </div>

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >
            <h3
              className="
                font-semibold
                mb-2
              "
            >
              AML Intelligence
            </h3>

            <p
              className="
                text-sm
                text-zinc-400
              "
            >
              Detect laundering,
              routing, layering,
              and suspicious fund
              flows.
            </p>
          </div>

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
            "
          >
            <h3
              className="
                font-semibold
                mb-2
              "
            >
              Risk Analysis
            </h3>

            <p
              className="
                text-sm
                text-zinc-400
              "
            >
              Relationship
              intelligence,
              exchange exposure,
              and forensic
              findings.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}