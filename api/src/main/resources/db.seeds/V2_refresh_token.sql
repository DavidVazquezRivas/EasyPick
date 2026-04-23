-- Clean up existing data to avoid duplicates if you run this multiple times
DELETE
FROM refresh_tokens;

INSERT INTO refresh_tokens (token, expires_at, revoked, user_id)
VALUES ('11111111-1111-1111-1111-111111111111', '2030-12-31T23:59:59Z', false,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479')