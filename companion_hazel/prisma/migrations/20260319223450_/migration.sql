-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "weekly_study_goal" INTEGER NOT NULL DEFAULT 15,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "privacy_mode_enabled" BOOLEAN NOT NULL DEFAULT false,
    "spotify_refresh_token" TEXT,
    "google_refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Robot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Robot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "scheduled_duration" INTEGER NOT NULL,
    "actual_focus_time" INTEGER,
    "focus_goal" TEXT,
    "phone_detection_enabled" BOOLEAN NOT NULL DEFAULT false,
    "focus_shield_enabled" BOOLEAN NOT NULL DEFAULT false,
    "break_activity" TEXT,
    "break_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistractionLog" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistractionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentLog" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AromaConfiguration" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "chamber_number" INTEGER NOT NULL,
    "scent_name" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 75,
    "color_hex" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AromaConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT,
    "type" TEXT NOT NULL,
    "google_event_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenreMapping" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "genre_name" TEXT NOT NULL,
    "scent_name" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 100,
    "color_gradient" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicGenreMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "game_name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "score" INTEGER,
    "result" TEXT,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionMaterial" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "content" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevisionMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionQuestion" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "RevisionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreathingExercise" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "duration_secs" INTEGER NOT NULL,

    CONSTRAINT "BreathingExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeUsageLog" (
    "id" TEXT NOT NULL,
    "robot_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "ModeUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Robot_secret_key_key" ON "Robot"("secret_key");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenreMapping_robot_id_genre_name_key" ON "MusicGenreMapping"("robot_id", "genre_name");

-- AddForeignKey
ALTER TABLE "Robot" ADD CONSTRAINT "Robot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistractionLog" ADD CONSTRAINT "DistractionLog_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "StudySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentLog" ADD CONSTRAINT "EnvironmentLog_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AromaConfiguration" ADD CONSTRAINT "AromaConfiguration_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicGenreMapping" ADD CONSTRAINT "MusicGenreMapping_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionQuestion" ADD CONSTRAINT "RevisionQuestion_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "RevisionMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeUsageLog" ADD CONSTRAINT "ModeUsageLog_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "Robot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
