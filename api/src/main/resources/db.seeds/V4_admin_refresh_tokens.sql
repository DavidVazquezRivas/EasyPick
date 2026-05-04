-- Clean previous admin token
DELETE
FROM refresh_tokens
WHERE token = '11111111-1111-1111-1111-111111111111';

INSERT INTO users(id, name, email)
VALUES ('2d86708b-f570-4927-bcc8-5f6b94775c4c', 'Garment Processor', 'garment@processor.com'),
       ('5293d1b1-1794-4158-a08b-80b7cd9f03e4', 'Suggestion Motor', 'suggestion@motor.com');

INSERT INTO refresh_tokens(token, expires_at, revoked, user_id, admin)
VALUES ('9ca03ab2-0aef-4c42-9030-dd0def7eaff0', '2100-12-31T23:59:59Z', false,
        '2d86708b-f570-4927-bcc8-5f6b94775c4c', true), -- Garment processor
       ('11111111-1111-1111-1111-111111111111', '2030-12-31T23:59:59Z', false,
        'f47ac10b-58cc-4372-a567-0e02b2c3d479', true), -- Dev user
       ('8bc038bf-1c56-4969-8f54-4b0750bbb4a4', '2100-12-31T23:59:59Z', false,
        '5293d1b1-1794-4158-a08b-80b7cd9f03e4', true);

