-- Clean up existing data to avoid duplicates if you run this multiple times
DELETE FROM garments;
DELETE FROM users;

-- 1. Insert User (We use a fixed UUID for easy reference)
INSERT INTO users (id, name, email)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Admin EasyPick', 'admin@gmail.com');

-- 2. Insert Garments
INSERT INTO garments (id, name, description, image_url, user_id)
VALUES
    (gen_random_uuid(), 'Camiseta Básica', 'Algodón 100%', 'https://images.com/shirt.jpg', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
    (gen_random_uuid(), 'Vaqueros Slim', 'Denim azul', 'https://images.com/jeans.jpg', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
    (gen_random_uuid(), 'Chaqueta Anuncio', 'Patrocinado', 'https://images.com/jacket.jpg', NULL);