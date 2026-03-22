CREATE TABLE brands
(
    id         UUID                              DEFAULT gen_random_uuid(),
    name       VARCHAR(100)             NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE styles
(
    id         UUID                              DEFAULT gen_random_uuid(),
    name       VARCHAR(100)             NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE categories
(
    id          UUID                              DEFAULT gen_random_uuid(),
    name        VARCHAR(100)             NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE colors
(
    id         UUID                              DEFAULT gen_random_uuid(),
    name       VARCHAR(100)             NOT NULL,
    hex_code   VARCHAR(7)               NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE garment_colors
(
    garment_id UUID NOT NULL,
    color_id   UUID NOT NULL,
    PRIMARY KEY (garment_id, color_id),
    FOREIGN KEY (garment_id) REFERENCES garments (id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors (id) ON DELETE CASCADE
);

-- This table is created in V1, but we need to add some columns to it for the garment module
-- Alter tables 1 by 1 for H2 test database compatibility
ALTER TABLE garments
    ADD COLUMN warmth_index INTEGER DEFAULT 0;
ALTER TABLE garments
    ADD COLUMN preference_score INTEGER DEFAULT 0;
ALTER TABLE garments
    ADD COLUMN brand_id UUID REFERENCES brands (id) ON DELETE SET NULL;
ALTER TABLE garments
    ADD COLUMN style_id UUID REFERENCES styles (id) ON DELETE SET NULL;
ALTER TABLE garments
    ADD COLUMN category_id UUID REFERENCES categories (id) ON DELETE SET NULL;
-- No using ENUM for better H2 compatibility
ALTER TABLE garments
    ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'DELETED'));
