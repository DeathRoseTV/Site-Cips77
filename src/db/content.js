const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '..', '..', 'data', 'cips77.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS site_content (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 type TEXT NOT NULL CHECK(type IN ('news','event','gallery')),
 title TEXT NOT NULL,
 body TEXT NOT NULL DEFAULT '',
 date TEXT NOT NULL DEFAULT '',
 image_url TEXT NOT NULL DEFAULT '',
 published INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
)`);
const allowed = new Set(['news','event','gallery']);
function list(type, publishedOnly=false) {
 if (!allowed.has(type)) throw new Error('Type de contenu invalide');
 return db.prepare(`SELECT id,type,title,body,date,image_url,published,created_at,updated_at FROM site_content WHERE type=? ${publishedOnly?'AND published=1':''} ORDER BY date DESC, id DESC`).all(type);
}
function save(item) {
 if (!allowed.has(item.type)) throw new Error('Type de contenu invalide');
 const now = new Date().toISOString();
 if (item.id) {
  db.prepare('UPDATE site_content SET type=?,title=?,body=?,date=?,image_url=?,published=?,updated_at=? WHERE id=?').run(item.type,item.title,item.body,item.date,item.image_url,item.published?1:0,now,item.id);
  return Number(item.id);
 }
 const result=db.prepare('INSERT INTO site_content(type,title,body,date,image_url,published,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').run(item.type,item.title,item.body,item.date,item.image_url,item.published?1:0,now,now);
 return Number(result.lastInsertRowid);
}
function remove(id) { return db.prepare('DELETE FROM site_content WHERE id=?').run(id).changes > 0; }
module.exports={list,save,remove};
