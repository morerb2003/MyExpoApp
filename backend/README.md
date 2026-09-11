# Worko Backend API Service

A modular, production-ready REST API backend built for the **Worko** cross-platform productivity and workspace mobile application.

---

## 🏗️ Architecture & Project Structure

```
Worko/
├── mobile/              # React Native / Expo Mobile App
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── env.js           # Environment variable loader & defaults
    │   │   └── db.js            # MongoDB connection & local JSON fallback
    │   ├── controllers/
    │   │   ├── taskController.js       # Task business logic & HTTP responses
    │   │   ├── noteController.js       # Note CRUD & pin toggle controller
    │   │   ├── eventController.js      # Agenda & calendar event controller
    │   │   ├── teamController.js       # Team roster & status controller
    │   │   └── workspaceController.js  # Settings & dashboard summary
    │   ├── middleware/
    │   │   ├── errorHandler.js   # Global standardized JSON error handler
    │   │   ├── notFound.js       # 404 route middleware
    │   │   └── validate.js       # Schema & field validation middleware
    │   ├── models/
    │   │   ├── Task.js           # Task data model
    │   │   ├── Note.js           # Note & category data model
    │   │   ├── Event.js          # Calendar event data model
    │   │   ├── TeamMember.js     # Team member & status model
    │   │   └── Workspace.js      # Root workspace document model
    │   ├── routes/
    │   │   ├── index.js          # Master router with /api/health
    │   │   ├── taskRoutes.js     # /api/tasks endpoints
    │   │   ├── noteRoutes.js     # /api/notes endpoints
    │   │   ├── eventRoutes.js    # /api/events endpoints
    │   │   ├── teamRoutes.js     # /api/team endpoints
    │   │   └── workspaceRoutes.js# /api/workspace endpoints
    │   ├── services/
    │   │   ├── taskService.js       # Task domain logic & filtering
    │   │   ├── noteService.js       # Note domain logic
    │   │   ├── eventService.js      # Event scheduling logic
    │   │   ├── teamService.js       # Team presence logic
    │   │   └── workspaceService.js  # Workspace persistence & initial seeds
    │   ├── utils/
    │   │   ├── apiResponse.js       # Standardized response envelopes
    │   │   └── appError.js          # Custom operational error class
    │   ├── app.js                   # Express app setup & middleware pipeline
    │   └── server.js                # Server entry point & graceful shutdown
    │
    ├── data/
    │   └── workspace.json           # Local persistent JSON datastore
    ├── .env                         # Local environment variables
    ├── .env.example                 # Template environment variables
    ├── package.json                 # Dependencies & npm scripts
    └── README.md                    # Backend documentation
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (already done by default):
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | HTTP listening port |
| `NODE_ENV` | `development` | Environment mode (`development` / `production` / `test`) |
| `CORS_ORIGIN` | `*` | Allowed origin for CORS |
| `DATA_STORE_PATH` | `./data/workspace.json` | Path to persistent local JSON datastore |
| `MONGODB_URI` | *(Optional)* | Mongo URI if connecting to a MongoDB cluster |

### 3. Start Development Server
```bash
npm run dev
```

For standard production execution:
```bash
npm start
```

---

## 📡 REST API Reference

All responses follow a standard envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Or on error:
```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

---

### 🩺 Health & Diagnostic
- `GET /` — API service overview & route index
- `GET /api/health` — Returns status (`online`), uptime, and timestamp

---

### 📋 Tasks (`/api/tasks`)
- `GET /api/tasks` — List all tasks.
  - **Query Params**: `status` (`todo`|`in-progress`|`completed`), `priority` (`low`|`medium`|`high`), `category`, `search`
- `POST /api/tasks` — Create a new task.
  - **Payload**:
    ```json
    {
      "title": "Design System Review",
      "description": "Evaluate dark mode palette tokens",
      "priority": "high",
      "category": "Design",
      "dueDate": "2026-09-15"
    }
    ```
- `GET /api/tasks/:id` — Retrieve a task by ID.
- `PUT /api/tasks/:id` — Update an existing task.
- `PATCH /api/tasks/:id/toggle` — Toggle task between `completed` and previous status (`todo`).
- `DELETE /api/tasks/:id` — Delete a task.

---

### 📝 Notes (`/api/notes`)
- `GET /api/notes` — List all notes.
  - **Query Params**: `category` (`All`|`Design`|`Engineering`|`Product`|`Meeting`), `search`, `pinned` (`true`|`false`)
- `POST /api/notes` — Create a new note.
  - **Payload**:
    ```json
    {
      "title": "Architecture Decisions",
      "content": "Using local JSON store + Mongo bridge for seamless offline/online support.",
      "category": "Engineering",
      "color": "#3B82F6",
      "isPinned": true
    }
    ```
- `GET /api/notes/:id` — Retrieve a note by ID.
- `PUT /api/notes/:id` — Update note title, content, color, or category.
- `PATCH /api/notes/:id/pin` — Toggle pinned status.
- `DELETE /api/notes/:id` — Delete a note.

---

### 📅 Calendar & Events (`/api/events`)
- `GET /api/events` — List all scheduled events.
  - **Query Params**: `date` (`YYYY-MM-DD`), `startDate`, `endDate`, `category`
- `POST /api/events` — Schedule a new event.
  - **Payload**:
    ```json
    {
      "title": "Sprint Retrospective",
      "date": "2026-09-12",
      "time": "14:00",
      "category": "Meeting"
    }
    ```
- `GET /api/events/:id` — Retrieve an event by ID.
- `PUT /api/events/:id` — Update event time, title, date, or category.
- `DELETE /api/events/:id` — Delete an event.

---

### 👥 Team (`/api/team`)
- `GET /api/team` — List all team members.
  - **Query Params**: `status` (`online`|`focus`|`away`), `search`
- `POST /api/team` — Add a new member.
  - **Payload**:
    ```json
    {
      "name": "Sarah Connor",
      "role": "Lead Architect",
      "status": "online",
      "focus": "Security hardening"
    }
    ```
- `GET /api/team/:id` — Retrieve member by ID.
- `PUT /api/team/:id` — Update member status, focus, name, or role.
- `DELETE /api/team/:id` — Remove a member.

---

### ⚙️ Workspace & Dashboard (`/api/workspace`)
- `GET /api/workspace` — Retrieve complete workspace state (tasks, notes, events, team, settings).
- `GET /api/workspace/dashboard` — Computed metrics for dashboard widgets (completion rate, active counts, today's schedule, team presence stats).
- `PUT /api/workspace/settings` — Update workspace settings (theme, focus duration, notifications).
- `POST /api/workspace/reset` — Reset workspace back to factory seed data.

---

## 🔒 Security & Middleware
- **Helmet**: Secures HTTP headers against standard vulnerabilities.
- **CORS**: Configurable cross-origin resource sharing for Expo native apps and web clients.
- **Morgan**: Detailed HTTP request logging with method, path, and duration.
- **Robust Error Handling**: Operational errors cleanly caught and formatted into JSON with appropriate HTTP status codes (400, 404, 500).
- **Graceful Shutdown**: Listens to `SIGTERM` and `SIGINT` signals to flush I/O before exit.
