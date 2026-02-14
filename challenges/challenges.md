Hack the Law 2026: Projected Challenge Themes

  Based on analyzing the 2025 challenges and the shifts in AI/legal tech through 2025-2026, here's what the next wave could look like.

  ---
  What changed from 2025 to 2026

  The 2025 challenges were heavily centered on:
  - RAG + retrieval over static legal corpora
  - Summarization and extraction from documents
  - Single-user, single-session tools (chatbots, dashboards)
  - Junior lawyer upskilling as a worry

  By 2026, the landscape has shifted:
  - Agentic AI is production-ready (multi-step, tool-using workflows)
  - AI regulation is real — EU AI Act enforcement began, UK frameworks are maturing
  - Multi-modal capabilities (audio transcription, document vision, video analysis) are commodity
  - AI-to-AI interaction is emerging (automated negotiation, compliance checking)
  - Verification and trust have become the central concern, not capability
  - Courts themselves are digitizing (online hearings, AI-assisted case management)
  - Law firms have moved from "should we use AI?" to "how do we govern AI we already deployed?"

  ---
  Proposed 2026 Challenges

  1. AI Compliance Auditor — Regulating the Regulators' AI

  Sponsor archetype: Legal regulator (e.g., BSB, SRA, or FCA)

  Background: Law firms and regulated entities now deploy AI across client-facing workflows. The EU AI Act classifies legal AI as high-risk. Regulators need tools to assess whether AI systems used by the entities they regulate meet transparency, fairness,
   and accuracy requirements — but they lack the technical capacity to audit at scale.

  Challenge: Build a tool that can audit an AI system's outputs for legal compliance. Given a set of AI-generated legal outputs (advice summaries, risk assessments, contract clauses), the tool should:
  - Detect hallucinated citations or fabricated legal authorities
  - Assess whether outputs exhibit bias across demographic scenarios
  - Generate a structured compliance report aligned with EU AI Act Article 14 (human oversight) and Article 13 (transparency)
  - Provide a confidence-calibration score: does the AI know when it doesn't know?

  Why this is 2026: In 2025, the challenges assumed AI outputs were useful and asked "how do we build them?" In 2026, AI is deployed and the question is "how do we trust and govern what's already running?"

  ---
  2. Agentic Legal Workflow — From Research to Filing

  Sponsor archetype: Large international firm (e.g., Clifford Chance, Linklaters)

  Background: In 2025, tools could answer a single legal question. But real legal work is a workflow: research the law, draft the document, check compliance, get approval, file with the court. Each step depends on the last. AI agents that can plan,
  execute, and recover from errors across multi-step legal tasks are now technically feasible.

  Challenge: Design an agentic system that completes an end-to-end legal workflow. Given a scenario (e.g., "Our client received a statutory demand — respond within 18 days"), the system should:
  - Research the applicable rules and time limits
  - Draft the appropriate response document
  - Self-verify citations and procedural compliance
  - Flag decision points requiring human input (with clear reasoning for why)
  - Produce an audit trail of every action taken and source consulted

  Judging emphasis: Not just the final output, but the reliability of the process — how does the agent handle ambiguity, conflicting sources, and its own uncertainty?

  ---
  3. AI-Assisted Online Dispute Resolution

  Sponsor archetype: Access to justice organization or court modernization body

  Background: Online dispute resolution (ODR) has expanded significantly. Small claims, consumer disputes, and employment tribunals increasingly operate digitally. But parties — especially litigants in person — still struggle to articulate their case,
  understand procedure, and engage meaningfully with the process.

  Challenge: Build a system that guides both parties through an online dispute resolution process for a small civil claim (under £10,000). The tool should:
  - Help each party structure their case (facts, evidence, desired outcome) through conversational interaction
  - Identify areas of agreement and disagreement between the parties
  - Suggest potential settlement ranges based on comparable outcomes
  - Generate a neutral case summary for an adjudicator
  - Ensure procedural fairness — neither party should receive an advantage from the AI

  Why this is 2026: Access to justice was a 2025 theme (BSB, vLex), but framed as information delivery. In 2026, the challenge is active facilitation of a legal process, raising questions about neutrality, fairness, and the AI's role in dispute outcomes.

  ---
  4. Cross-Jurisdictional Regulatory Divergence Tracker

  Sponsor archetype: Regulatory intelligence firm (e.g., RegGenome) or multinational firm

  Background: Post-Brexit regulatory divergence between UK, EU, and other jurisdictions is accelerating. Firms operating across borders need to understand not just what the rules are, but where they diverge and what the divergence means operationally. The
   2025 challenge asked teams to classify regulatory documents. The 2026 challenge asks them to reason across jurisdictions.

  Challenge: Given parallel regulatory frameworks from two or more jurisdictions (e.g., UK FCA vs. EU MiFID II, or UK Data Protection Act vs. EU GDPR post-2025 amendments), build a tool that:
  - Identifies corresponding provisions across jurisdictions
  - Detects meaningful divergences (not just textual differences, but different obligations)
  - Assesses the operational impact of divergence for a specific business type
  - Monitors for new divergences as regulations update, using live regulatory feeds
  - Outputs a structured divergence report with severity scoring

  ---
  5. AI-Powered Negotiation Sandbox

  Sponsor archetype: Legal innovation firm (e.g., Legora, Luminance)

  Background: In 2025, Legora's challenge explored "legal memory" across documents and Clifford Chance explored mentorship. In 2026, the frontier is interactive legal reasoning — can AI engage in the back-and-forth of negotiation, not just analyze static
  documents?

  Challenge: Build a negotiation simulation environment where:
  - A user (junior lawyer or trainee) negotiates contract terms with an AI counterparty
  - The AI counterparty has a defined mandate (e.g., "minimize liability caps, insist on governing law of New York, resist broad indemnities")
  - The system evaluates the user's negotiation strategy in real-time: are they conceding too much? Missing leverage points? Failing to spot problematic language?
  - After the negotiation, the system generates a debrief: what went well, what was missed, how the final position compares to market standard
  - Stretch: the AI can adapt its negotiation style (aggressive, collaborative, evasive) based on the training scenario

  Why this is 2026: The mentorship/training challenges in 2025 were about feedback on static work product. In 2026, the challenge is dynamic, adversarial interaction — training through simulation, not just review.

  ---
  6. Courtroom Audio Intelligence

  Sponsor archetype: Litigation-focused firm (e.g., Latham & Watkins, Brown Rudnick)

  Background: Many hearings are now recorded or conducted remotely. Transcripts exist but are expensive, slow to produce, and lose nuance. Multi-modal AI can now process audio directly.

  Challenge: Given recordings of mock tribunal or court hearings, build a tool that:
  - Produces real-time or near-real-time transcription with speaker identification
  - Identifies key moments: objections, judicial interventions, witness contradictions, concessions
  - Maps the hearing against the case's legal issues (which arguments were actually addressed?)
  - Generates a structured hearing summary with timestamps and linked legal issues
  - Flags moments where the judge's questioning suggests concerns about a particular argument

  Why this is 2026: The 2025 challenges were entirely text-based. Multi-modal AI makes audio/video analysis practical for the first time at hackathon scale.

  ---
  7. Responsible AI Procurement for Law Firms

  Sponsor archetype: Law firm innovation team (e.g., CMS) or legal operations consultancy

  Background: Law firms are now buying, not just building, AI tools. But procurement of AI systems raises novel questions: How do you evaluate an AI vendor's claims about accuracy? How do you ensure client data confidentiality? How do you maintain
  professional responsibility when relying on a third-party AI?

  Challenge: Build a tool or framework that helps a law firm evaluate and monitor AI vendors. It should:
  - Ingest vendor documentation (model cards, terms of service, security certifications) and extract key risk factors
  - Generate a structured risk assessment against a legal-profession-specific framework (covering accuracy, confidentiality, bias, explainability, and professional conduct rules)
  - Continuously monitor deployed tools for drift: are outputs changing in quality over time?
  - Produce client-facing disclosures about AI use that comply with professional conduct obligations
  - Compare multiple vendors on standardized criteria

  ---
  8. Predictive Case Trajectory Modeling

  Sponsor archetype: Litigation funder or insurance firm (e.g., Brown Rudnick)

  Background: Brown Rudnick's 2025 challenge asked for a settlement value estimator. In 2026, with more data and better reasoning models, the challenge extends from static valuation to dynamic trajectory prediction.

  Challenge: Build a system that models the likely trajectory of a litigation case as it unfolds. Given a case at any stage, the tool should:
  - Predict likely next procedural steps and their timelines
  - Estimate probability-weighted outcome ranges that update as new events occur (motions filed, discovery completed, judge assigned)
  - Model the impact of strategic decisions ("What happens to expected value if we file a summary judgment motion?")
  - Account for judge-specific and jurisdiction-specific tendencies
  - Present results in a format suitable for litigation funding decisions or board reporting

  ---
  9. Privacy-Preserving Legal AI — Federated Learning for Sensitive Data

  Sponsor archetype: Data-focused legal tech (e.g., Luminance, Simmons Wavelength)

  Background: The biggest barrier to better legal AI is data access. Law firms have rich datasets but cannot share them due to client confidentiality. This creates a paradox: AI needs data to improve, but the most valuable legal data is the most
  restricted.

  Challenge: Design and demonstrate a privacy-preserving approach to improving legal AI. This could involve:
  - Federated learning across simulated "firms" that never share raw data
  - Differential privacy techniques applied to contract analytics
  - Synthetic data generation that preserves statistical properties of real legal documents without exposing confidential information
  - A governance framework for how firms could participate in collaborative AI improvement without breaching duties of confidentiality

  Why this is 2026: The data access problem was implicit in every 2025 challenge (each sponsor provided curated datasets). In 2026, the challenge confronts the structural problem directly.

  ---
  10. AI-Assisted Legislative Drafting and Impact Assessment

  Sponsor archetype: Government body, parliamentary counsel, or policy organization

  Background: Legislation is increasingly complex, frequently amended, and often has unintended consequences. AI can now reason about legal text at a level that makes legislative impact assessment feasible.

  Challenge: Build a tool that assists legislative drafters by:
  - Analyzing a proposed amendment to existing legislation and identifying all provisions it would affect
  - Detecting potential conflicts or inconsistencies with existing law
  - Modeling the likely impact on different stakeholder groups (businesses, consumers, regulated entities)
  - Suggesting alternative drafting that achieves the same policy objective with fewer unintended consequences
  - Generating a plain-language impact summary for public consultation

  ---
  Summary: 2025 vs 2026 Evolution
  ┌───────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────────┐
  │     Dimension     │             2025 Challenges              │            2026 Projected Challenges            │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Core task         │ Retrieve, summarize, extract             │ Reason, decide, verify, govern                  │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Interaction model │ Single query → single answer             │ Multi-step workflows, simulations, negotiations │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Modality          │ Text only                                │ Text + audio + structured data                  │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Trust model       │ Implicit (assume AI is useful)           │ Explicit (audit, calibrate, verify)             │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Scope             │ Single jurisdiction, single document set │ Cross-jurisdictional, cross-temporal            │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ AI role           │ Assistant                                │ Agent, counterparty, auditor                    │
  ├───────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Central concern   │ "Can AI do this?"                        │ "Can we trust AI doing this?"                   │
  └───────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────────┘
  The through-line: 2025 proved AI can process legal information. 2026 asks whether AI can participate in legal processes — and whether we can govern it when it does.
