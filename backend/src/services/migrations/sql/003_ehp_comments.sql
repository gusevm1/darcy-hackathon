CREATE TABLE IF NOT EXISTS ehp_comments (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    document_id TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    resolved INTEGER DEFAULT 0,
    ai_generated INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_ehp_client_doc ON ehp_comments(client_id, document_id);
