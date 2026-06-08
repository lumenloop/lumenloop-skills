# Build plan template

Fill this in after running the four-step recipe. Keep it to one screen. Replace every
`<…>` placeholder. Cite a source `url` for each prior-art claim (the MCP content tools
return summaries, not full text).

---

## Build plan: <project name>

**Idea (one sentence):** <what it does, for whom, on Stellar>

### Primitives
- <e.g. Classic asset + trustlines — for the tokenized share>
- <e.g. Soroban contract — for the escrow / settlement logic>
- <e.g. dapp — sign + submit from the UI>
- <e.g. Reflector oracle — per-asset valuation>
- <e.g. Anchor / SEP-12 — KYC for regulated issuance>

### Prior art (reuse / integrate vs. build)
| Project / SCF team | Slug | What it covers | Reuse? | Source url |
|---|---|---|---|---|
| <title> | <slug> | <capability> | integrate / fork / skip | <cited url> |
| <title> | <slug> | <capability> | integrate / fork / skip | <cited url> |

**Stays custom:** <the genuinely-new part you will build yourself>

### Recommended stack
| Layer | Choice | Why |
|---|---|---|
| Contract logic | Soroban (Rust) | <why> |
| Token / asset | Classic asset + SAC | <why> |
| Front end | stellar-sdk + Stellar Wallets Kit | <why> |
| Chain reads | Stellar RPC | <why> |
| Price feeds | Reflector (Pulse) | <why or "n/a"> |
| Ramps / KYC | SEP-<n> | <why or "n/a"> |

### First steps
1. <scaffold the Soroban contract / fund a testnet identity>
2. <issue the test asset + set authorization flags>
3. <wrap the asset as a SAC>
4. <wire a wallet to a minimal dapp that submits one transaction>
5. <…>

### Read next
- Build references: <Soroban / assets / dapp / data / standards / reflector-build — name the ones you used>
- Stellar developer docs: https://developers.stellar.org
