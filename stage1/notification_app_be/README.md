# Notification App Backend (Stage 1)

This folder holds the backend support for the Stage 1 notification application. It is intended to act as a simple server-side proxy when the frontend needs to reach the evaluation API, especially when browser CORS or authorization issues are present.

## What it does
- Proxies frontend requests to `http://4.224.186.213/evaluation-service/notifications`
- Adds authorization headers or other server-side logic if needed
- Prevents browser CORS problems by serving the request from the same origin as the frontend
- Returns clean JSON data back to the frontend app

## How to use it
1. Build a lightweight Express server.
2. Add a route such as `/notifications`.
3. Forward the incoming request to the evaluation API.
4. Return the API response as JSON to the browser.

## Why it exists
This directory is set up to support backend handling for the notification app, while the rest of the repository demonstrates the frontend application and logging middleware examples.
