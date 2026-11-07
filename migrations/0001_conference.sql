CREATE TABLE conference_entries (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  email TEXT NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  submitted_at TEXT NOT NULL,
  lead_queued_at TEXT,
  UNIQUE (event_id, email)
);
CREATE INDEX conference_pending_leads ON conference_entries (event_id, lead_queued_at);

CREATE TABLE conference_draws (
  event_id TEXT PRIMARY KEY,
  winner_id TEXT REFERENCES conference_entries(id),
  entry_count INTEGER NOT NULL,
  drawn_at TEXT NOT NULL,
  email_sent_at TEXT
);
