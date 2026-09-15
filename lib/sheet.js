// ดึงข้อมูล FAQ จาก Google Sheet ที่ publish เป็น CSV แบบ public
// แคชไว้ในหน่วยความจำสั้นๆ กัน rate limit ตอนมีคนทักถี่ๆ

let cache = { text: null, fetchedAt: 0 };
const CACHE_TTL_MS = 60 * 1000; // ดึงใหม่ทุก 1 นาที พอสำหรับข้อมูลโปรโมชันที่ไม่เปลี่ยนบ่อยเป็นวินาที

function parseCsvLine(line) {
  // parser ง่ายๆ รองรับ comma ปกติ + ข้อความที่ครอบด้วย double quotes (กรณีมี comma ในเนื้อหา)
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

async function fetchFaqFromSheet() {
  const now = Date.now();
  if (cache.text && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.text;
  }

  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;
  if (!csvUrl) throw new Error("Missing GOOGLE_SHEET_CSV_URL");

  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error(`ดึง Google Sheet ไม่สำเร็จ: ${res.status}`);

  const csvText = await res.text();
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== "");

  // แถวแรกคือ header (เช่น "คำถาม,คำตอบ") ข้ามไป
  const rows = lines.slice(1).map(parseCsvLine);

  const formatted = rows
    .filter((r) => r[0]) // ข้ามแถวว่าง
    .map((r) => `Q: ${r[0]}\nA: ${r[1] || ""}`)
    .join("\n\n");

  cache = { text: formatted, fetchedAt: now };
  return formatted;
}

module.exports = { fetchFaqFromSheet };
