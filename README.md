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
