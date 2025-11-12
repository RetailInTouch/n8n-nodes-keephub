# 🚀 n8n-nodes-keephub

<div align="center">

[![npm version](https://img.shields.io/npm/v/n8n-nodes-keephub.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-keephub)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-keephub.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-keephub)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg?style=flat-square)](https://github.com/RetailInTouch/n8n-nodes-keephub)

**Seamlessly integrate Keephub with your n8n workflows** 🎯

Unlock the power of employee engagement and communication automation with this comprehensive n8n community node for Keephub.

[🔧 Installation](#-installation) • [📚 Documentation](#-operations) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](#-contributing)

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

## To publish the package to our self-hosted n8n:
```npm install
npm run build
tar -C dist -czf n8n-custom-node.tar.gz nodes credentials icons
aws s3 cp n8n-custom-node.tar.gz s3://vnext-public-content/n8n/n8n-custom-node.tar.gz --acl public-read
```
After this, you need to restart the pod.

<!-- ### 📦 Community Nodes Method (Recommended)

1. Open your n8n instance
2. Navigate to **Settings** ⚙️ → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-keephub`
5. Click **Install**
6. ✅ Done! The node is ready to use -->

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

1. In n8n, go to **Credentials** 🔐
2. Create **New** → Search for **Keephub API**
3. Fill in your credentials:
   - **Client URL**: https://yourcompany.keephub.io
   - **Auth Type**: Choose Bearer Token or Username/Password
   - **Language** (optional): Default is `en`
4. Test & Save ✔️

### 2️⃣ Add the Node to Your Workflow

1. Click **+** to add a node
2. Search for **Keephub**
3. Select your resource and operation
4. Configure parameters
5. Run! 🏃

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

| Operation | Description |
|-----------|-------------|
| 🆔 **Get by ID** | Retrieve a user by their unique ID |
| 🔍 **Find by Login Name** | Search users by login name |
| 👨‍💼 **Find by Group** | Fetch all users in a specific group |
| 🏢 **Find by Orgunit** | Retrieve users from an organization unit |

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

| Operation | Description |
|-----------|-------------|
| ✨ **Create** | Create new content (news, announcements, etc.) |
| 🗑️ **Delete** | Remove content |
| 📁 **Find by Content Pool** | Filter content by pool with optional sorting |
| 🏷️ **Find by Group** | Get content assigned to groups with optional sorting |
| 🏢 **Find by Orgunit** | Retrieve content by organization with optional sorting |
| 📖 **Get by ID** | Retrieve specific content |
| ✏️ **Update by ID** | Modify existing content |

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
  "limit": 50,
  "options": {
    "skip": 0,
    "sortBy": "createdAt",
    "sortOrder": 1
  }
}
```
Content Filtering Parameters:

Limit (optional, default: 50): Maximum number of results to return

Options:

Skip: Number of results to skip (pagination)

Sort Field: Field to sort by (e.g., createdAt, updatedAt)

Sort Order: 1 for ascending, -1 for descending

---

### ✅ **Task Operations**

| Operation | Description |
|-----------|-------------|
| ➕ **Create** | Create a new task template |
| 🗑️ **Delete** | Remove a task template |
| 📋 **Get by ID** | Retrieve a task template |
| 🔍 **Get By Orgunit**	| Fetch tasks by organization unit with filtering & pagination |
| 📊 **Get Status** | Check task template status |
| 📈 **Get Status Counts** | View task completion statistics |

**Example:**
```javascript
{
  "resource": "task",
  "operation": "create",
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
**Example - Get Tasks by Orgunit with Filtering:**
```json
{
  "resource": "task",
  "operation": "getTaskByOrgunit",
  "orgunitId": "root0077",
  "limit": 50,
  "options": {
    "skip": 0,
    "sortBy": "template.dueDate",
    "sortOrder": 1,
    "startDateGte": "2025-11-01T00:00:00Z",
    "startDateLte": "2025-11-30T23:59:59Z"
  }
}
```
Parameters:

Orgunit ID (required): The organization unit ID to filter tasks

Limit (optional, default: 50): Maximum number of results to return

Options:

Skip: Number of results to skip (pagination)

Sort Field: Field to sort by (e.g., template.dueDate)

Sort Order: 1 for ascending, -1 for descending

Start Date After: Filter tasks created/updated after this date (dateTime picker)

Start Date Before: Filter tasks created/updated before this date (dateTime picker)

---

### 📋 **Form Submission Operations**

| Operation | Description |
|-----------|-------------|
| 📥 **Get** | Fetch complete form submission data |
| 👤 **Get Submitter Details** | Retrieve full user profile of submitter |
| 🏢 **Get Submission Orgunits** | View orgunit hierarchy |
| 📍 **Update Submission Orgunits** | Change visibility by orgunit |
| ⏱️ **Calculate Response Duration** | Time from creation to submission |

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

### Orgchart Operations

| Operation | Description |
|-----------|-------------|
| **Get by ID** | Retrieve an orgchart node by ID |
| **Get Parent** | Fetch the parent node of an orgchart node |
| **Get Ancestors** | Get all ancestors in the org hierarchy |
| **Get Children** | Retrieve all children/descendants |

**Example:**
```javascript
{
  resource: "orgchart",
operation: "getChildren",
nodeId: "node123"
}
```

---


## 🔐 Credentials Setup

### Bearer Token Authentication
```
✓ Most secure for API integrations
✓ Use existing API tokens from Keephub
✓ Perfect for server-to-server communication
```

### Username/Password Authentication
```
✓ Automatic token generation
✓ Simple to set up
✓ Credentials securely stored in n8n
```

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
Slack: Create channels per user
```

### 📋 Example 3: Form Response Automation

```
Keephub: Form Submission Trigger
  ↓
Get submitter details
  ↓
Calculate response time
  ↓
Store in database
  ↓
Send thank you message
```

---

## ⚙️ Node Configuration

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

| Requirement | Version |
|-----------|---------|
| **n8n** | v0.199.0+ |
| **Node.js** | 14.20.0+ |
| **npm** | 6.0.0+ |

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
│       │   └── OrgchartDescription.ts
│       ├── actions/                  # Operation implementations
│       │   ├── user/
│       │   ├── content/
│       │   ├── task/
│       │   ├── formSubmission/
│       │   └── orgchart/
│       └── utils/
│           └── helpers.ts
├── credentials/
│   └── KeephubApi.credentials.ts
├── package.json
└── README.md
```

---

## 🚀 Development

### Build
```bash
npm run build
```

### Test
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
- v1.1.0 (2025-11-10) 📦
  - 📊 Added Orgchart operations (Get, Parent, Ancestors, Children)
  - 🧹 Fixed console.log in updateById operation
  - 🔧 Code cleanup and optimizations
- v1.2.0 (2025-11-12) 🆕
  - 🔍 Added Get By Orgunit task operation
  - 📅 Date range filtering support for tasks (Start Date Before/After)
  - 📰 Enhanced Content filtering:

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

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Support

Found a bug? Have a feature request? 

- 🐛 [Open an Issue](https://github.com/RetailInTouch/n8n-nodes-keephub/issues)
- 💬 [Start a Discussion](https://github.com/RetailInTouch/n8n-nodes-keephub/discussions)
- 
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