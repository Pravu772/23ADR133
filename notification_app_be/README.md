# notification_app_be

This folder is a placeholder for backend support if the API requires server-side proxying or authentication.

## Purpose
- Proxy requests to `http://4.224.186.213/evaluation-service/notifications`
- Add authorization headers when needed
- Avoid browser CORS or protected API issues

## Example approach
1. Create a simple Express server
2. Add `/notifications` route
3. Forward the request to the provided API
4. Return JSON to the frontend

This repository currently includes a frontend app and a logging middleware example.
