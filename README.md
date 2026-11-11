# StudyMate — Study Buddy Finder

A frontend-only campus community prototype built with React + Vite. Students can discover compatible study partners, save profiles, create study circles, join groups, and personalize matching preferences.

## Run locally

1. Install **Node.js LTS** from https://nodejs.org/
2. Download and extract this project.
3. Open the extracted `studymate` folder in VS Code.
4. Open the VS Code terminal (`Terminal` → `New Terminal`).
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
npm run preview
```

The production website is generated in the `dist` folder.

## Deploy on Vercel

1. Push this project to a GitHub repository.
2. Sign in at https://vercel.com/ using GitHub.
3. Select **Add New → Project** and import your `studymate` repository.
4. Vercel should detect Vite automatically.
5. Keep the build command as `npm run build` and output directory as `dist`.
6. Select **Deploy**.

## Features

- Student discovery with text search, subject filter and year filter.
- Explainable compatibility score based on shared subjects and preferred study time.
- Save/unsave student profiles (persisted in browser local storage).
- Study circles: explore, create, join and leave.
- Personalization: update subjects and availability.
- Responsive desktop, tablet and mobile layout.
- Empty states, basic form validation and toast feedback.

## Important scope and honest limitations

This is a frontend prototype. It uses sample student profiles and browser-local storage. It does **not** provide real accounts, cross-device synchronization, real messaging, verified student identity, or a shared live database. A real campus launch would need a backend, authentication, moderation, privacy controls, and university approval. Do not enter sensitive personal information into this demo.

## Demo walkthrough for judges

1. Start on Overview and explain the campus problem.
2. Open Find buddies and search for a subject such as Mathematics.
3. Open a profile and explain the match score and shared-subject reasoning.
4. Save the profile and show Saved buddies.
5. Open Study circles, join a group, then create a new one.
6. Open My schedule and change study time or subjects; explain that recommendations update.
7. Resize the browser to show responsive design.

## Project structure

```text
studymate/
├── index.html
├── package.json
├── README.md
├── PROMPT.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
