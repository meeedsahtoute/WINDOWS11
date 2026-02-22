import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("aura.db");

// Initialize Virtual File System table
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    type TEXT NOT NULL, -- 'file' or 'dir'
    content TEXT,
    owner TEXT DEFAULT 'guest',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Create root directory if not exists
  INSERT OR IGNORE INTO files (id, name, parent_id, type) VALUES ('root', '/', NULL, 'dir');
  INSERT OR IGNORE INTO files (id, name, parent_id, type) VALUES ('users', 'Users', 'root', 'dir');
  INSERT OR IGNORE INTO files (id, name, parent_id, type) VALUES ('guest', 'Guest', 'users', 'dir');
  INSERT OR IGNORE INTO files (id, name, parent_id, type) VALUES ('desktop', 'Desktop', 'guest', 'dir');
  INSERT OR IGNORE INTO files (id, name, parent_id, type) VALUES ('documents', 'Documents', 'guest', 'dir');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // VFS API Endpoints
  app.get("/api/fs/list", (req, res) => {
    const parentId = req.query.parentId as string || 'root';
    const files = db.prepare("SELECT * FROM files WHERE parent_id = ?").all(parentId);
    res.json(files);
  });

  app.post("/api/fs/create", (req, res) => {
    const { id, name, parentId, type, content } = req.body;
    try {
      db.prepare("INSERT INTO files (id, name, parent_id, type, content) VALUES (?, ?, ?, ?, ?)")
        .run(id, name, parentId, type, content || "");
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/fs/delete/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM files WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AuraOS HAL running on http://localhost:${PORT}`);
  });
}

startServer();
