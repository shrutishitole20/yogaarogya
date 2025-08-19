/*
  # Initial Schema Setup for YOGAAROGYA

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - references auth.users
      - `created_at` (timestamptz, default now())
      - `name` (text, not null)
      - `age` (integer)
      - `city` (text)
      - `previous_yoga_experience` (boolean, default false)
      - `experience_years` (integer)
      - `goals` (text)
      - `health_conditions` (text array)

    - `health_assessments` 
      - `id` (uuid, primary key)
      - `created_at` (timestamptz, default now())
      - `user_id` (uuid, references profiles.id)
      - plus columns for each health condition (boolean)

    - `feedback`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz, default now())
      - `user_id` (uuid, references profiles.id)
      - `rating` (integer, 1-5)
      - `is_user_friendly` (boolean)
      - `suggestions` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  age integer,
  city text,
  previous_yoga_experience boolean DEFAULT false,
  experience_years integer,
  goals text,
  health_conditions text[]
);

-- Health Assessments Table
CREATE TABLE IF NOT EXISTS health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  back_pain boolean DEFAULT false,
  neck_pain boolean DEFAULT false,
  stress boolean DEFAULT false,
  insomnia boolean DEFAULT false,
  digestive_issues boolean DEFAULT false,
  joint_pain boolean DEFAULT false,
  high_blood_pressure boolean DEFAULT false,
  obesity boolean DEFAULT false,
  respiratory_issues boolean DEFAULT false,
  diabetes boolean DEFAULT false,
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  is_user_friendly boolean NOT NULL,
  suggestions text
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create Security Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Health assessments policies
CREATE POLICY "Users can view their own health assessments"
  ON health_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own health assessments"
  ON health_assessments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health assessments"
  ON health_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view their own feedback"
  ON feedback
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON feedback
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can read all profiles (for user count)
CREATE POLICY "Allow public profiles count"
  ON profiles
  FOR SELECT
  TO PUBLIC
  USING (true);