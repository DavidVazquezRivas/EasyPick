-- Suggestion
CREATE TABLE rejection_reasons
(
    id         UUID                              DEFAULT gen_random_uuid(),
    name       VARCHAR(100)             NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- CREATE TABLE default_situations
-- (
--     id          UUID                              DEFAULT gen_random_uuid(),
--     description TEXT                     NOT NULL,
--     created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (id)
-- );
--
-- CREATE TABLE contexts
-- (
--     id                   UUID                              DEFAULT gen_random_uuid(),
--     default_situation_id UUID                     REFERENCES default_situations (id) ON DELETE SET NULL,
--     description          TEXT                     NOT NULL,
--     created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (id)
-- );

CREATE TABLE suggestions
(
    id          UUID                              DEFAULT gen_random_uuid(),
--     context_id  UUID                     NOT NULL REFERENCES contexts (id),
    name        VARCHAR(255)             NOT NULL,
    status      VARCHAR(30)                       DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    is_favorite BOOLEAN                           DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE garment_suggestions
(
    id            UUID DEFAULT gen_random_uuid(),
    suggestion_id UUID NOT NULL REFERENCES suggestions (id) ON DELETE CASCADE,
    garment_id    UUID NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (garment_id) REFERENCES garments (id) ON DELETE CASCADE
);

CREATE TABLE suggestion_rejections
(
    id                  UUID                              DEFAULT gen_random_uuid(),
    suggestion_id       UUID                     NOT NULL UNIQUE REFERENCES suggestions (id) ON DELETE CASCADE,
    rejection_reason_id UUID                     REFERENCES rejection_reasons (id) ON DELETE SET NULL,
    custom_reason       TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- CREATE INDEX idx_suggestion_context ON suggestions (context_id);
CREATE INDEX idx_garment_suggestion_main ON garment_suggestions (suggestion_id);

-- Preferences
CREATE TABLE user_color_preferences
(
    user_id  UUID NOT NULL,
    color_id UUID NOT NULL,
    score    INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, color_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors (id) ON DELETE CASCADE
);

CREATE TABLE user_brand_preferences
(
    user_id  UUID NOT NULL,
    brand_id UUID NOT NULL,
    score    INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, brand_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
);

CREATE TABLE user_style_preferences
(
    user_id  UUID NOT NULL,
    style_id UUID NOT NULL,
    score    INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, style_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (style_id) REFERENCES styles (id) ON DELETE CASCADE
);

CREATE TABLE user_category_preferences
(
    user_id     UUID NOT NULL,
    category_id UUID NOT NULL,
    score       INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);