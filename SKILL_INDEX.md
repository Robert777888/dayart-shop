# Skill Index (Catalog)

This index allows the **Architect** to select the right tools for the job without loading all 500+ skills into context.

## 1. Network & Systems Engineering
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `network-engineer` | Execution | Tier 2 | `network`, `routing`, `ip` | General networking tasks & configs. |
| `wireshark-analysis` | Analysis | Tier 1 | `pcap`, `traffic`, `debug` | Analyzing packet captures. |
| `server-management` | Execution | Tier 3 | `linux`, `sysadmin`, `ops` | Managing Linux servers. |
| `docker-expert` | Execution | Tier 2 | `containers`, `deploy` | Dockerfile & Compose management. |
| `k8s-manifest-generator`| Planning | Tier 1 | `k8s`, `yaml`, `cluster` | Generating Kubernetes manifests. |
| `terraform-specialist` | Execution | Tier 3 | `iac`, `infra`, `cloud` | Terraform plans and applies. |
| `ssh-penetration-testing`| Audit | Tier 3 | `security`, `ssh`, `auth` | Testing SSH security. |

## 2. Web Development
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `frontend-developer` | Execution | Tier 2 | `html`, `css`, `js` | General frontend coding. |
| `react-best-practices` | Execution | Tier 2 | `react`, `components` | Modern React patterns. |
| `nextjs-app-router-patterns`| Execution | Tier 2 | `nextjs`, `fullstack` | Next.js App Router specific. |
| `api-design-principles` | Planning | Tier 1 | `api`, `rest`, `openapi` | Designing robust APIs. |
| `web-performance-optimization`| Optimization| Tier 2 | `speed`, `vitals` | Improving load times. |
| `accessibility-compliance-accessibility-audit`| Audit| Tier 1 | `a11y`, `wcag` | Checking accessibility. |

## 3. Security & Auditing
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `security-auditor` | Audit | Tier 1 | `audit`, `compliance` | General security review. |
| `vulnerability-scanner` | Audit | Tier 3 | `vuln`, `scan`, `cve` | Scanning for known vulns. |
| `penetration-testing-checklist`| Planning | Tier 1 | `pentest`, `checklist` | Planning a pentest. |
| `sql-injection-testing` | Audit | Tier 3 | `sql`, `exploit` | Testing for SQLi. |
| `xss-html-injection` | Audit | Tier 3 | `xss`, `web` | Testing for XSS. |

## 4. Agentic & General
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `writing-plans` | Planning | Tier 1 | `plan`, `process` | Structuring implementation plans. |
| `code-review-checklist` | Optimization| Tier 1 | `review`, `qa` | Code quality gates. |
| `git-pr-workflows-git-workflow`| Execution | Tier 2 | `git`, `version-control` | Managing git history. |
| `documentation-generation-doc-generate`| Output | Tier 1 | `docs`, `markdown` | Generating documentation. |
| `find-skills` | Planning | Tier 1 | `skills`, `discovery` | Helps agent discover installed skills. |

## 5. Methodology & Process (Superpowers)
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `brainstorming` | Planning | Tier 1 | `think`, `idea` | Explores intent before implementation. |
| `writing-plans` | Planning | Tier 1 | `plan`, `spec` | Creating detailed implementation plans. |
| `flash-execution-planning`| Planning | Tier 1 | `flash`, `plan`, `micro` | Creating atomic implementation plans for basic agents. |
| `executing-plans` | Execution | Tier 2 | `job`, `step` | Executing plans step-by-step. |
| `test-driven-development`| Execution | Tier 2 | `tdd`, `test` | Writing tests before code. |
| `systematic-debugging` | Execution | Tier 2 | `debug`, `fix` | Structured bug hunting. |
| `verification-before-completion`| Verification| Tier 2 | `verify`, `check` | Mandatory proof of work before finish. |

## 6. AI & Cloud Services
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `gemini-api-dev` | **UNIVERSAL**| Tier 2 | `gemini`, `ai`, `coding`| **Primary Coding Assistant & AGI Tools.** |
| `voice-ai-development`| Execution | Tier 2 | `voice`, `tts`, `stt` | Voice AI workflow development. |
| `voice-agents` | Execution | Tier 2 | `agent`, `voice` | Creating conversational voice agents. |

## 6. Professional Output & Visualization
| Skill Name | Phase | Safety Tier | Key Tags | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `pdf-official` | Output | Tier 2 | `pdf`, `report`, `design` | Generating high-quality PDFs. |
| `docx-official` | Output | Tier 2 | `word`, `office`, `doc` | Creating editable Word docs. |
| `xlsx-official` | Output | Tier 2 | `excel`, `data`, `sheet` | Complex spreadsheets & charts. |
| `pptx-official` | Output | Tier 2 | `presentation`, `slides` | Slide decks for management. |
| `mermaid-expert` | Planning/Output | Tier 1 | `diagram`, `flowchart` | Visualization & Architecture diagrams. |
| `grafana-dashboards`| Output | Tier 2 | `dashboard`, `metrics` | Visualizing live system data. |

---

## How to use:
1.  **Architect** reads this file during the **Analysis Phase**.
2.  Also checks `agent/skills/SKILL_INDEX.md` for project-specific overrides.
3.  Selects 3-5 relevant skills.
4.  **Orchestrator** loads the full `SKILL.md` from `✅ agent/skills/<skill-name>/` (Local) OR `✅ /Users/robertkispal/Library/Mobile Documents/iCloud~md~obsidian/Documents/Antygravity_memory/AI_memory/SKILLS/<skill-name>/` (Global).
