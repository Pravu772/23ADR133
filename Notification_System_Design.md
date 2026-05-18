# Stage 1

## Approach

- Fetch notifications from the provided API:
  `http://4.224.186.213/evaluation-service/notifications`
- Obtain a bearer token from the auth endpoint:
  `http://4.224.186.213/evaluation-service/auth`
- Do not store data in a database
- Do not hard-code notification values for live API fetch
- Keep the top N notifications only
- Handle new notifications naturally by fetching data each time
- If live API access is blocked, show a sample sorted output for demo

## Priority logic

- `Placement` = highest priority
- `Result` = medium priority
- `Event` = lowest priority

## Sorting order

1. Sort by priority weight
2. For equal priority, sort by timestamp descending
3. Take the top N after sorting

## Output

- The app displays unread notifications in priority order
- It shows `Type`, `Message`, and `Timestamp`
- If the API returns `401 Unauthorized`, the page still displays a sample top-N result and a warning message
- The screenshot should capture the final page output

## Logging middleware

- `logging_middleware/logger.js` is the reusable log function
- It calls `http://4.224.186.213/evaluation-service/logs`
- It authenticates using `http://4.224.186.213/evaluation-service/auth`
- It sends the required body:
  - `stack`: `backend` or `frontend`
  - `level`: `debug`, `info`, `warn`, `error`, `fatal`
  - `package`: valid values such as `route`, `service`, `handler`, `auth`, `config`, `middleware`, `utils`
  - `message`: descriptive text
- The backend uses the logger for auth flow, notification fetch results, and errors

## Repository structure

- `logging_middleware/` — middleware example for request logging and protected log API calls
- `notification_app_fe/` — frontend app with browser UI and sorting logic
- `notification_app_be/` — backend proxy for auth and notification requests
- `notification_system_design.md` — design explanation
- `.gitignore` — ignore `node_modules` and local files
