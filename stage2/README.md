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
