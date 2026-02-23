# 🚀 n8n-nodes-keephub

<div align="center">
  <img src="https://github.com/RetailInTouch/n8n-nodes-keephub/blob/master/assets/Keephub%20Banner.png?raw=true" alt="Keephub Banner" width="50%" height="auto">
</div>



<div align="center">

[![npm version](https://img.shields.io/npm/v/n8n-nodes-keephub.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-keephub)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-keephub.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-keephub)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE.md)
[![Maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg?style=flat-square)](https://github.com/RetailInTouch/n8n-nodes-keephub)

**Seamlessly integrate Keephub with your n8n workflows** 🎯

Unlock the power of employee engagement and communication automation with this comprehensive n8n community node for Keephub.

[🔧 Installation](#-installation) • [📚 Documentation](#-operations) • [🚀 Quick Start](#-quick-start) • [📝 Changelog](#-version-history) • [🤝 Contributing](#-contributing)

</div>

---

## 📖 About

This is a professional **n8n community node** that enables you to harness the full power of **Keephub** within your workflow automation.

**Keephub** is an enterprise-grade employee engagement platform for managing:

- 👥 User management and organizational structures
- 📰 Content creation and distribution
- ✅ Task management and templates
- 📋 Dynamic form submissions and responses

**n8n** is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform that puts automation in the hands of technical and business users.

---

## 🔧 Installation

### 📦 Community Nodes Method (Recommended)

1. Open your n8n instance
2. Navigate to **Settings** ⚙️ → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-keephub`
5. Click **Install**
6. ✅ Done! The node is ready to use

### 🛠️ Manual Installation

**For Local n8n:**

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-keephub
```

**For Docker:**

```bash
docker exec -it <n8n-container> sh
cd /home/node/.n8n/nodes
npm install n8n-nodes-keephub
# Restart your container
```

**For Node.js n8n:**

```bash
npm install -g n8n-nodes-keephub
```

> [!TIP]
> Restart your n8n instance and the Keephub node will appear in your palette! 🎨

---

## 🚀 Quick Start

### 1️⃣ Set Up Credentials

Keephub supports **two separate credential types**. Choose the one that matches your setup:

**Option A — Bearer Token** (recommended for API integrations):
1. In n8n, go to **Credentials** 🔐
2. Create **New** → Search for **Keephub Bearer API**
3. Fill in:
   - **Client URL**: `https://yourcompany.keephub.io`
   - **Bearer Token**: Your API token
   - **Language** (optional): Default is `en`
4. Test & Save ✔️

**Option B — Login Credentials** (username & password):
1. In n8n, go to **Credentials** 🔐
2. Create **New** → Search for **Keephub Login API**
3. Fill in:
   - **Client URL**: `https://yourcompany.keephub.io`
   - **Login Name**: Your username
   - **Password**: Your password
   - **Auth Endpoint** (optional): Custom auth endpoint path
   - **Language** (optional): Default is `en`
4. Test & Save ✔️

### 2️⃣ Add the Node to Your Workflow

1. Click **+** to add a node
2. Search for **Keephub**
3. Select your **Authentication** method (Bearer Token or Login Credentials)
4. Select your resource and operation
5. Configure parameters
6. Run! 🏃

### 3️⃣ Example: Get User Info

```
Keephub Node Configuration:
├── Resource: User
├── Operation: Find by Login Name
└── Login Name: john.doe

Output:
{
  "id": "63bd885034d0466d11073575",
  "loginName": "john.doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com"
}
```

---

## 📚 Operations

### 👥 **User Operations**

| Operation                 | Description                              |
| ------------------------- | ---------------------------------------- |
| 🆔 **Get by ID**          | Retrieve a user by their unique ID       |
| 🔍 **Find by Login Name** | Search users by login name               |
| 👨‍💼 **Find by Group**      | Fetch all users in a specific group      |
| 🏢 **Find by Orgunit**    | Retrieve users from an organization unit |

**Example:**

```javascript
// Get all users in a group
{
  "resource": "user",
  "operation": "findByGroup",
  "groupId": "group_12345"
}
```

---

### 📰 **Content Operations**

| Operation                   | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| ✅ **Approve Content**      | Approve content that is pending approval               |
| ✨ **Create**               | Create new content (news, forms, manuals, etc.)        |
| 🗑️ **Delete**               | Remove content                                         |
| 📁 **Find by Content Pool** | Filter content by pool with optional sorting           |
| 🏷️ **Find by Group**        | Get content assigned to groups with optional sorting   |
| 🏢 **Find by Orgunit**      | Retrieve content by organization with optional sorting |
| 📖 **Get by ID**            | Retrieve specific content                              |
| ❌ **Reject Content**       | Reject content that is pending approval                |
| ✏️ **Update by ID**         | Modify existing content                                |

**Example - Create Content:**

```json
{
	"resource": "content",
	"operation": "create",
	"defineContentInput": "json",
	"contentBody": {
		"originLanguage": "en",
		"contentType": "news",
		"contentPool": "POOL_ID",
		"title": { "en": "🎉 Company Announcement" },
		"message": { "en": "<p>Great news everyone!</p>" },
		"orgchartSelection": { "include": ["root0001"], "exclude": [] }
	}
}
```

**Example - Find Content by Orgunit with Filtering:**

```json
{
	"resource": "content",
	"operation": "findByOrgunit",
	"orgunitId": "root0077",
	"options": {
		"limit": 50,
		"skip": 0,
		"sortBy": "createdAt",
		"sortOrder": 1
	}
}
```

**Content Filtering Parameters:**

- **Orgunit ID** (required): The organization unit ID

**Options** (all optional):

- **Limit**: Maximum number of results (default: 50)
- **Skip**: Number of results to skip (pagination)
- **Sort Field**: Field to sort by (e.g., `createdAt`, `updatedAt`)
- **Sort Order**: `1` for ascending, `-1` for descending

---

### ✅ **Task Template Operations**

| Operation                                  | Description                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| ✅ **Approve Task**                     | Approve a pending task, with an optional comment              |
| ➕ **Create Task Template**              | Create a new task template                                             |
| 🗑️ **Delete Task Template**              | Remove a task template                                                 |
| 📋 **Get Task**                          | Fetch a task instance by its ID                                        |
| 📋 **Get Task Template by ID**           | Retrieve a task template by its own ID                                 |
| 🔍 **Get Task Template by Task**         | Fetch the template a specific task instance was created from           |
| 🔍 **Get Task Templates by Orgunit**     | Fetch task templates by organization unit with filtering & pagination  |
| 📊 **Get Task Template Progress**        | Check task template progress                                           |
| 📈 **Get Task Template Status Counts**   | View task template completion statistics                               |
| ❌ **Reject Task**                      | Reject a pending task with a required reason                           |

**Example - Create Task with JSON Body:**

```json
{
	"resource": "task",
	"operation": "createTask",
	"defineTaskInput": "json",
	"taskJsonBody": {
		"title": { "en": "Q4 Performance Review" },
		"template": {
			"form": {
				"fields": [
					{ "name": "rating", "type": "number" },
					{ "name": "feedback", "type": "text" }
				]
			}
		}
	}
}
```

**Example - Create Task with Additional Fields:**

```json
{
	"resource": "task",
	"operation": "createTask",
	"defineTaskInput": "fields",
	"taskTitle": "Q4 Performance Review",
	"taskType": "form",
	"additionalFields": {
		"taskMessage": "Please complete your review by end of quarter.",
		"taskNotification": true
	}
}
```

**Example - Get Tasks by Orgunit with Filtering:**

```json
{
	"resource": "task",
	"operation": "getTaskByOrgunit",
	"orgunitId": "root0077",
	"options": {
		"limit": 50,
		"skip": 0,
		"sortBy": "template.dueDate",
		"sortOrder": 1,
		"startDateGte": "2025-11-01T00:00:00Z",
		"startDateLte": "2025-11-30T23:59:59Z"
	}
}
```

**Task Template Create Parameters:**

- **Task Title** (required): Name of the task template
- **Task Type** (required): `form`, `confirmation`, or `read`

**Additional Fields** (optional):

- **Message**: Custom message body for the task template
- **Send Notification**: Whether to notify assigned users (`true`/`false`)

**Task Template Get by Orgunit Parameters:**

- **Orgunit ID** (required): The organization unit ID to filter task templates

**Options** (all optional):

- **Limit**: Maximum number of results (default: 50)
- **Skip**: Number of results to skip (pagination)
- **Sort Field**: Field to sort by (e.g., `template.dueDate`)
- **Sort Order**: `1` for ascending, `-1` for descending
- **Start Date After**: Filter tasks after this date
- **Start Date Before**: Filter tasks before this date

---

### 📋 **Form Submission Operations**

| Operation                          | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| 🔍 **Find by Form**               | Retrieve all submissions for a form with filtering |
| 📥 **Get**                         | Fetch complete form submission data               |
| 👤 **Get Submitter Details**       | Retrieve full user profile of submitter           |
| 🏢 **Get Submission Orgunits**     | View orgunit hierarchy                            |
| 📍 **Update Submission Orgunits**  | Change visibility by orgunit                      |
| ⏱️ **Calculate Response Duration** | Time from creation to submission                  |

**Example - Find Submissions by Form:**

```json
{
	"resource": "formSubmission",
	"operation": "findByForm",
	"contentRef": "699848533ab62d9d50409890",
	"options": {
		"limit": 50,
		"skip": 0,
		"sortBy": "updatedAt",
		"sortOrder": -1
	}
}
```

**Find by Form Parameters:**

- **Form Content ID** (required): The content ID of the form (24-character MongoDB ObjectID)

**Options** (all optional):

- **Limit**: Maximum number of results (default: 50)
- **Skip**: Number of results to skip (pagination)
- **Sort Field**: Field to sort by (default: `updatedAt`)
- **Sort Order**: `-1` for descending (newest first), `1` for ascending

**Example - Calculate Response Time:**

```javascript
{
  "resource": "formSubmission",
  "operation": "calculateResponseDuration",
  "formSubmissionId": "form_67890"
}

// Returns:
{
  "duration": {
    "days": 2,
    "hours": 5,
    "minutes": 30,
    "totalSeconds": 183930
  }
}
```

---

### 🏢 **Orgchart Operations**

| Operation                   | Description                                        |
| --------------------------- | -------------------------------------------------- |
| 🌳 **Get Ancestors**        | Get all ancestors in the org hierarchy             |
| 🔗 **Get by External Ref**  | Retrieve an orgchart node by its externalRef value |
| 🆔 **Get by ID**            | Retrieve an orgchart node by ID                    |
| 👶 **Get Children**         | Retrieve all children/descendants                  |
| ⬆️ **Get Parent**            | Fetch the parent node of an orgchart node          |

**Example - Get Children with Depth Limit:**

```json
{
	"resource": "orgchart",
	"operation": "getChildren",
	"orgunitId": "node123",
	"additionalFields": {
		"limit": 100
	}
}
```

**Example - Get Ancestors with Depth Limit:**

```json
{
	"resource": "orgchart",
	"operation": "getAncestors",
	"orgunitId": "node123",
	"additionalFields": {
		"depthLimit": 3
	}
}
```

**Optional Additional Fields:**

- **Get Children** → `limit`: Maximum number of child nodes to return (default: 0 = unlimited)
- **Get Ancestors** → `depthLimit`: How many levels up to traverse (default: 0 = unlimited)

---

### 🗄️ **Storage Operations**

| Operation           | Description                                               |
| ------------------- | --------------------------------------------------------- |
| 🔗 **Get Signed URL** | Generate a pre-signed URL for secure access to a stored file |

**Use case:** Retrieve a signed CloudFront URL for a file attached to a task, form answer, or content item, then pass it directly to an AI vision model for analysis.

**Required fields:**

| Field | Description |
| ----- | ----------- |
| **Origin** | The entity type that owns the file (e.g. `Task Form Answer`, `Content Attachment`) |
| **Origin ID** | The `_id` of the owning entity — use `{{ $json._id }}` from a preceding Keephub node |
| **Storage ID** | The S3 path of the file — use `{{ $json.answers[N].value.value }}` for upload form answers |
| **Force Download** | Optional. Sets `Content-Disposition: attachment` to force a file download instead of inline display |

**Example:**

```json
{
	"resource": "storage",
	"operation": "getSignedUrl",
	"origin": "taskFormAnswer",
	"originId": "699974e8f6c386b2e3e93cbc",
	"storageId": "live/image/dev/contents/abc123/photo.jpg"
}
```

**Output:**

```json
{
	"url": "https://d2qp115j4w1ptn.cloudfront.net/live/image/...?Expires=...&Signature=..."
}
```

> ⚠️ The returned URL is time-limited and contains embedded credentials. Treat it as a secret and use it immediately in your workflow — do not log or store it.

---

## 🔐 Credentials Setup

Keephub uses **two separate credential types** — select the matching authentication method from the **Authentication** dropdown on the Keephub node.

### 🔑 Keephub Bearer API

```
✓ Most secure for API integrations
✓ Use existing API tokens from Keephub
✓ Perfect for server-to-server communication
✓ Uses IAuthenticateGeneric — token sent automatically in headers
```

| Field          | Description                          |
| -------------- | ------------------------------------ |
| **Client URL** | Your Keephub instance base URL       |
| **Bearer Token** | API bearer token                   |
| **Language**   | Language code (default: `en`)        |

### 🔒 Keephub Login API

```
✓ Automatic token generation from username/password
✓ Simple to set up
✓ Token refreshed dynamically per request
✓ Credentials securely stored and encrypted in n8n
```

| Field              | Description                                     |
| ------------------ | ----------------------------------------------- |
| **Client URL**     | Your Keephub instance base URL                  |
| **Login Name**     | Username for authentication                     |
| **Password**       | Password for authentication                     |
| **Auth Endpoint**  | Custom auth path (default: `/authentication`)   |
| **Language**       | Language code (default: `en`)                   |

**All credentials are encrypted** 🔒 and never exposed in logs or workflows.

---

## 💡 Real-World Examples

### 📧 Example 1: Auto-Create Tasks from Email

```
Gmail Trigger
  ↓
Extract email data
  ↓
Keephub: Create Task
  ↓
Send confirmation email
```

### 📊 Example 2: Sync Users to Slack

```
Keephub: Get all users in a group
  ↓
Filter active users
  ↓
Slack: Create channels per active users in group
```

### 📋 Example 3: Form Response Automation

```
Schedule Trigger (daily)
  ↓
Keephub: Get Form Submission
  ↓
Keephub: Get Submitter Details
  ↓
Keephub: Calculate Response Duration
  ↓
Store in database
```

---

## ⚙️ Node Configuration

### Authentication

The Keephub node provides an **Authentication** dropdown at the top of the configuration panel:

- **Bearer Token** → uses the **Keephub Bearer API** credential
- **Login Credentials** → uses the **Keephub Login API** credential

### Input Data

- All parameters support dynamic expressions with `{{ }}`
- Use previous node outputs: `{{ $node["Previous Node"].json.field }}`
- Access environment variables: `{{ $env.MY_VAR }}`

### Output Format

```javascript
{
  "pairedItem": { "item": 0 },
  "json": {
    // API response data
  }
}
```

### Error Handling

Enable "Continue on Error" to handle failures gracefully in your workflow.

---

## 📦 Requirements

| Requirement | Version  |
| ----------- | -------- |
| **n8n**     | v1.0.0+  |
| **Node.js** | 18.17.0+ |
| **npm**     | 8.0.0+   |

---

## 🐛 Troubleshooting

### ❌ "Authentication failed"

- ✅ Verify your Keephub instance URL
- ✅ Check API credentials are correct
- ✅ Ensure credentials have required permissions

### ❌ "Unknown operation"

- ✅ Verify resource and operation combination exist
- ✅ Check node version is latest
- ✅ Try refreshing the node palette

### ❌ "Connection timeout"

- ✅ Check network connectivity
- ✅ Verify firewall allows outbound HTTPS
- ✅ Check Keephub instance is accessible

---

## 📚 Documentation

- 📖 [n8n Documentation](https://docs.n8n.io/)
- 🔗 [Keephub API Docs](https://dev.api.keephub.io/api-docs/)
- 💬 [n8n Community Forum](https://community.n8n.io/)

---

## 🏗️ Project Structure

```
n8n-nodes-keephub/
├── nodes/
│   └── Keephub/
│       ├── Keephub.node.ts           # Main node class
│       ├── descriptions/             # Field definitions
│       │   ├── UserDescription.ts
│       │   ├── ContentDescription.ts
│       │   ├── TaskDescription.ts
│       │   ├── FormSubmissionDescription.ts
│       │   ├── OrgchartDescription.ts
│       │   └── StorageDescription.ts
│       ├── actions/                  # Operation implementations
│       │   ├── user/
│       │   ├── content/
│       │   ├── task/
│       │   ├── formSubmission/
│       │   ├── orgchart/
│       │   └── storage/
│       └── utils/
│           └── helpers.ts
├── credentials/
│   ├── KeephubBearerApi.credentials.ts
│   └── KeephubLoginApi.credentials.ts
├── package.json
└── README.md
```

---

## 🚀 Development

### Build

```bash
npm run build
```

### Verify (lint + build)

```bash
npm run test
```

### Lint

```bash
npm run lint
```

---

## 📝 Version History

### v1.0.0 (2025-01-09) 🎉

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
- 🔐 Improved credential test behavior for both auth methods:
	- Bearer credential test now handles both client URL and API subdomain URL formats (strips `.api.` for compatibility)
	- Login credential test now performs real auth validation via `POST` to the configured auth endpoint (uses string manipulation compatible with n8n's expression sandbox)
	- Both use protocol normalization to handle URLs without `https://` prefix
- 🧩 Renamed Login credential field from **Token Endpoint** to **Auth Endpoint** for clarity (runtime keeps backward compatibility with legacy `tokenEndpoint`)
- 📚 Fixed metadata/docs pointers:
	- Updated node credential documentation anchor link
	- Fixed README MIT badge link target
	- Updated clientUrl field descriptions to clarify "Do not use the API URL"
- 📦 Added `prepublishOnly` guard (`npm run test`) and aligned package Node engine requirement to `>=18.17.0`
- 🔗 Enhanced URL transformation robustness:
	- Client URL now auto-normalizes `.api.` subdomain (handles both formats transparently)
	- Protocol normalization adds `https://` if missing

### v1.5.0 (2026-02-20) 📋

- 🔍 Added **Find by Form** operation to Form Submission resource — retrieve all submissions for a given form with pagination & sorting
- 📦 Supports Limit, Skip, Sort Field, Sort Order options (consistent with Content and Task list operations)
- 🔗 Uses `$sort[_id]=1` tiebreaker for stable pagination across pages

### v1.6.0 (2026-02-22)

- ✅ Added **Approve Task** operation — approve a pending task with an optional comment
- ❌ Added **Reject Task** operation — reject a pending task with a required reason
- ✅ Added **Approve Content** operation — approve content pending approval
- ❌ Added **Reject Content** operation — reject content pending approval

### v1.8.0 (2026-02-23)

- 🗄️ Added **Storage** resource with **Get Signed URL** operation — generates pre-signed CloudFront URLs for secure file access from tasks, form answers, and content
- Supports all 11 origin types with inline field hints for common expressions; optional Force Download flag
- 🏷️ Renamed **Task** resource display label to **Task Template** for clarity across all template-managing operations (Create, Delete, Get by ID, Get by Orgunit, Get Progress, Get Status Counts)
- **Approve Task** and **Reject Task** intentionally kept as-is — they operate on task instances, not templates; no breaking changes
- 🔍 Added **Get Task Template by Task** operation — resolves a task template from a task instance ID via `/tasks/{id}` → `/tasktemplates/{templateRef}`
- 📋 Added **Get Task** operation — fetches a task instance directly by its ID from `/tasks/{id}`

### v1.8.1 (2026-02-23)

- 🐛 Fixed missing `description` property on six Task Template operations (Create, Delete, Get by ID, Progress, Status Counts, By Orgunit) — these were not visible on the [n8n integrations page](https://n8n.io/integrations/keephub/)

---

## 🤝 Contributing

Contributions are welcome! 🙌

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
git clone https://github.com/RetailInTouch/n8n-nodes-keephub.git
cd n8n-nodes-keephub
npm install
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE.md) file for details.

---

## 🙏 Support

Found a bug? Have a feature request?

- 🐛 [Open an Issue](https://github.com/RetailInTouch/n8n-nodes-keephub/issues)
- 💬 [Start a Discussion](https://github.com/RetailInTouch/n8n-nodes-keephub/discussions)

---

## ⭐ Show Your Support

If you find this node useful, please consider:

- ⭐ Starring this repository
- 🐦 Sharing it on social media
- 📢 Recommending it to the community

---

<div align="center">

**Made with ❤️ for the automation community**

[Visit n8n](https://n8n.io) • [View on npm](https://www.npmjs.com/package/n8n-nodes-keephub) • [GitHub Repo](https://github.com/RetailInTouch/n8n-nodes-keephub)

</div>
