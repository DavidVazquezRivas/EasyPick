-- Seed garments for the dev user
DELETE FROM garment_colors WHERE garment_id IN (SELECT id FROM garments WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479');
DELETE FROM garments WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Camiseta Blanca Básica
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Camiseta Blanca Básica', 'Algodón 100% manga corta', 'https://lacamisetablanca.com/cdn/shop/files/CamisetaPacks_ccc9ebe7-fb26-4b60-b579-b777a9d043fe.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 7, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'H&M'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Tops')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Blanco';

-- Camiseta Negra Lisa
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Camiseta Negra Lisa', 'Manga corta ajustada', 'https://www.esparter1815.com/cdn/shop/files/CAMISETA_BASICA_NEGRA-T_0652ffa0-6572-4bba-a6bc-4db3bb05bf94.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 8, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Zara'),
           (SELECT id FROM styles WHERE name = 'Minimalista'),
           (SELECT id FROM categories WHERE name = 'Tops')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Negro';

-- Top Deportivo Nike
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Top Deportivo Nike', 'Transpirable secado rápido', 'https://img01.ztat.net/article/spp-media-p1/cbaa72e748914d38b0da0d5c7f21e629/89d768ebdfbd490c987d9d259adc2adf.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 6, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Nike'),
           (SELECT id FROM styles WHERE name = 'Deportivo / Athleisure'),
           (SELECT id FROM categories WHERE name = 'Tops')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Gris Claro';

-- Camisa Blanca Formal
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Camisa Blanca Formal', 'Camisa de vestir manga larga', 'http://ropaideal.es/wp-content/uploads/2017/06/CAMISA-MANGA-LARGA-BLANCA-PARA-CAMAREROS-Y-MUSICOS-1.png',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 9, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Massimo Dutti'),
           (SELECT id FROM styles WHERE name = 'Formal / Business'),
           (SELECT id FROM categories WHERE name = 'Camisas')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Blanco';

-- Camisa Azul Claro
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Camisa Azul Claro', 'Manga larga algodón', 'https://media.wuerth.com/stmedia/modyf/eshop/products/std.lang.all/resolutions/normal/png-546x410px/26501185.png',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 7, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Zara'),
           (SELECT id FROM styles WHERE name = 'Smart Casual'),
           (SELECT id FROM categories WHERE name = 'Camisas')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Azul Claro';

-- Sudadera Con Capucha Gris
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Sudadera Con Capucha Gris', 'Algodón fleece', 'https://www.joma-sport.com/dw/image/v2/BFRV_PRD/on/demandware.static/-/Sites-joma-masterCatalog/default/dwe3509da7/images/medium/103776.250_6.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 6, 8, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Pull&Bear'),
           (SELECT id FROM styles WHERE name = 'Streetwear'),
           (SELECT id FROM categories WHERE name = 'Sudaderas')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Gris Oscuro';

-- Jersey Cuello Redondo Azul Marino
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Jersey Cuello Redondo Azul Marino', 'Lana merina', 'https://canali.vtexassets.com/arquivos/ids/492481-800-auto/C1122-MK02353-301_a_.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 7, 8, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Uniqlo'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Jerséis')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Azul Marino';

-- Jersey Beige Cremallera
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Jersey Beige Cremallera', 'Algodón tejido', 'https://cdn.shopify.com/s/files/1/0052/6503/1286/files/46123_10_500x.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 6, 6, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Mango'),
           (SELECT id FROM styles WHERE name = 'Smart Casual'),
           (SELECT id FROM categories WHERE name = 'Jerséis')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Beige';

-- Chaqueta Vaquera
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Chaqueta Vaquera', 'Denim azul clásico', 'https://media.vertbaudet.es/Pictures/vertbaudet/457422/cazadora-vaquera-levis-infantil.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 6, 9, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Levis'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Vaqueros')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Azul Denim';

-- Abrigo Largo Negro
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Abrigo Largo Negro', 'Paño de lana', 'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2024/12/28/17353909638843.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 9, 8, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Zara'),
           (SELECT id FROM styles WHERE name = 'Formal / Business'),
           (SELECT id FROM categories WHERE name = 'Abrigos')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Negro';

-- Cazadora Piel Marrón
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Cazadora Piel Marrón', 'Piel sintética', 'https://m.media-amazon.com/images/I/71gKgz1LRQL._AC_UY1000_.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 7, 7, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Pull&Bear'),
           (SELECT id FROM styles WHERE name = 'Urbano'),
           (SELECT id FROM categories WHERE name = 'Abrigos')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Marrón';

-- Vaqueros Slim Azul
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Vaqueros Slim Azul', 'Denim elástico', 'https://cdn-images.farfetch-contents.com/31/76/86/75/31768675_61590885_600.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 4, 9, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Zara'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Vaqueros')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Azul Denim';

-- Pantalón Chino Beige
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Pantalón Chino Beige', 'Algodón slim fit', 'https://www.vittorio.es/media/catalog/product/cache/da2dafe50a4a25fcbbe4794e35760b43/p/a/pantalon_chino_hombre_beige_1.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 8, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Massimo Dutti'),
           (SELECT id FROM styles WHERE name = 'Smart Casual'),
           (SELECT id FROM categories WHERE name = 'Vaqueros')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Beige';

-- Pantalón de Vestir Negro
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Pantalón de Vestir Negro', 'Tejido formal', 'https://cdn-images.farfetch-contents.com/18/32/72/76/18327276_39193643_600.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 3, 7, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Zara'),
           (SELECT id FROM styles WHERE name = 'Formal / Business'),
           (SELECT id FROM categories WHERE name = 'Trajes')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Negro';

-- Shorts Caqui
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Shorts Caqui', 'Cortos verano', 'https://www.vertbaudet.es/fstrz/r/s/media.vertbaudet.es/Pictures/vertbaudet/541626/pack-de-2-shorts-motivo-jungla-para-recien-nacido.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 6, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'H&M'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Shorts')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Caqui';

-- Vestido Floral Primavera
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Vestido Floral Primavera', 'Estampado flores', 'https://media.pepserrastreetwear.com/product/vestido-de-tirante-fino-con-pequeno-estampado-floral-jdy-strawberry-cream-800x800.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 7, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Mango'),
           (SELECT id FROM styles WHERE name = 'Bohemio (Boho)'),
           (SELECT id FROM categories WHERE name = 'Vestidos')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Verde Esmeralda';

-- Falda Plisada Negra
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Falda Plisada Negra', 'Cintura alta', 'https://static.massimodutti.net/assets/public/d3bf/92ee/6c3649148186/595e1b5c467c/05204506800-o1/05204506800-o1.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 6, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Bershka'),
           (SELECT id FROM styles WHERE name = 'Fiesta / Noche'),
           (SELECT id FROM categories WHERE name = 'Faldas')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Negro';

-- Zapatillas Nike Blancas
INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
SELECT gen_random_uuid(), 'Zapatillas Nike Blancas', 'Air Force 1 estilo', 'https://img01.ztat.net/article/spp-media-p1/b16a91db1b5e4a76b447e8ec186eb23d/7905ab9f60224f58b73424fb8e3dc8bd.jpg',
       'f47ac10b-58cc-4372-a567-0e02b2c3d479', 2, 9, 'CONFIRMED',
       (SELECT id FROM brands WHERE name = 'Nike'),
       (SELECT id FROM styles WHERE name = 'Deportivo / Athleisure'),
       (SELECT id FROM categories WHERE name = 'Deporte');

-- Bufanda Gris
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Bufanda Gris', 'Lana larga', 'https://eu-images.contentstack.com/v3/assets/blt7dcd2cfbc90d45de/blt5fbe01d98b829c3e/68cac2b5cd4688d612294624/37056-1.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 8, 5, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Uniqlo'),
           (SELECT id FROM styles WHERE name = 'Casual'),
           (SELECT id FROM categories WHERE name = 'Accesorios')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Gris Claro';

-- Gorra Negra
WITH g AS (
    INSERT INTO garments (id, name, description, image_url, user_id, warmth_index, preference_score, status, brand_id, style_id, category_id)
    SELECT gen_random_uuid(), 'Gorra Negra', 'Baseball ajustable', 'https://assets.adidas.com/images/w_600,f_auto,q_auto/a2b956a1c41340f9b6dfafc201082ee6_9366/Gorra_de_beisbol_Cotton_Twill_3_bandas_Negro_IB3242_01_standard.jpg',
           'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 6, 'CONFIRMED',
           (SELECT id FROM brands WHERE name = 'Adidas'),
           (SELECT id FROM styles WHERE name = 'Deportivo / Athleisure'),
           (SELECT id FROM categories WHERE name = 'Accesorios')
    RETURNING id
)
INSERT INTO garment_colors (garment_id, color_id)
SELECT g.id, c.id FROM g, colors c WHERE c.name = 'Negro';
