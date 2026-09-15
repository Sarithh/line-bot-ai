# LINE AI Bot (Messaging API + Gemini API)

บอทที่ตอบลูกค้าใน LINE OA อัตโนมัติด้วย Gemini โดยอ้างอิงข้อมูลจาก `data/faq.js`

## โครงสร้างไฟล์
```
app/api/webhook/route.js   -> endpoint ที่ LINE ยิง event เข้ามา
lib/line.js                -> verify signature + ส่งข้อความกลับ LINE
lib/gemini.js              -> เรียก Gemini API พร้อมแนบ FAQ เป็น context
data/faq.js                -> ★ แก้ตรงนี้ ใส่ข้อมูลสินค้า/โปรโมชันของคุณ
```

## ขั้นตอนที่ 1: เตรียม LINE Channel
1. ไปที่ https://developers.line.biz/console/ เลือก Provider ของคุณ
2. เปิด "Messaging API" channel ที่ผูกกับ LINE OA เดิมอยู่แล้ว (ถ้ายังไม่มีให้สร้าง Messaging API channel แล้วผูกกับ OA)
3. ไปแท็บ **Messaging API** เพื่อคัดลอก:
   - `Channel secret` (อยู่แท็บ Basic settings)
   - `Channel access token` (กด Issue ถ้ายังไม่มี)
4. **สำคัญ**: ถ้า OA เดิมมี Auto-reply message / Greeting message เปิดอยู่ ให้เข้า LINE Official Account Manager > Settings > Response settings แล้วปิด "Auto-reply messages" (เปิดแค่ Webhook) ไม่งั้นบอทจะตอบซ้อนกัน 2 ข้อความ

## ขั้นตอนที่ 2: รันโปรเจกต์นี้บนเครื่อง (ผ่าน Claude Code / VSCode)
```bash
npm install
cp .env.example .env.local
# ใส่ค่า LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, GEMINI_API_KEY ใน .env.local
npm run dev
```

## ขั้นตอนที่ 3: แก้ข้อมูล FAQ
เปิด `data/faq.js` แล้วแก้เป็นข้อมูลสินค้า/โปรโมชันจริงของคุณ (รูปแบบข้อความธรรมดา ไม่ต้องเป็น code)

## ขั้นตอนที่ 4: Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "init line ai bot"
git remote add origin <URL_REPO_GITHUB_ของคุณ>
git push -u origin main
```

## ขั้นตอนที่ 5: Deploy บน Vercel
1. เข้า https://vercel.com > New Project > เลือก repo ที่เพิ่ง push
2. ก่อนกด Deploy ให้ไปที่ Environment Variables ใส่ 3 ค่า:
   - `LINE_CHANNEL_SECRET`
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `GEMINI_API_KEY`
3. กด Deploy จะได้ URL เช่น `https://your-project.vercel.app`

## ขั้นตอนที่ 6: ตั้งค่า Webhook URL ที่ LINE
1. กลับไปที่ LINE Developers Console > Messaging API tab
2. ใส่ Webhook URL เป็น `https://your-project.vercel.app/api/webhook`
3. กด **Verify** ต้องขึ้น Success (ถ้า error ตรวจว่า env vars ถูกต้องบน Vercel)
4. เปิดสวิตช์ **Use webhook** เป็น ON

## ขั้นตอนที่ 7: ทดสอบ
แอด/แชทเข้า LINE OA ของคุณ พิมพ์ถามอะไรก็ได้เกี่ยวกับข้อมูลใน `data/faq.js` เช่น "โปรโมชัน Cafe Amazon" บอทควรตอบกลับภายในไม่กี่วินาที

## ส่วน Rich Menu (เมนูรูปภาพด้านล่าง แบบในตัวอย่าง OR Happy Life)
Rich Menu แยกอิสระจากโค้ดนี้ ไม่ต้องเขียนโปรแกรมเพิ่ม สร้างได้ผ่าน
**LINE Official Account Manager > Rich menu** โดย:
1. อัปโหลดรูปภาพเมนู (ขนาดแนะนำ 2500x1686 px)
2. แบ่งพื้นที่ (tap area) แต่ละช่อง กำหนด Action เป็น "ส่งข้อความ" (Send message) หรือ "ลิงก์" (Link)
3. ถ้าต้องการเมนูซ้อนเมนู (กดแล้วเปลี่ยนเป็นอีกชุดนึง เหมือนภาพตัวอย่างที่กด FIT Auto แล้วเปลี่ยนเมนู) ให้สร้าง Rich Menu หลายอันแล้วตั้ง Action เป็น "Rich menu switch" ไปยังอีกอันหนึ่ง

## เชื่อม Google Sheet แทนไฟล์ data/faq.js (แก้ข้อมูลได้โดยไม่ต้อง deploy ใหม่)

ถ้าอยากแก้คำถาม-คำตอบผ่านหน้าเว็บ/มือถือได้เลยโดยไม่ต้องแตะโค้ด ให้ทำตามนี้:

1. สร้าง Google Sheet ใหม่ ตั้งชื่อคอลัมน์แถวแรกเป็น `คำถาม` กับ `คำตอบ` (คอลัมน์ A และ B) แล้วกรอกข้อมูล FAQ ทีละแถว
2. ไปที่เมนู **File > Share > Publish to web**
3. เลือกแท็บที่ต้องการ (ถ้ามีหลายแท็บ) เลือกรูปแบบเป็น **Comma-separated values (.csv)** แล้วกด **Publish**
4. คัดลอกลิงก์ที่ได้ (จะขึ้นต้นด้วย `https://docs.google.com/spreadsheets/d/e/...` และลงท้ายด้วย `output=csv`)
5. เอาลิงก์นั้นไปใส่ในตัวแปร `GOOGLE_SHEET_CSV_URL` ทั้งใน `.env.local` (ตอนทดสอบในเครื่อง) และใน **Vercel > Settings > Environment Variables** (ตอนใช้งานจริง) แล้ว Redeploy อีกครั้ง

จากนั้นบอทจะดึงข้อมูลจาก Sheet นี้แทน `data/faq.js` โดยอัตโนมัติ ถ้าดึงไม่สำเร็จ (เช่น เน็ตมีปัญหา, ลิงก์ผิด) จะ fallback กลับไปใช้ `data/faq.js` แทนชั่วคราว เพื่อไม่ให้บอทตอบไม่ได้เลย

**ข้อควรระวัง**: Sheet ที่ Publish to web แบบนี้จะเป็น**สาธารณะ** ใครมีลิงก์ก็เข้าดูได้ อย่าใส่ข้อมูลลับ (ราคาต้นทุน ข้อมูลลูกค้า ฯลฯ) ลงไป

## หมายเหตุด้านความปลอดภัย/ต้นทุน
- ไฟล์ `data/faq.js` ถูกส่งเข้า Gemini API ทุกครั้งที่มีคนทัก ถ้าข้อมูลยาวมาก (หลายพันบรรทัด) จะเสียค่า token เยอะขึ้น — ถ้าข้อมูลเริ่มใหญ่เกิน ~2000 บรรทัด ค่อยพิจารณาทำ RAG (แยกเก็บใน vector DB แล้วดึงเฉพาะส่วนที่เกี่ยวข้อง)
- อย่า commit ไฟล์ `.env.local` ขึ้น GitHub (มี `.gitignore` กันไว้ให้แล้ว)
