# Build & Security Guidelines — AI Portfolio Portal + Voice Agent

**Status:** Living document. Every agent (Claude Code or otherwise) working in this repo
must read this file in full before writing code, provisioning AWS resources, or opening
a PR. If something here conflicts with a task instruction, flag the conflict to the
founder — do not silently pick one.

This document governs two systems of very different risk profiles:
1. **Portal** (Amplify/Next.js, contact form, DynamoDB) — public-facing, low sensitivity.
2. **Voice pipeline** (Connect, Lex/Nova Sonic, outbound dialing, DNC, call logs) — handles
   PII, dials real phone numbers, and carries real legal exposure (TCPA, state
   AI-disclosure laws). Treat every task touching this system as high-risk by default.

See `project-spec-ai-portal-voice-agent.md` for the phased build plan this doc supports.

---

## 🛑 MANDATORY MODEL-SWITCH GATE — READ THIS FIRST

**Before running any code review or CSO/security review pass, the agent MUST stop and
ask the founder to switch the active model to Opus.** This applies regardless of which
skill or command triggers the review — `/code-review`, `/security-review`, `/cso`,
ultrareview, or an ad-hoc "review this" request.

- Do not run the review on Sonnet, Haiku, or any non-Opus model "to save time" or because
  the founder seems busy. This is a hard stop, not a suggestion.
- Do not proceed past the gate based on an earlier approval in the conversation — ask
  again each time a review is about to start, unless the founder has explicitly said
  "you don't need to ask again this session."
- The ask should be explicit and blocking, e.g.:
  > "This is a code review / CSO review gate. Please switch the model to Opus
  > (`/model opus`) before I proceed — this is a mandatory guideline for this repo."
- If the founder declines or wants to proceed on the current model anyway, that is their
  call to make — but the agent must have surfaced the ask first. Silent compliance with
  "just review it" without surfacing the gate is a violation of this guideline.
- Once the review is complete, the agent may note that the founder can switch back.

This gate exists because review/CSO passes are the last line of defense against shipping
IAM misconfigurations, exposed secrets, or compliance gaps into a system that dials real
phone numbers and stores PII. A cheaper/faster model is the wrong tradeoff at this
checkpoint specifically — everywhere else, model choice is flexible.

---

## Phase gate — do not skip

Per the project spec: **Phase 3+ (voice agent) work must not start without an explicit
go-ahead from the founder**, even if code for it seems easy to stub out while working on
the portal. If a task description drifts into Connect/Lex/outbound-dialing territory
before that go-ahead, stop and ask.

Within Phase 3+, provisioning **Amazon Connect Outbound Campaigns is additionally gated**
on the Section 6 compliance checklist being signed off: consent basis documented,
DNC source identified, AI-disclosure script approved. An agent should refuse to
provision the outbound campaign infrastructure without explicit confirmation these are
checked off — "the code is ready" is not the same as "compliant to dial."

---

## Before the build (design phase — per feature/phase)

Work through this before writing implementation code:

- **Threat-model the specific system being touched.** Portal features get standard
  web-app scrutiny (input validation, auth on write endpoints, XSS/injection). Voice
  pipeline features get the heavier bar: PII handling, call-recording retention, consent,
  DNC enforcement.
- **Design IAM before provisioning.** Write down which Lambda needs which action on which
  resource (e.g. `lead-intake` → `dynamodb:PutItem` on `leads` table only) *before*
  creating the role. Never grant a wildcard action/resource "temporarily" — scope it
  correctly the first time.
- **Classify the data.** Anything landing in `leads`, `dnc-list`, or `call-logs` tables is
  PII. Decide encryption-at-rest, retention window, and read-access scope as part of the
  schema design, not after.
- **Inventory secrets.** Any credential (Connect, Lex, SES/SNS, third-party API keys)
  goes in Secrets Manager or SSM Parameter Store. Never in `.env` committed to git, never
  hardcoded in Lambda source.
- **Confirm compliance prerequisites are checked**, per Section 6 of the spec, before
  designing any Phase 3+ feature — consent basis, DNC source, disclosure script.

---

## During the build (every PR / every session)

- **IAM diff review**: every new or changed IAM policy must match the least-privilege
  design above. A policy broader than what was scoped is a blocking issue, not a style
  note.
- **No secrets in code or history.** Check diffs before committing — a plausible-looking
  filename is not proof a file is safe to stage; check contents.
- **Input validation at every external boundary.** The contact form Lambda and API
  Gateway route are the portal's real attack surface — validate and bound all input,
  do not trust client-side validation alone.
- **Explicit CORS and auth on API Gateway routes.** No permissive defaults left in place
  "to make testing easier."
- **DNC-check Lambda requires its own passing tests** proving the block path works, before
  merge. This has no native AWS safety net (see Known Gaps in the spec) — a shortcut here
  is a compliance failure, not a nitpick.
- **AI-disclosure line is tested as a mandatory, unskippable node** in any call flow, not
  merely present in a script string.
- **Dependency hygiene**: no adding a package without checking it's maintained and free of
  known critical CVEs.
- **Cost awareness**: anything that could loop, retry unboundedly, or scale dialing volume
  needs a sanity check against runaway AWS spend before merge (see AWS Budgets note below).

---

## After the build (pre-launch and ongoing)

- **Run a security/CSO review pass before merging anything touching IAM, secrets, API
  Gateway auth, or the voice pipeline** — see the mandatory model-switch gate above.
- **CloudWatch alerting** wired before go-live for: Lambda invocation spikes, IAM policy
  changes, DNC-check failures/errors.
- **AWS Budgets alert** tied to the credit balance from the spec — spend anomalies (e.g. a
  misconfigured outbound campaign dialing in a loop) must surface before they burn credits
  silently.
- **Re-verify compliance controls periodically, not just once.** Phase 5's acceptance
  criteria (known-DNC test number blocked, disclosure line plays before any pitch content)
  should be re-run on a recurring basis once live, not treated as a one-time gate.
- **Document deferred hardening explicitly.** If something is knowingly punted (custom
  domain, WAF rules, transcript retention policy, etc.), write it down in this doc's
  "Known Gaps" section below rather than letting it go unrecorded.

---

## Known Gaps / Deferred Items (keep updated)

- Custom domain + Route 53 — deferred to a later phase per spec Section 3.
- WAF rules on API Gateway / CloudFront — not yet configured, revisit before real lead
  volume goes through the contact form.
- Call transcript retention policy — not yet defined; must be decided before Phase 3
  transcripts start being stored.
- *(Add new deferred items here as they come up — do not let them go unrecorded.)*

---

## Maintenance of this document

This is a living document — update it when:
- A new class of risk is identified during a build phase.
- A guideline here turns out to be unworkable in practice (update it, don't just ignore it).
- A new AWS service or third-party integration is added to the stack.

Any agent that updates this file should leave the rest of the structure intact and add
to the relevant section rather than rewriting wholesale.
