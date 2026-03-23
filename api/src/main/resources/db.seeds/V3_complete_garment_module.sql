-- Clean up existing data to avoid duplicates if you run this multiple times
DELETE
FROM garment_colors;
DELETE
FROM colors;
DELETE
FROM brands;
DELETE
FROM styles;
DELETE
FROM categories;

-- Update Garments (We add warmth_index and preference_score to existing data)
UPDATE garments
SET warmth_index     = 2,
    preference_score = 8
WHERE name = 'Camiseta Básica';
UPDATE garments
SET warmth_index     = 4,
    preference_score = 9
WHERE name = 'Vaqueros Slim';
UPDATE garments
SET warmth_index     = 8,
    preference_score = 5
WHERE name = 'Chaqueta Anuncio';
UPDATE garments
SET status = 'CONFIRMED';

-- Insert Colors (We use fixed UUIDs for the first three to easily relate them later)
INSERT INTO colors (id, name, hex_code)
VALUES ('11111111-1111-1111-1111-111111111111', 'Blanco', '#FFFFFF'),
       ('22222222-2222-2222-2222-222222222222', 'Azul Denim', '#1560BD'),
       ('33333333-3333-3333-3333-333333333333', 'Negro', '#000000'),
       (gen_random_uuid(), 'Gris Claro', '#D3D3D3'),
       (gen_random_uuid(), 'Gris Oscuro', '#A9A9A9'),
       (gen_random_uuid(), 'Azul Marino', '#000080'),
       (gen_random_uuid(), 'Azul Claro', '#ADD8E6'),
       (gen_random_uuid(), 'Turquesa', '#40E0D0'),
       (gen_random_uuid(), 'Rojo', '#FF0000'),
       (gen_random_uuid(), 'Burdeos / Vino', '#800000'),
       (gen_random_uuid(), 'Verde Esmeralda', '#50C878'),
       (gen_random_uuid(), 'Verde Oliva', '#808000'),
       (gen_random_uuid(), 'Amarillo', '#FFFF00'),
       (gen_random_uuid(), 'Mostaza', '#FFDB58'),
       (gen_random_uuid(), 'Naranja', '#FFA500'),
       (gen_random_uuid(), 'Marrón', '#8B4513'),
       (gen_random_uuid(), 'Beige', '#F5F5DC'),
       (gen_random_uuid(), 'Caqui', '#C3B091'),
       (gen_random_uuid(), 'Rosa Pastel', '#FFD1DC'),
       (gen_random_uuid(), 'Fucsia', '#FF00FF'),
       (gen_random_uuid(), 'Morado', '#800080'),
       (gen_random_uuid(), 'Lila', '#C8A2C8');

-- Link Colors to Garments (We use subqueries to find the dynamically generated garment IDs)
INSERT INTO garment_colors (garment_id, color_id)
SELECT id, '11111111-1111-1111-1111-111111111111'
FROM garments
WHERE name = 'Camiseta Básica';

INSERT INTO garment_colors (garment_id, color_id)
SELECT id, '22222222-2222-2222-2222-222222222222'
FROM garments
WHERE name = 'Vaqueros Slim';

INSERT INTO garment_colors (garment_id, color_id)
SELECT id, '33333333-3333-3333-3333-333333333333'
FROM garments
WHERE name = 'Chaqueta Anuncio';

-- Insert Brands (We let the database generate the UUIDs automatically)
INSERT INTO brands (name)
VALUES ('Zara'),
       ('H&M'),
       ('Mango'),
       ('Pull&Bear'),
       ('Bershka'),
       ('Stradivarius'),
       ('Massimo Dutti'),
       ('Uniqlo'),
       ('Primark'),
       ('ASOS'),
       ('Shein'),
       ('Nike'),
       ('Adidas'),
       ('Puma'),
       ('Under Armour'),
       ('Reebok'),
       ('New Balance'),
       ('Asics'),
       ('Fila'),
       ('Lee'),
       ('Wrangler'),
       ('Vans'),
       ('Converse'),
       ('Diesel'),
       ('Pepe Jeans'),
       ('Ralph Lauren'),
       ('Tommy Hilfiger'),
       ('Calvin Klein'),
       ('Lacoste'),
       ('Hugo Boss'),
       ('Guess'),
       ('The North Face'),
       ('Patagonia'),
       ('Columbia'),
       ('Timberland'),
       ('Sin Marca'),
       ('Hecho a mano');

-- Insert Styles (We let the database generate the UUIDs automatically)
INSERT INTO styles (name)
VALUES ('Casual'),
       ('Smart Casual'),
       ('Formal / Business'),
       ('Deportivo / Athleisure'),
       ('Streetwear'),
       ('Minimalista'),
       ('Vintage / Retro'),
       ('Bohemio (Boho)'),
       ('Preppy'),
       ('Grunge'),
       ('Loungewear (Estar por casa)'),
       ('Fiesta / Noche'),
       ('Urbano'),
       ('Y2K');

-- Insert Categories (We let the database generate the UUIDs automatically)
INSERT INTO categories (name, description)
VALUES ('Camisetas', 'Prendas ligeras para la parte superior, manga corta o larga'),
       ('Pantalones', 'Prendas para cubrir la parte inferior del cuerpo'),
       ('Chaquetas', 'Prendas de abrigo para la capa exterior'),
       ('Calzado', 'Zapatos, zapatillas, botas y sandalias');