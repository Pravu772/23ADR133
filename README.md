# Notification Stage 1

## What is included

- `stage1/notification_app_fe/` — Stage 1 frontend UI for the notification priority inbox
- `stage1/notification_app_be/` — Stage 1 backend proxy for auth and notification requests
- `stage1/logging_middleware/` — Stage 1 reusable log function and request logging middleware
- `stage2/` — React Stage 2 frontend application with native CSS
- `Notification_System_Design.md` — design and approach documentation
- `.gitignore` — ignore `node_modules` and local files

## How it works

- The frontend attempts to get a bearer token from the auth endpoint
- It then fetches notifications with the authorization header
- The backend logger sends protected log requests to the log API
- It sorts notifications by priority and recency
- It shows the top `N` notifications
- If live API access is blocked, it falls back to sample notification output

## Auth flow

- Auth endpoint: `http://4.224.186.213/evaluation-service/auth`
- Notifications endpoint: `http://4.224.186.213/evaluation-service/notifications`
- The backend proxy route is `http://localhost:3000/proxy/notifications`

## Notes

- The auth credentials shown in the task screenshot are used as placeholders in `notification_app_fe/app.js`
- If the actual API requires valid credentials, update the values or run the backend with environment variables

# Stage 2 React Notification Frontend

This folder contains the Stage 2 React frontend for the campus notification system. It is a small single-page app built with React and Vite, showing how notifications can be listed, filtered, and separated into a priority inbox.

## What is included
- React pages for:
  - All Notifications
  - Priority Inbox
- Filters for notification type, page size, and pagination
- Local storage tracking for new vs viewed notifications
- Responsive styling with plain CSS
- Fallback sample data when live API access is unavailable

## Run locally

1. Open a terminal in `stage2`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in a browser at:
   ```text
   http://localhost:3000
   ```

## Notes

- The app expects to run on port `3000` by default.
- It fetches live notification data from `http://4.224.186.213/evaluation-service/notifications`.
- If the live API cannot be reached, the UI uses built-in sample notifications so the interface still works.
