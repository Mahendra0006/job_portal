# Job Portal MVC

A responsive job portal built with Node.js, Express, EJS, and Bootstrap, following the MVC pattern.

## Features

- Recruiter registration/login/logout with session management
- Job CRUD (create, read, update, delete) for recruiters
- Job search, filter, and pagination
- Job application with resume (PDF) upload and email confirmation
- Recruiter-only applicant management with pagination
- Resource-based authorization (only job owner can edit/delete)
- Last visit tracking via cookies
- Responsive Bootstrap UI
- Common validation middleware for forms
- Confirmation dialogs for destructive actions

## Setup

1. Clone/download this repo.
2. Install dependencies: `npm install`
3. Set up your `.env` file (see above).
4. Run the app: `npm start`
5. Visit [http://localhost:3000](http://localhost:3000)

## Structure

- `/controllers`: Business logic
- `/models`: In-memory data models
- `/routes`: Express routes
- `/middlewares`: Auth, validation, file upload
- `/views`: EJS templates
- `/public`: Static files (CSS, JS, uploads)