-- ===============================
-- FactoryFlow Solutions
-- Fault Logging Table
-- ===============================

CREATE TABLE faults (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT CHECK (status IN ('Logged', 'Investigating', 'In progress', 'Resolved')),
    photo_url TEXT
);

INSERT INTO faults (title, description, severity, status, photo_url)
VALUES
(
  'Conveyor belt jam on Line 2',
  'Belt stopped suddenly during morning shift. Emergency stop activated.',
  'High',
  'Logged',
  NULL
),
(
  'Overheating motor',
  'Motor temperature exceeded safe threshold after 3 hours of use.',
  'Critical',
  'Investigating',
  'https://example.com/motor.jpg'
);
