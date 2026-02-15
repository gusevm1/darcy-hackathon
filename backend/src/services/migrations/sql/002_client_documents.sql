CREATE TABLE IF NOT EXISTS client_documents (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    document_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT '',
    file_size INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    verification_result TEXT,
    uploaded_at TEXT NOT NULL,
    verified_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_client_documents_client ON client_documents(client_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_documents_client_doc ON client_documents(client_id, document_id);
