# Master build prompt — StudyMate

Act as a senior product designer, frontend engineer, QA engineer, and competition mentor. Build a polished, responsive frontend web application named **StudyMate** for the Smart Campus & Student Life challenge.

## Problem
College students often struggle to find compatible study partners, discover peer learning groups, coordinate study times, and exchange academic strengths. Build a practical product that makes it easier to form useful study connections.

## Product promise
"Find your people. Learn together. Achieve more."

## Target users
University and college students who want to find study partners, form small study groups, and stay consistent with learning.

## Required experience
Create a premium, startup-quality interface with:
- A coherent visual system, responsive layout, accessible contrast, keyboard-friendly controls, clear hierarchy, and polished empty/loading/feedback states.
- Overview dashboard with clear product value, meaningful metrics, recommended profiles, and study circles.
- Student discovery with search by name/subject/interest, subject and year filters, and reset filters.
- Student profile details including branch, year, subjects, interests/skills, availability, location preference, and a transparent compatibility explanation.
- A compatibility score based on explainable signals such as shared subjects and overlapping availability. Never imply that a heuristic score is AI or scientifically validated.
- Save/unsave profiles with persistence.
- Study circles listing, create, join, and leave interactions.
- Personal preferences for subjects and preferred study time; changing preferences should update recommendations.
- Responsive navigation and layouts for mobile, tablet, and desktop.
- Input validation, sensible limits, confirmation/feedback, empty states, and graceful local-storage failure handling.

## Technical constraints
Use React + Vite, JavaScript, semantic HTML, and CSS. This challenge version is frontend-only. Use realistic seeded demo data and localStorage. Do not claim that demo profiles are real students or that messaging, authentication, or cross-device synchronization exists. Avoid collecting sensitive personal information. Keep components understandable for a beginner and code organized.

## Quality assurance checklist
Before calling it complete:
1. Check all navigation destinations.
2. Check search, subject filter, year filter, and reset.
3. Check that compatibility responds to subject and availability preferences.
4. Check save/unsave and persistence after refresh.
5. Check create-group required fields, length limits, join and leave actions.
6. Check empty search results and empty saved state.
7. Check mobile layout and keyboard focus.
8. Check browser console for errors and production build.
9. Fix inconsistent counts, duplicate IDs, stale state, inaccessible controls, overflow, and misleading copy.
10. Clearly document prototype limitations and the steps needed for a real multi-user product.

## Competition presentation
Prepare a short, honest demo flow: explain the problem, show discovery, explain a match, save a buddy, join/create a study circle, change preferences, and show mobile responsiveness. Emphasize practical campus value and future scope without pretending unfinished backend features are implemented.
