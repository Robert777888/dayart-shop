---
description: Run at the end of each work session to review and potentially promote skills.
---

## Daily Skill Review Workflow

**Trigger**: Run at end of each work session.

### Steps:

1. **List Activated Skills**: Identify every skill that was activated today (check session context and `task.md` history).
2. **Evaluate Skills**: For each skill used, answer:
   - Did it produce correct output? (Y/N)
   - Was the trigger appropriate? (Y/N)
   - Could this skill be useful in OTHER projects? (Y/N)
3. **Corrective Actions**:
   - **Incorrect Output**: Rewrite the skill file (`SKILL.md`), fix the logic, and log the issue in `CARRYOVER.md`.
   - **Weak Trigger**: Update the skill's `triggers:` section in frontmatter to be more specific or descriptive.
   - **Cross-Project Potential**: **PROMOTE**:
     - Copy the skill folder to `~/.gemini/antigravity/skills/`.
     - Register the skill in `~/.gemini/antigravity/skills/GLOBAL_SKILL_INDEX.md`.
     - Set `Source: custom` in the index table.
4. **Update Logs**: Update `CARRYOVER.md` with:
   - Skills promoted today.
   - Skills fixed today.
   - Skills flagged for deletion or refinement.
