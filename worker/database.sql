CREATE TABLE bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_name TEXT NOT NULL,
  amount REAL NOT NULL,
  start_due_date TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('Monthly','Quarterly','Half-Yearly','Annually')),
  emails TEXT NOT NULL,
  last_reminded_date TEXT
);