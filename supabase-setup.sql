CREATE TABLE IF NOT EXISTS portfolio_data (
    id          integer      PRIMARY KEY,
    data        jsonb        NOT NULL DEFAULT '{}'::jsonb,
    updated_at  timestamptz  DEFAULT now()
);

INSERT INTO portfolio_data (id, data)
VALUES (1, '{
    "home":    {"desc_en":"","desc_ar":""},
    "about":   {"desc_en":"","desc_ar":"","name_en":"","name_ar":"","title_en":"","title_ar":"","loc_en":"","loc_ar":"","email":""},
    "skills":  [],
    "projects":[],
    "edu":     {"desc_en":"","desc_ar":""},
    "contact": {"email":"","phone":"","loc_en":"","loc_ar":"","linkedin":"","coding_en":"","coding_ar":""}
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read"    ON portfolio_data FOR SELECT USING (true);
CREATE POLICY "function_write" ON portfolio_data FOR ALL    USING (true) WITH CHECK (true);