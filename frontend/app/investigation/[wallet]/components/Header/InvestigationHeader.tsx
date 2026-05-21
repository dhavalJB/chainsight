"use client";

import {
    useState,
} from "react";

import {
    Download,
    Share2,
    Plus,
    Copy,
    Check,
} from "lucide-react";

interface Props {
    investigation: any;
}

export default function InvestigationHeader({
    investigation,
}: Props) {
    const wallet =
        investigation?.wallet || "Unknown";

    const chain =
        investigation?.data
            ?.walletOverview?.chain ||
        "Unknown";

    const createdAt =
        investigation?.createdAt;

    const formattedDate =
        createdAt
            ? new Date(
                createdAt
            ).toLocaleString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute:
                        "2-digit",
                    second:
                        "2-digit",
                    timeZone:
                        "UTC",
                    timeZoneName:
                        "short",
                }
            )
            : "Unknown";

    const [copied, setCopied] =
        useState(false);

    const copyWallet =
        async () => {
            if (!wallet) return;

            try {
                await navigator.clipboard.writeText(
                    wallet
                );

                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 1000);
            } catch (error) {
                console.error(
                    "Copy failed",
                    error
                );
            }
        };

    return (
        <header
            className="
        w-full
        border
        border-cyan-500/10
        bg-[#07111f]/95
        rounded-2xl
        px-6
        py-5
        flex
        items-start
        justify-between
        gap-6
        backdrop-blur-xl
        shadow-[0_0_50px_rgba(0,255,255,0.03)]
      "
        >
            {/* LEFT */}

            <div
                className="
          flex
          flex-col
          gap-3
        "
            >
                {/* TOP */}

                <div
                    className="
            flex
            items-center
            gap-4
            flex-wrap
          "
                >
                    <h1
                        className="
              text-white
              text-3xl
              font-bold
              tracking-tight
              leading-none
            "
                    >
                        ChainSight
                    </h1>

                    <div
                        className="
              h-6
              w-px
              bg-cyan-500/20
            "
                    />

                    <p
                        className="
              text-zinc-500
              text-sm
              tracking-[0.18em]
              uppercase
              leading-none
            "
                    >
                        Crypto Investigation &
                        Forensic Intelligence
                    </p>

                    {/* CHAIN */}

                    <div
                        className="
              px-3
              py-1
              rounded-full
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-400
              text-xs
              font-medium
            "
                    >
                        {chain}
                    </div>
                </div>

                {/* WALLET */}

                <div
                    className="
            flex
            items-center
            gap-3
            flex-wrap
          "
                >
                    <p
                        className="
              text-zinc-200
              text-lg
              font-medium
              break-all
              leading-relaxed
            "
                    >
                        {wallet}
                    </p>

                    <button
                        onClick={
                            copyWallet
                        }
                        className="
    h-9
    w-9
    rounded-lg
    border
    border-cyan-500/10
    bg-[#081221]
    flex
    items-center
    justify-center
    text-zinc-500
    hover:text-cyan-400
    hover:border-cyan-500/30
    transition
  "
                    >
                        {copied ? (
                            <Check
                                size={16}
                                className="
        text-green-400
      "
                            />
                        ) : (
                            <Copy
                                size={16}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* RIGHT */}

            <div
                className="
          flex
          flex-col
          items-end
          gap-4
        "
            >
                {/* ACTIONS */}

                <div
                    className="
            flex
            items-center
            gap-3
          "
                >
                    {/* EXPORT */}

                    <button
                        className="
              h-11
              px-5
              rounded-xl
              border
              border-cyan-500/10
              bg-[#081221]
              text-white
              text-sm
              font-medium
              flex
              items-center
              gap-2
              hover:border-cyan-500/30
              hover:bg-cyan-500/5
              transition
            "
                    >
                        <Download
                            size={16}
                        />

                        Export Report
                    </button>

                    {/* SHARE */}

                    <button
                        className="
              h-11
              px-5
              rounded-xl
              border
              border-cyan-500/10
              bg-[#081221]
              text-white
              text-sm
              font-medium
              flex
              items-center
              gap-2
              hover:border-cyan-500/30
              hover:bg-cyan-500/5
              transition
            "
                    >
                        <Share2
                            size={16}
                        />

                        Share
                    </button>

                    {/* NEW */}

                    <button
                        className="
              h-11
              px-5
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              hover:opacity-90
              transition
              shadow-[0_0_25px_rgba(0,150,255,0.25)]
            "
                    >
                        <Plus
                            size={16}
                        />

                        New Investigation
                    </button>
                </div>

                {/* UPDATED */}

                <p
                    className="
            text-zinc-500
            text-sm
          "
                >
                    Last updated:{" "}
                    {formattedDate}
                </p>
            </div>
        </header>
    );
}