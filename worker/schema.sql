CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT,
  title TEXT,
  name TEXT,
  email TEXT,
  batch TEXT,
  roll_no TEXT,
  department TEXT,
  designation TEXT,
  emp_id TEXT,
  location TEXT,

  asset_desc TEXT,
  asset_type TEXT,
  serial_no TEXT,
  purchase_date TEXT,
  brand TEXT,
  model TEXT,
  ram TEXT,
  processor TEXT,
  storage TEXT,
  remarks TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);