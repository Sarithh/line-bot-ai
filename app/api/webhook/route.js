const { verifySignature, replyMessage } = require("../../../lib/line");
const { askGemini } = require("../../../lib/gemini");

// LINE ต้องได้ 200 กลับไปเร็วๆ ไม่งั้นจะ retry ซ้ำ ตั้ง timeout ป้องกันไว้
export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!signature || !verifySignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // ตอบ 200 ให้ LINE ก่อน แล้วค่อยประมวลผลต่อ (กัน timeout)
  const events = body.events || [];

  await Promise.all(
    events.map(async (event) => {
      try {
        if (event.type === "message" && event.message.type === "text") {
          const userText = event.message.text;
          const aiReply = await askGemini(userText);
          await replyMessage(event.replyToken, aiReply);
        }
        // event.type === "postback" -> จัดการปุ่มจาก Rich Menu / Flex message ที่นี่
      } catch (err) {
        console.error("Webhook handling error:", err);
      }
    })
  );

  return new Response("OK", { status: 200 });
}

// LINE จะยิง GET ตอนกด Verify ใน console บางครั้ง
export async function GET() {
  return new Response("LINE AI Bot webhook is alive", { status: 200 });
}
