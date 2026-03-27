---
description: Run once a month to sync with community skills and clean up the global index.
---

## Monthly Skill Update Workflow

**Trigger**: Run once a month.

### Steps:

1. **Sync Community Skills**:
   ```bash
   npx @vudovn/ag-kit update
   ```
   (Pulls latest community skills from the central repository).

2. **Scan for Improvements**:
   - Scan the updated community skill list for any skill that matches tags in `GLOBAL_SKILL_INDEX.md`.
   - If a community version is objectively better or more comprehensive than a `custom` skill, flag it for manual review.

3. **Cleanup Inactive Skills**:
   - identify skills in `GLOBAL_SKILL_INDEX.md` that haven't been loaded or referenced in the last 30+ days.
   - Remove these `inactive` skills from the global index to keep the context narrow.

4. **Document Changes**:
   - Log all additions, deletions, and major updates to `CHANGELOG.md` under today's date.
