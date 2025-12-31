import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'wishes.db');
const db = new Database(dbPath);

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// likes 컬럼이 없으면 추가 (기존 DB 호환)
try {
  db.exec(`ALTER TABLE wishes ADD COLUMN likes INTEGER DEFAULT 0`);
} catch {
  // 이미 존재하면 무시
}

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC)
`);

export interface Wish {
  id: number;
  content: string;
  likes: number;
  created_at: string;
}

// 한국 시간 (UTC+9) ISO 문자열 생성
function getKoreanTime(): string {
  const now = new Date();
  const koreaOffset = 9 * 60; // 분 단위
  const utcOffset = now.getTimezoneOffset();
  const koreaTime = new Date(now.getTime() + (koreaOffset + utcOffset) * 60 * 1000);
  return koreaTime.toISOString().replace('T', ' ').slice(0, 19);
}

// 최신 소원 50개 조회
export function getWishes(limit = 50): Wish[] {
  const stmt = db.prepare(`
    SELECT id, content, likes, created_at
    FROM wishes
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as Wish[];
}

// 새 소원 작성
export function createWish(content: string): Wish {
  const koreanTime = getKoreanTime();
  const stmt = db.prepare(`
    INSERT INTO wishes (content, likes, created_at) VALUES (?, 0, ?)
  `);
  const result = stmt.run(content, koreanTime);

  const getStmt = db.prepare(`
    SELECT id, content, likes, created_at FROM wishes WHERE id = ?
  `);
  return getStmt.get(result.lastInsertRowid) as Wish;
}

// 좋아요 추가
export function likeWish(id: number): Wish | null {
  const updateStmt = db.prepare(`
    UPDATE wishes SET likes = likes + 1 WHERE id = ?
  `);
  const result = updateStmt.run(id);

  if (result.changes === 0) {
    return null;
  }

  const getStmt = db.prepare(`
    SELECT id, content, likes, created_at FROM wishes WHERE id = ?
  `);
  return getStmt.get(id) as Wish;
}

export default db;
