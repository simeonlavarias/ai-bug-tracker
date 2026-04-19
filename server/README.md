# AI Bug Tracker & Edge Case Explorer

A full-stack quality assurance tool for documenting AI failures, categorizing issues, tracking edge cases, and analyzing patterns in AI behaviour.

Built as a portfolio project demonstrating full-stack development, REST API design, and software testing workflows.

---

## What It Does

When testing AI systems, engineers need a structured way to record problematic responses. This tool acts like a bug tracker — but specifically designed for AI failures.

**Example scenario:**
- Prompt: "Who invented the telephone?"
- AI Response: "Thomas Edison invented it in 1850."
- Tester logs: Bug Type = Incorrect Facts, Severity = High

The system stores the record and updates analytics automatically.

---

## Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | HTML, CSS, JavaScript                                   |
| Backend  | Node.js + Express                                       |
| Data     | In-memory array (easily replaceable with a database)   |
| API Style| REST                                                    |

---

## Project Structure

```
AI Failure Analysis Dashboard/
  client/
    index.html       <- Main UI
    style.css        <- All styles
    app.js           <- Frontend logic + API calls
  server/
    src/
      app.js         <- Express server entry point
      routes.js      <- API route definitions
      data.js        <- In-memory data store + seed data
    .env             <- Environment variables
    package.json
  README.md
```

---

## Features

- **Log Test Cases** — Record AI failures with prompt, response, bug type, severity, edge case tags and rating
- **Test Case History** — Browse all logged cases in a table
- **Search & Filter** — Filter by bug type, severity and category. Search across prompts, responses and notes
- **Detail View** — Click any row to see full case details
- **Analytics Dashboard** — Live stats showing total tests, failure rate, most common bug type and category
- **Seed Data** — 8 pre-loaded test cases so the dashboard is populated on first launch

---

## API Endpoints

| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| GET    | /api/testcases     | Get all test cases      |
| GET    | /api/testcases/:id | Get one test case by ID |
| POST   | /api/testcases     | Create a new test case  |
| GET    | /api/stats         | Get analytics summary   |

---

## Getting Started

### Prerequisites

Make sure you have Node.js installed:
https://nodejs.org

### Installation

1. Clone or download this repository

2. Install backend dependencies:

```
cd server
npm install
```

### Running the App

**Step 1: Start the backend server**

```
cd server
node src/app.js
```

You should see:
```
Server running on http://localhost:3001
API available at http://localhost:3001/api/testcases
```

**Step 2: Open the frontend**

Open client/index.html in your browser by double-clicking it, or drag it into Chrome/Edge.

> Important: The frontend requires the backend to be running. Always start the server before opening the HTML file.

---

## Data Model

Each test case follows this structure:

```
{
  id: "uuid",
  createdAt: "ISO date string",
  prompt: "The input given to the AI",
  response: "The AI's problematic response",
  category: "Knowledge Query | Code Generation | ...",
  bugType: "Hallucination | Incorrect Facts | ...",
  severity: "Low | Medium | High | Critical",
  edgeCaseTags: ["Adversarial Prompt", "Sensitive Topic"],
  notes: "Tester observations",
  rating: "Correct | Partially Correct | Incorrect"
}
```

---

## Architecture Decisions

**Why plain HTML/CSS/JS for the frontend?**
Keeps the project accessible and easy to run without any build tools or compilation steps. Any browser can open it instantly.

**Why Node.js + Express for the backend?**
Demonstrates understanding of REST API design, HTTP methods, request/response handling, middleware, and separation of concerns between routes, data, and server logic.

**Why in-memory storage?**
Keeps the project simple and portable. The data layer in server/src/data.js is intentionally isolated so it can be swapped for a real database like PostgreSQL or MongoDB by only changing that one file.

**Why separate frontend and backend?**
Mirrors how real production applications are structured. The frontend only handles display logic. The backend handles all data operations. They communicate through a REST API.

---

## Possible Extensions

- Add a database (MongoDB or PostgreSQL)
- Add user authentication
- Add export to CSV functionality
- Add chart visualizations for analytics
- Deploy backend to Railway or Render
- Deploy frontend to Netlify or Vercel

---

## Author

Built by [Your Name]
Portfolio project for Junior Software Engineer — AI Quality & Testing roles