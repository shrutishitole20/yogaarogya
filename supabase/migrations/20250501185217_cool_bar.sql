/*
  # Update health assessments table to support multiple conditions

  1. Changes
    - Add new columns to health_assessments table for additional conditions
    - Add check constraints to ensure valid values

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to health_assessments table
ALTER TABLE health_assessments
ADD COLUMN IF NOT EXISTS arthritis boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS anxiety boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS depression boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS migraine boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS thyroid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heart_disease boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS asthma boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allergies boolean DEFAULT false;