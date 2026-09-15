const { FAQ } = require("../data/faq");
const { fetchFaqFromSheet } = require("./sheet");

function buildSystemPrompt(faqText) {
  return `คุณคือแอดมินแชทบอทของ OR Happy Life ตอบลูกค้าทาง LINE Official Account
ให้ตอบสั้น กระชับ เป็นกันเอง ใช้ภาษาไทย เหมาะกับแชท (ไม่เกิน 4-5 บรรทัด)
ใช้ข้อมูลด้านล่างนี้เป็นความรู้หลักในการตอบ ถ้าคำถามไม่เกี่ยวข้องหรือไม่มีข้อมูล
ให้บอกลูกค้าตรงๆ ว่าไม่มีข้อมูลส่วนนี้ และแนะนำให้ติดต่อ Call Center 1365
ห้ามกุข้อมูลราคา/โปรโมชันที่ไม่มีอยู่ในข้อมูลด้านล่าง

=== ข้อมูล ===
${faqText}
=== จบข้อมูล ===`;
}

async function getFaqText() {
  // ถ้าตั้งค่า GOOGLE_SHEET_CSV_URL ไว้ ให้ใช้ข้อมูลจาก Sheet (แก้ได้แบบไม่ต้อง deploy ใหม่)
  // ถ้าดึงไม่ได้หรือไม่ได้ตั้งค่าไว้ ให้ fallback กลับไปใช้ data/faq.js แทน
  if (process.env.GOOGLE_SHEET_CSV_URL) {
    try {
      return await fetchFaqFromSheet();
    } catch (err) {
      console.error("ดึง FAQ จาก Google Sheet ไม่สำเร็จ, ใช้ data/faq.js แทน:", err);
      return FAQ;
    }
  }
  return FAQ;
}

// เรียก Gemini API (generateContent) - ใช้ x-goog-api-key header ตามสเปกทางการล่าสุด
async function askGemini(userMessage) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const faqText = await getFaqText();
  const SYSTEM_PROMPT = buildSystemPrompt(faqText);
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 400,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim() || "ขออภัยค่ะ ตอนนี้ระบบขัดข้อง ลองใหม่อีกครั้งนะคะ";
}

module.exports = { askGemini };
