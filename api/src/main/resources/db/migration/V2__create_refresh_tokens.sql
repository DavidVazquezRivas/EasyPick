CREATE TABLE refresh_tokens (
    token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    expires_at timestamp with time zone NOT NULL,
    revoked boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);