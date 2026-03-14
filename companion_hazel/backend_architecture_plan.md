# Hazel Companion Robot - Backend & Database Architecture Plan

## 1. Executive Summary
This document outlines the comprehensive backend and database architecture for the Hazel Companion Robot. The system bridges the gap between the Next.js frontend (dashboard), the edge AI processing (Raspberry Pi 5 & ESP32), and third-party APIs (Spotify, Google Calendar, Clerk, Gemini 1.5). The primary persistent storage will be a **PostgreSQL database hosted on Aiven**, while real-time synchronization will be handled via **Firebase / WebSockets**.

---

## 2. System Architecture & Tech Stack

### 2.1 Backend Technology Stack
*   **API Framework:** Next.js Route Handlers (`app/api/...`) for seamless integration with the existing frontend, or a standalone Node.js/Express microservice if heavy background processing is required.
*   **Database:** PostgreSQL (Hosted on Aiven) for structured, relational, and reliable data storage.
*   **ORM (Object-Relational Mapping):** Prisma ORM for type-safe database queries.
*   **Authentication:** Clerk (Already used on frontend; backend will verify Clerk JWTs).
*   **Real-time Communication:** Firebase Realtime Database and/or MQTT/WebSockets (for low-latency Pi 5 ↔ Cloud communication).
*   **File Storage:** Firebase Storage or AWS S3 (for short-lived Revision Q&A study materials).

### 2.2 Data Flow Overview
```text
[ Hazel Robot (Pi 5 + ESP32) ] 
       | (MQTT / WebSockets / REST)
       v
[ Backend API / Firebase Realtime ] <--> [ Aiven PostgreSQL (Persistent Data) ]
       ^
       | (REST / Server Actions)
[ Next.js Web Dashboard ]
```

---

## 3. Database Architecture (Aiven PostgreSQL)

Below is the proposed relational database schema for PostgreSQL.

### 3.1 `User` Table
Stores user profiles and preferences, linked to Clerk authentication.
*   `id` (UUID, Primary Key)
*   `clerk_id` (String, Unique) - Maps to Clerk user.
*   `email` (String, Unique)
*   `name` (String)
*   `weekly_study_goal` (Int) - Default: 15 sessions.
*   `is_premium` (Boolean) - To unlock premium features (detailed analytics, queue visibility).
*   `privacy_mode_enabled` (Boolean) - Tracks if Privacy Turn is active.
*   `created_at` (Timestamp)

### 3.2 `StudySession` Table
Tracks individual focus sessions.
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key)
*   `start_time` (Timestamp)
*   `end_time` (Timestamp, Nullable)
*   `scheduled_duration` (Int) - In minutes.
*   `actual_focus_time` (Int) - In minutes.
*   `phone_detection_enabled` (Boolean)
*   `focus_shield_enabled` (Boolean)
*   `break_activity` (Enum: 'GAME', 'BREATHING')
*   `created_at` (Timestamp)

### 3.3 `DistractionLog` Table
Records specific distraction events during a study session.
*   `id` (UUID, Primary Key)
*   `session_id` (UUID, Foreign Key)
*   `type` (Enum: 'PHONE', 'DROWSINESS', 'UNFOCUSED')
*   `timestamp` (Timestamp)

### 3.4 `GameSession` Table
Records game and breathing activity history.
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key)
*   `activity_type` (Enum: 'GAME', 'BREATHING')
*   `game_name` (String) - e.g., 'Guess the Word', 'Music Maze'.
*   `duration` (Int) - In seconds.
*   `score` (Int)
*   `played_at` (Timestamp)

### 3.5 `EnvironmentLog` Table
Time-series data for humidity and temperature. *Note: Older logs can be purged to save space.*
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key)
*   `temperature` (Float)
*   `humidity` (Float)
*   `recorded_at` (Timestamp)

### 3.6 `AromaConfiguration` Table
Tracks what scents are currently in the 3 hardware chambers.
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key)
*   `chamber_number` (Int) - 1, 2, or 3.
*   `scent_name` (String) - User editable.
*   `updated_at` (Timestamp)

### 3.7 `RevisionMaterial` Table
Tracks uploaded documents for the Q&A feature.
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key)
*   `file_url` (String)
*   `file_name` (String)
*   `uploaded_at` (Timestamp)
*   `expires_at` (Timestamp) - Set to 48 hours after `uploaded_at`. A cron job will delete expired files.

---

## 4. Backend Processes & API Endpoints

The backend will expose RESTful API endpoints (via Next.js `/app/api/`) for the dashboard and the hardware.

### 4.1 Study Mode APIs
*   **`POST /api/study/schedule`**: Initiates a new study session, sets the `scheduled_duration`, and toggle preferences (phone detection, focus shield).
*   **`POST /api/study/distraction`**: (Called by Pi 5). Logs a distraction into `DistractionLog`. Triggers Firebase event to update UI immediately.
*   **`PATCH /api/study/session/{id}`**: Updates session status (pause for break, resume, end). Calculates `actual_focus_time`.
*   **`GET /api/study/analytics`**: Aggregates focus hours, weekly goals, and distractions for Recharts visualization.

### 4.2 Revision Q&A APIs
*   **`POST /api/revision/upload`**: Uploads PDF/DOCX/TXT to Cloud Storage, creates a DB entry.
*   **`POST /api/revision/generate-questions`**: Calls Gemini 1.5 Flash API with the document content, returns 10 questions.
*   **`CRON /api/cron/cleanup-materials`**: A scheduled job running every hour to delete files where `expires_at` < NOW().

### 4.3 General Mode & Environment APIs
*   **`POST /api/environment/log`**: (Called by Pi 5 via ESP32) Logs current Temp/Humidity.
*   **`GET /api/environment/current`**: Fetches the latest Temp/Humidity for the circardian lighting logic and dashboard display.
*   **`PUT /api/aroma/update`**: Updates the custom names of the aroma chambers.

### 4.4 Music & Game Mode APIs
*   **`POST /api/games/log`**: Saves a completed game session (duration, score).
*   **`GET /api/games/history`**: Retrieves recently played games and total daily points.
*   **`GET /api/music/aroma-sync`**: Based on Spotify's current track genre, returns the target aroma chamber to trigger.

---

## 5. Hardware to Backend Integration Strategy

1.  **State Synchronization (Firebase):** 
    Use Firebase Realtime Database for instantaneous state changes. For example, when the Pi 5 detects a user touch to change modes, it updates a `current_mode` node in Firebase. The Next.js dashboard listens to this node and updates the UI instantly.
2.  **Persistent Sync (PostgreSQL):** 
    At the end of a session (Study, Game, Environment intervals), the Pi 5 or Next.js backend writes the aggregated data into the Aiven PostgreSQL database for long-term analytics.
3.  **Hardware API Client:** 
    The Python 3.11 script on the Pi 5 will use the `requests` library to POST data to the Next.js API endpoints, authenticated via a secure device token.

---

## 6. Third-Party Integrations Pipeline

*   **Spotify API:** 
    *   Auth flow handled on Next.js frontend (OAuth).
    *   Pi 5 utilizes Spotify Web API to get current playback state, genre, and UI queue (if premium).
*   **Google Calendar API:**
    *   Voice commands (parsed by Gemini) trigger the backend to format a standard Google Calendar Insert Event request.
    *   Backend fetches the daily schedule to read out loud.
*   **Gemini 1.5 Flash API:**
    *   Used for Chat conversational context and the Revise Q&A generation.
    *   Prompt engineering will ensure it returns JSON structures for the 10 Q&A pairs to be easily parsed by the voice generation (Edge-TTS).

## 7. Next Steps for Implementation
1.  Provision the **Aiven PostgreSQL** cluster and copy the connection string.
2.  Initialize **Prisma ORM** (`npx prisma init`) in the Next.js frontend repository.
3.  Write the Prisma schema (`schema.prisma`) mapping to the tables defined above.
4.  Generate Prisma Client and apply the schema to the database (`npx prisma db push`).
5.  Create the Next.js Route Handlers (`/app/api/...`) and secure them with Clerk Auth.
