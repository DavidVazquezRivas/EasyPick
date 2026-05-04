DELETE
FROM rejection_reasons;

INSERT INTO rejection_reasons (name)
VALUES ('No me convence'),
       ('No disponible hoy'),
       ('Fuera de ocasión'),
       ('No me favorece');

DELETE
FROM user_color_preferences
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

DELETE
FROM user_brand_preferences
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

DELETE
FROM user_style_preferences
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

DELETE
FROM user_category_preferences
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

INSERT INTO user_color_preferences (user_id, color_id, score)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479', id, 0
FROM colors;

INSERT INTO user_brand_preferences (user_id, brand_id, score)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479', id, 0
FROM brands;

INSERT INTO user_style_preferences (user_id, style_id, score)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479', id, 0
FROM styles;

INSERT INTO user_category_preferences (user_id, category_id, score)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479', id, 0
FROM categories;
