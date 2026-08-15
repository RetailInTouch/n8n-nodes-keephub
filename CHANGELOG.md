## 📝 Version History

### v1.9.0 (2026-08-15)

- 🔔 Added **Send Task Reminder** operation — reminds everyone who still has a task template open, via `PUT /tasktemplates/{id}?_id={id}&action=reminder`
- Optional **Verify Reminder Was Sent** (on by default) reads the template back and returns `lastReminderAt`, so a reminder that did not land shows as `verified: false` instead of silent success
- 🐛 **Get Task Template Progress** and **Get Task Template Status Counts** now request `?management=true` — without it the API can return `progress` as one entry per orgunit, with the counts nested under `directTaskStatusCount`/`zoiTaskStatusCount`, and every field these operations read came back `undefined`
- ⚙️ **Get Task Template by ID** gained a **Management View** option — adds `lastReminderAt` and `canEdit`, and returns progress as a single aggregated entry. Off by default, so existing workflows see no change

### v1.8.1 (2026-02-23)

- 🐛 Fixed missing `description` property on six Task Template operations (Create, Delete, Get by ID, Progress, Status Counts, By Orgunit) — these were not visible on the [n8n integrations page](https://n8n.io/integrations/keephub/)

### v1.8.0 (2026-02-23)

- 🗄️ Added **Storage** resource with **Get Signed URL** operation — generates pre-signed CloudFront URLs for secure file access from tasks, form answers, and content
- Supports all 11 origin types with inline field hints; optional Force Download flag to set `Content-Disposition: attachment`
- 🏷️ Renamed **Task** resource display label to **Task Template** for clarity across all template-managing operations
- **Approve Task** and **Reject Task** intentionally kept as-is — no breaking changes
- 🔍 Added **Get Task Template by Task** operation — resolves a task template from a task instance ID via `/tasks/{id}` → `/tasktemplates/{templateRef}`
- 📋 Added **Get Task** operation — fetches a task instance directly by its ID from `/tasks/{id}`

 (2025-01-09) 🎉

- ✨ Initial release
- 👥 User management operations
- 📰 Content creation & management
- ✅ Task template operations
- 📋 Form submission handling
- 🔐 Secure API authentication

### v1.1.0 (2025-11-10) 📦

- 📊 Added Orgchart operations (Get, Parent, Ancestors, Children)
- 🧹 Fixed console.log in updateById operation
- 🔧 Code cleanup and optimizations

### v1.2.0 (2025-11-12) 🆕

- 🔍 Added Get By Orgunit task operation
- 📅 Date range filtering support for tasks (Start Date Before/After)
- 📰 Enhanced Content filtering

### v1.2.1 (2025-11-20)

- 📖 README updates and documentation improvements

### v1.2.2 (2025-11-20)

- 🧹 Build process improvements (added dist folder cleanup script)

### v1.3.0 (2025-12-04)

- 🔍 Added Get by External Ref operation to Orgchart resource for querying nodes by external reference

### v1.3.4 (2025-12-08)

- 🔧 Added externalRef of orgunit to the output of the Get submission orgunits node
- 🧹 Fixed typo that was causing README rendering issues

### v1.4.0 (2026-02-09) 🔐

- 🔑 **Split credentials** into two separate types: **Keephub Bearer API** and **Keephub Login API**
- 🛡️ Added `IAuthenticateGeneric` to Bearer credential for automatic header injection
- 🔀 Added **Authentication** selector dropdown to the node UI (Bearer Token / Login Credentials)
- 🔌 Updated `inputs`/`outputs` to use `NodeConnectionTypes.Main` (n8n best practice)
- 📦 Moved non-required fields into **Additional Fields** / **Options** collections:
  - Content: Limit, Skip, Sort Field, Sort Order → Options
  - Orgchart: Depth Limit, Result Limit → Additional Fields
  - Task: Message, Send Notification → Additional Fields; Limit → Options
- 🧹 Updated helpers to dynamically resolve credentials based on authentication selector
- 📖 Updated README documentation to reflect all changes

### v1.4.3 (2026-02-19)

- 🖼️ Changed Image assets to better match n8n's dark theme

### v1.4.4 (2026-02-19)

- 🐛 Empty content/task searches now return `[]` instead of throwing error (`findByContentPool`, `findByGroup`, `findByOrgunit`, `task/getByOrgunit`)
- 🐛 Orgchart node IDs now properly URL-encoded (`getById`, `getParent`, `getAncestors`)
- 🐛 Added null check for submitter ID in form submissions (`getSubmitterDetails`)
- 🐛 Fixed double indentation in content delete operation
- 🐛 Fixed paginated response unwrapping in user `findByLoginName`, `findByGroup`, `findByOrgunit` — now correctly returns individual user items instead of the raw envelope
- 📋 Added codex metadata with expanded aliases for better node discoverability
- 🔍 Expanded package keywords from 4 to 19 for better discoverability
- 🖼️ Optimized icon SVG viewBox to show full logo without cutoff
- 🖼️ Restored white ellipse border for visibility in dark mode
- 🔐 Improved credential test behavior for both auth methods
- 🧩 Renamed Login credential field from **Token Endpoint** to **Auth Endpoint** for clarity
- 📦 Added `prepublishOnly` guard (`npm run test`) and aligned package Node engine requirement to `>=18.17.0`
- 🔗 Enhanced URL transformation robustness

### v1.5.0 (2026-02-20) 📋

- 🔍 Added **Find by Form** operation to Form Submission resource — retrieve all submissions for a given form with pagination & sorting
- 📦 Supports Limit, Skip, Sort Field, Sort Order options (consistent with Content and Task list operations)
- 🔗 Uses `$sort[_id]=1` tiebreaker for stable pagination across pages

### v1.6.0 (2026-02-22)

- ✅ Added **Approve Task** operation to Task resource — approve a pending task via the `/workflow` endpoint
- ❌ Added **Reject Task** operation to Task resource — reject a pending task with a required reason via the `/workflow` endpoint
- ✅ Added **Approve Content** operation to Content resource — approve content pending approval via the `/workflow` endpoint
- ❌ Added **Reject Content** operation to Content resource — reject content pending approval via the `/workflow` endpoint
