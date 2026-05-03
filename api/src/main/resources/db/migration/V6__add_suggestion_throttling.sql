-- Add user relation and generated_at to suggestions
ALTER TABLE suggestions ADD COLUMN user_id UUID;
ALTER TABLE suggestions ADD COLUMN generated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE suggestions ADD CONSTRAINT fk_suggestions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_suggestion_user_generated ON suggestions(user_id, generated_at DESC);
