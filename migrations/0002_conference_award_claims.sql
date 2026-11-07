CREATE TABLE conference_draw_rounds (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  entry_id TEXT NOT NULL REFERENCES conference_entries(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'notified', 'accepted', 'declined', 'expired')),
  selected_at TEXT NOT NULL,
  notified_at TEXT,
  accept_by TEXT,
  responded_at TEXT,
  redeem_by TEXT,
  owner_notified_status TEXT,
  UNIQUE (event_id, round_number),
  UNIQUE (event_id, entry_id)
);
CREATE UNIQUE INDEX conference_one_active_award ON conference_draw_rounds(event_id)
  WHERE status IN ('pending', 'notified', 'accepted');
ALTER TABLE conference_draws ADD COLUMN exhausted_notified_at TEXT;

-- Retain any already-selected winner; notification starts the new acceptance window.
INSERT INTO conference_draw_rounds (id, event_id, round_number, entry_id, status, selected_at)
  SELECT 'legacy-' || event_id, event_id, 1, winner_id, 'pending', drawn_at
  FROM conference_draws WHERE winner_id IS NOT NULL;
