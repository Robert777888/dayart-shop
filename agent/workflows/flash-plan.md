---
description: Create a highly specific, atomic implementation plan tailored for simple execution agents (like Gemini Flash).
---

# /flash-plan - Micro-Task Breakdown Workflow

**Trigger**: Use when you have a complex task or vision and you want the Architect agent to break it down so completely that a cheaper/faster model (or a secondary prompt) can execute it flawlessly without creative decisions.

## Goal
Generate an `IMPLEMENTATION-{slug}.md` file that acts as an instruction manual for a "dumb" executor agent.

## Steps

1. **Context & Requirement Gathering**:
   - The user provides the raw objective (e.g., `/flash-plan Készíts egy Python scriptet ami PDF-t olvas`).
   - If the request is lacking architectural edge cases, ask 1-2 clarifying questions immediately.

2. **Load Skill**:
   - Read the `agent/skills/flash-execution-planning/SKILL.md` skill to absorb the formatting and specificity rules.

3. **Draft the Implementation Plan**:
   - Create the `docs/IMPLEMENTATION-{slug}.md` file.
   - Use the `[MODIFY]`, `[CREATE]` syntax for every file.
   - Provide explicit variable names, exact algorithms, and if/else conditions. Do NOT just write "make a function to do X". Write the exact parameter types and logic steps.
   - Limit the plan to 5-7 executable steps.
   - Include a completely deterministic `## Done When` verification checklist.

4. **Handoff**:
   - Save the file.
   - Provide the user with the exact CLI command or prompt they can copy-paste to the Flash agent or terminal to start execution (e.g., "Mondd ezt a Flash agentnek: *Hajtsd végre a `docs/IMPLEMENTATION-{slug}.md` fájl alapján a fejlesztést.*")
