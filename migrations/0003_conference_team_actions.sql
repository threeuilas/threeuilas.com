-- Staff decisions are recorded by the authenticated ops application.
CREATE TABLE conference_team_actions (
  id TEXT PRIMARY KEY,
  round_id TEXT NOT NULL REFERENCES conference_draw_rounds(id),
  entry_id TEXT NOT NULL REFERENCES conference_entries(id),
  actor_user_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('notified', 'accepted', 'declined')),
  previous_status TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);
CREATE INDEX conference_team_actions_round ON conference_team_actions(round_id, occurred_at);
CREATE TRIGGER conference_team_actions_no_update BEFORE UPDATE ON conference_team_actions
BEGIN SELECT RAISE(ABORT, 'Conference team history is append-only'); END;
CREATE TRIGGER conference_team_actions_no_delete BEFORE DELETE ON conference_team_actions
BEGIN SELECT RAISE(ABORT, 'Conference team history is append-only'); END;
