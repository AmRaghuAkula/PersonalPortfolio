# Project Spec: AI Portfolio Portal + AI Voice Lead Agent

**Owner:** [Your name]
**Prepared for:** Claude Code build handoff
**Status:** AWS account/region/credits verified, GitHub repo created (2026-08-12). **Sequencing decision: portal-first** — build and launch Phases 1-2 (portal + lead capture) now; Phase 3+ (voice agent) is explicitly paused until portal is live and content/compliance inputs are ready. Do not start Phase 3 work without an explicit go-ahead.

---

## 1. Project Summary

Build a personal/professional web portal that showcases tech industry experience, lists AI services offered, displays AI project work, and connects to an AI voice agent that calls leads on the owner's behalf. Target cloud: **AWS** (startup credits available).

This is two connected systems:
1. **Public-facing portal** (marketing/portfolio site)
2. **Backend lead-gen system** (AI voice agent + lead pipeline), triggered from portal contact forms or an existing lead list

---

## 2. Scope

### In scope
- Static/server-rendered portal with 5 pages: Home, Experience, Services, AI Work, Contact
- Lead capture form → stored in DynamoDB → visible in a simple admin view or spreadsheet export
- Outbound AI voice agent that calls leads, delivers a scripted/dynamic pitch, and either books a callback or hands off to a human
- Call logging and basic analytics (completed, no-answer, callback booked)
- DNC (Do Not Call) list enforcement before any outbound dial
- AI-disclosure compliance line at the start of every AI-initiated call

### Out of scope (for this phase)
- Inbound customer support call handling
- CRM replacement (this is a lead pipeline, not a full CRM)
- Multi-language support (English only, v1)
- Mobile app (portal is responsive web only)
- Payment processing / e-commerce

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend hosting | AWS Amplify | CI/CD from git repo, handles build+deploy |
| Static assets/CDN | S3 + CloudFront | Images, resume PDF, portfolio media |
| Domain/DNS | AWS Amplify default domain (`*.amplifyapp.com`) — free, auto-assigned | Route 53 + custom domain is a **deferred later phase**, added post-validation once the page is getting traffic — no domain purchase for v1 |
| Frontend framework | Next.js (React) | SSR not required but supported if SEO matters later |
| Backend compute | AWS Lambda | Contact form handler, call-trigger logic, DNC check |
| API layer | API Gateway | Fronts Lambda functions for portal → backend calls |
| Lead/data store | DynamoDB | Leads, call logs, DNC flags |
| AI voice agent | Amazon Connect + Amazon Lex / Nova Sonic 2 | Outbound calling + conversational AI |
| Outbound campaign engine | Amazon Connect Outbound Campaigns | Dialing, quiet hours, call-attempt limits |
| AI model access (showcase demos) | Amazon Bedrock | Used for portfolio "AI work" demos, not the voice agent itself |
| Notifications | SES (email) / SNS (SMS) | Callback confirmations, internal alerts |
| Monitoring | CloudWatch | Logs, call metrics, error alerting |
| IAM | AWS IAM | Scoped roles per Lambda function — no root usage in code |

**Region constraint:** Amazon Connect Outbound Campaigns is only available in: US East (N. Virginia), US West (Oregon), Canada (Central), Europe (London), Europe (Frankfurt), Asia Pacific (Sydney), Africa (Cape Town). Pick the region covering the owner's calling geography before provisioning anything.

---

## 4. Architecture Overview

```
[Portal - Amplify/Next.js]
   |
   |-- Contact Form --> [API Gateway] --> [Lambda: lead-intake] --> [DynamoDB: leads table]
   |
   |-- Static content served via CloudFront/S3

[Lead Pipeline - triggered manually or on new lead]
   [Lambda: dnc-check] --> queries [DynamoDB: dnc-list]
        |
        v (if clear)
   [Amazon Connect Outbound Campaign] --> dials lead
        |
        v
   [Amazon Lex / Nova Sonic 2] handles conversation
        |
        v
   [Lambda: call-outcome-logger] --> writes to [DynamoDB: call-logs]
        |
        v (if callback requested)
   [SES/SNS notification] --> owner + lead confirmation
```

---

## 5. Build Phases & Tasks

### Phase 1 — Environment Setup
- ~~Provision AWS account structure~~ ✅ Confirmed 2026-08-12 — account "Hireastra AI Inc" active, region us-east-1 (N. Virginia)
- Set up IAM roles: `portal-deploy`, `lambda-execution`, `connect-admin` (scoped, least-privilege) — not yet created
- ~~Create GitHub repo for the portal~~ ✅ Created 2026-08-12 — [github.com/AmRaghuAkula/PersonalPortfolio](https://github.com/AmRaghuAkula/PersonalPortfolio) (public, Node .gitignore)
- ~~Register/migrate domain to Route 53~~ — **deferred**, using free Amplify default domain for v1
- ~~Confirm Bedrock model access enabled in target region~~ ✅ Not applicable — AWS retired the manual model-access gate; models activate automatically on first use
- **Acceptance criteria:** AWS CLI/console access confirmed working; GitHub repo created and connected to Amplify

### Phase 2 — Portal Build
- Scaffold Next.js app, deploy via Amplify
- Build 5 pages using content supplied by owner (LinkedIn-derived experience, services list, AI work samples)
- Build contact form → API Gateway → Lambda → DynamoDB
- **Acceptance criteria:** Portal live on Amplify default domain (`*.amplifyapp.com`); form submission creates a record in DynamoDB visible via console query

### Phase 3 — AI Voice Agent Core
- Provision Amazon Connect instance in the correct region
- Configure Lex bot / Nova Sonic 2 voice flow with owner-approved script
- Build AI-disclosure opening line into every contact flow (non-negotiable, compliance requirement)
- Build `dnc-check` Lambda: queries DynamoDB DNC table before any dial is placed
- **Acceptance criteria:** Test call to owner's own number completes end-to-end; DNC-flagged test number is correctly blocked from dialing

### Phase 4 — Outbound Campaign + Lead Pipeline
- Configure Connect Outbound Campaigns: quiet hours, max attempts, time-zone rules
- Wire call outcomes back into DynamoDB call-logs table
- Build callback-booking flow (Lambda + SES/SNS notification to owner)
- **Acceptance criteria:** A batch of 5-10 test leads can be dialed, outcomes logged, and a callback request triggers a notification

### Phase 5 — Compliance Pass
- Verify DNC list is populated and enforced (test with a known-DNC test number)
- Verify AI-disclosure line plays on every call before any pitch content
- Document consent basis for the lead list being used (this is a process check, not code — flag to owner if unclear)
- **Acceptance criteria:** Compliance checklist below is fully signed off before any real leads are dialed

### Phase 6 — QA + Soft Launch
- Run a 10-20 lead soft launch batch
- Review call recordings/transcripts for script issues
- Fix any dead-ends or bot confusion points in the conversation flow
- **Acceptance criteria:** Owner reviews soft-launch call logs and approves for full rollout

---

## 6. Prerequisites (must be confirmed before Phase 1 starts)

**Content (owner-provided, blocks Phase 2)**
- [ ] LinkedIn experience data exported and handed off as source content
- [ ] Finalized list of AI services offered
- [ ] 2-3 AI work samples/case studies cleared for public display
- [ ] Existing lead list (format: spreadsheet/CRM export) with consent basis known

**AWS account** — ✅ verified in console 2026-08-12
- [x] Startup credits activated: **$10,139.92 available** ($10,000 AWS Activate – Communitech Strategic Growth Early Stage, expires 07/31/2028; $20 Explore AWS credit, expires 06/26/2027; $0.08 used to date)
- [x] Target AWS region chosen: **us-east-1 (N. Virginia)** — valid for Outbound Campaigns
- [x] Bedrock model access — not required; AWS auto-enables on first invoke (manual gate retired)
- [ ] ~~Domain name~~ — deferred; using free Amplify subdomain for v1, custom domain is a later phase
- [x] GitHub repo created: [github.com/AmRaghuAkula/PersonalPortfolio](https://github.com/AmRaghuAkula/PersonalPortfolio)

**Compliance (blocks Phase 3-4, not just Phase 5)**
- [ ] Consent basis for the lead list documented (cold list vs. opted-in — changes risk profile significantly)
- [ ] AI-disclosure script line drafted and approved by owner
- [ ] DNC list source identified (owner's own opt-outs + national registry if applicable)

**Decisions needed from owner before build**
- [ ] Call script / talking points for the voice agent
- [ ] Handoff rule: when should the AI transfer to a human vs. just book a callback?
- [ ] Where should call outcome data live long-term — spreadsheet export is fine for v1, but confirm

---

## 7. Expected Outcomes / Definition of Done

- Portal is live on the free Amplify subdomain (custom domain deferred to a later phase), publishing experience, services, and AI work
- Contact form leads flow automatically into DynamoDB
- AI voice agent can dial a lead list, deliver a compliant scripted conversation, and log outcomes
- DNC and AI-disclosure compliance controls are verifiably working, not just configured
- Owner can review call outcomes and callback requests without needing AWS console access (via notification or simple export)
- Total AWS spend tracked against credit balance, with alerting before credits run out

---

## 8. Known Gaps / Things Claude Code Should Flag, Not Silently Solve

- Amazon Connect Outbound Campaigns has **no fully native DNC list feature** — the DNC check is a custom Lambda + DynamoDB layer described above. If a shortcut version is built instead, flag it clearly as reduced compliance coverage.
- No native AWS calendar/booking service — callback booking will need either a simple internal slot system or integration with the owner's actual calendar tool (not yet chosen).
- Legal requirements (TCPA, state AI-disclosure laws, consent) are **process and content decisions the owner must make** — Claude Code should implement the technical controls but should not treat "code deployed" as equivalent to "legally compliant" without the owner's sign-off from Section 6.

---

## 9. Open Questions for Owner (fill in before Phase 3)

1. What is the AI voice agent's call script / opening line?
2. What triggers a human handoff mid-call?
3. What region will most leads be called in/from?
4. Where should call logs and lead data ultimately live for the owner's day-to-day use?
