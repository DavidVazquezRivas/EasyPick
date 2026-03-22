CREATE TABLE users
(
    id         UUID                              DEFAULT gen_random_uuid(),
    name       VARCHAR(255)             NOT NULL,
    email      VARCHAR(255)             NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE garments
(
    id          UUID                              DEFAULT gen_random_uuid(),
    name        VARCHAR(100)             NOT NULL,
    description TEXT,
    image_url   VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id     UUID, -- Nullable to allow garments without an associated user (advertisements)
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);