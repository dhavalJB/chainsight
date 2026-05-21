ChainSight Backend Roadmap
Current Status: ~45–55% Complete Prototype

Current API:

curl.exe http://localhost:5000/api/wallet/search/:wallet

Current capability:

wallet
↓
detect chain
↓
fetch transactions
↓
fetch assets
↓
behavior analysis
↓
exchange correlation
↓
custody tracing
↓
wallet profiling
↓
intelligence generation

You already built:

forensic enrichment
routing intelligence
merchant detection
custody foundation
exchange inference
velocity analysis

This is already serious prototype territory.

PHASE 1 — STABILIZE CURRENT ENGINE
PRIORITY: CRITICAL
Timeline: 1–2 Days

Goal:
make current API reliable and internally clean.

1.1 Fix Centralized Behavior Engine
Problem

Currently:

transactionAnalysis.behavior

and:

root behavior

return inconsistent results.

Update
make ONE centralized behavior engine only
remove duplicate behavior generation
Result

Single source of forensic truth.

1.2 Build Standard Transaction Schema

Create:

utils/transactionNormalizer.js

Every chain should output:

{
  hash,
  from,
  to,
  asset,
  amount,
  timestamp,
  direction,
  type,
  chain
}
Why

This becomes:

universal intelligence layer.
1.3 Add Error Protection

Need:

recursion protection
API timeout handling
RPC failure fallback
rate limit protection
1.4 Build Lite Recursive Fetchers

Create:

getBscWalletLite()
getTonWalletLite()

Only return:

txCount
recent txs
active

Used for:

recursive tracing
graph traversal
clustering
PHASE 2 — MULTI-HOP FORENSIC TRACING
PRIORITY: HIGHEST
Timeline: 2–4 Days

This is your biggest backend upgrade.

2.1 Recursive Custody Tracing

Current:

wallet → receiver

Need:

wallet
↓
wallet
↓
exchange
↓
withdrawal
Update

Enhance:

custodyService.js

Add:

recursion depth
hop tracking
visited wallet cache
2.2 Backward Tracing

Need:

Who funded this wallet?

Create:

fundingTraceService.js

This traces:

incoming source chains
2.3 Multi-Directional Flow Engine

Need:

upstream tracing
downstream tracing
circular flow detection
2.4 Flow Concentration Analysis

Detect:

Most funds go to:
- Binance
- TON wallets
- routing wallets

This becomes:

destination intelligence.
PHASE 3 — TON FORENSIC ENGINE
PRIORITY: VERY HIGH
Timeline: 2–3 Days

TON is core to your P2P use-case.

Currently:
TON only supports:

balance
active state

Need FULL intelligence.

3.1 TON Transaction History

Add:

incoming txs
outgoing txs
timestamps
token transfers
3.2 TON Custody Tracing

Need:

TON wallet
↓
customer
3.3 TON Merchant Detection

Detect:

rapid forwarding
repeated USDT routing
operational settlement
3.4 Cross-Chain Correlation

Goal:

BSC
↓
Binance
↓
TON

using:

amount similarity
timing similarity
routing patterns

This becomes:

ChainSight differentiator.
PHASE 4 — DEX & BRIDGE INTELLIGENCE
PRIORITY: VERY HIGH
Timeline: 3–5 Days

Currently missing entirely.

4.1 DEX Detection

Detect:

PancakeSwap
Uniswap
Jupiter
Raydium
SushiSwap
1inch

Create:

dexIntelligenceService.js
4.2 Swap Classification

Classify:

USDT → BNB
ETH → USDT
BNB → TRX
4.3 Bridge Detection

Detect:

Stargate
Wormhole
Multichain
LayerZero

This massively improves:

laundering detection.
4.4 Non-Custodial Profiling

Detect:

self-custody behavior
swap-heavy wallets
bridge-heavy wallets
PHASE 5 — WALLET CLUSTERING ENGINE
PRIORITY: HIGH
Timeline: 4–6 Days

This becomes:

entity intelligence.
5.1 Wallet Linkage Detection

Detect:

same refill wallet
repeated routing
common counterparties
synchronized timing
5.2 Merchant Cluster Detection

Goal:

these 12 wallets
likely belong
to same operator
5.3 Wallet Graph Scoring

Create:

cluster confidence
operational similarity score
PHASE 6 — THREAT INTELLIGENCE LAYER
PRIORITY: HIGH
Timeline: 2–4 Days

Needed for:
judges
law enforcement
enterprise feel.

6.1 OFAC Integration

Add:

sanctioned wallets
Tornado Cash
blacklisted entities
6.2 Scam Wallet Database

Detect:

phishing wallets
fake token deployers
scam routers
6.3 Mixer Detection

Detect:

Tornado Cash
Wasabi
CoinJoin behavior
PHASE 7 — TRANSACTION HASH INVESTIGATION
PRIORITY: MEDIUM
Timeline: 1–2 Days

Currently:
wallet only.

Need:

/api/tx/search/:hash

Output:

sender
receiver
asset
chain
exchange interaction
custody continuation
risk intelligence
PHASE 8 — DATABASE & INVESTIGATION STORAGE
PRIORITY: HIGH
Timeline: 4–7 Days

Currently:
everything is live RPC.

Need:

persistence layer.
8.1 PostgreSQL / MongoDB

Store:

investigations
tagged wallets
cached profiles
custody graphs
8.2 Investigation Sessions

Allow:

case-based investigations
8.3 User Wallet Tagging

Add:

suspect
victim
exchange
mixer
mule
merchant
PHASE 9 — REPORT GENERATION ENGINE
PRIORITY: MEDIUM
Timeline: 2–3 Days

Needed for:

judges
cybercrime units
evidence export
9.1 PDF Reports

Generate:

wallet summary
risk assessment
custody flow
exchange exposure
timeline
9.2 Word Export

Needed for:
legal workflows.

PHASE 10 — GRAPH INTELLIGENCE ENGINE
PRIORITY: WOW FEATURE
Timeline: 5–8 Days

This becomes your visual differentiator.

10.1 Graph Node Engine

Nodes:

wallets
exchanges
DEXs
bridges
mixers

Edges:

transfers
swaps
deposits
routing
10.2 Interactive Investigation Graph

Visualize:

wallet
↓
Binance
↓
TON
↓
customer
10.3 Risk-Based Graph Coloring

Highlight:

suspicious clusters
laundering paths
mixer exposure
PHASE 11 — FULL MULTI-CHAIN EXPANSION
PRIORITY: MEDIUM
Timeline: Ongoing

Complete:

Tron
Solana
Bitcoin

with:

transaction intelligence
custody
profiling
routing
IDEAL FINAL BACKEND ARCHITECTURE
/api/wallet/search/:wallet
/api/tx/search/:hash
/api/investigation/:id
/api/report/:id
/api/graph/:wallet

Core engines:

walletService
behaviorService
custodyService
walletProfilerService
exchangeCorrelationService
dexIntelligenceService
threatIntelService
clusteringService
reportService
graphService
CURRENT POSITION

You are already beyond:

simple blockchain explorer

Current level:

blockchain forensic intelligence prototype

with:

behavioral analysis
custody tracing
exchange attribution
routing detection
merchant profiling
velocity intelligence
transaction enrichment
cross-chain inference foundation

This is already a strong backend foundation for ChainSight.