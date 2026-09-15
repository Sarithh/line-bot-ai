"use client";

import { useState } from "react";
import styles from "./page.module.css";

const MAIN_MENU = [
  {
    id: "shop",
    icon: "🏪",
    title: "ข้อมูลร้าน",
    description: "ข้อมูลทั่วไปและเวลาเปิด-ปิด",
  },
  {
    id: "branches",
    icon: "📍",
    title: "สาขา",
    description: "ค้นหาข้อมูลแต่ละสาขา",
  },
  {
    id: "promotion",
    icon: "🎁",
    title: "โปรโมชั่น",
    description: "โปรโมชั่นและสิทธิพิเศษ",
  },
  {
    id: "menu",
    icon: "☕",
    title: "เมนูแนะนำ",
    description: "กาแฟ เบเกอรี่ และเมนูใหม่",
  },
  {
    id: "workspace",
    icon: "🪑",
    title: "จองโต๊ะ / พื้นที่ทำงาน",
    description: "ห้องประชุมและ Wi-Fi",
  },
  {
    id: "contact",
    icon: "📞",
    title: "ติดต่อเรา",
    description: "ช่องทางการติดต่อ",
  },
];

const SUB_MENU = {
  shop: [
    ["🏪", "ข้อมูลร้าน"],
    ["🕐", "เวลาเปิด-ปิด"],
  ],

  branches: [
    ["📍", "สาขาทองหล่อ"],
    ["📍", "สาขาอารีย์"],
    ["📍", "สาขาเซ็นทรัลเวิลด์"],
    ["📍", "สาขาเชียงใหม่"],
  ],

  promotion: [
    ["💳", "Sunroot Card"],
    ["🍰", "โปรโมชั่นวันพุธ"],
    ["🛵", "ส่งฟรีผ่านแอป"],
  ],

  menu: [
    ["☕", "กาแฟ"],
    ["🥐", "เบเกอรี่"],
    ["✨", "เมนูใหม่ล่าสุด"],
  ],

  workspace: [
    ["🪑", "ห้องประชุม"],
    ["📶", "Wi-Fi"],
  ],

  contact: [
    ["💬", "LINE OA"],
    ["📞", "โทรศัพท์"],
    ["🌐", "เว็บไซต์"],
  ],
};

export default function Home() {
  const [currentMenu, setCurrentMenu] = useState("main");

  const selectedMenu = MAIN_MENU.find(
    (menu) => menu.id === currentMenu
  );

  const handleBack = () => {
    setCurrentMenu("main");
  };

  return (
    <main className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          ☕
        </div>

        <div>
          <h1>Sunroot Coffee & Bake</h1>
          <p>LINE AI Chatbot</p>
        </div>
      </header>


      {/* Chatbot Preview */}
      <section className={styles.chatContainer}>

        <div className={styles.chatHeader}>
          <div className={styles.botAvatar}>
            ☕
          </div>

          <div>
            <strong>Sunroot Coffee & Bake</strong>
            <span>Online</span>
          </div>
        </div>


        {/* Chat */}
        <div className={styles.chatBody}>

          <div className={styles.botMessage}>
            <div className={styles.messageAvatar}>
              ☕
            </div>

            <div className={styles.messageBubble}>
              สวัสดีค่ะ 👋
              <br />
              ยินดีต้อนรับสู่ Sunroot Coffee & Bake
              <br />
              เลือกหัวข้อที่ต้องการสอบถามได้เลยค่ะ
            </div>
          </div>


          {/* MAIN MENU */}
          {currentMenu === "main" && (
            <div className={styles.menuArea}>

              {MAIN_MENU.map((menu) => (
                <button
                  key={menu.id}
                  className={styles.menuButton}
                  onClick={() => setCurrentMenu(menu.id)}
                >
                  <span className={styles.menuIcon}>
                    {menu.icon}
                  </span>

                  <span className={styles.menuText}>
                    <strong>{menu.title}</strong>
                    <small>{menu.description}</small>
                  </span>

                  <span className={styles.arrow}>
                    →
                  </span>
                </button>
              ))}

            </div>
          )}


          {/* SUB MENU */}
          {currentMenu !== "main" && (
            <div className={styles.menuArea}>

              <div className={styles.subMenuTitle}>
                <span>
                  {selectedMenu?.icon}
                </span>

                <div>
                  <strong>
                    {selectedMenu?.title}
                  </strong>

                  <small>
                    {selectedMenu?.description}
                  </small>
                </div>
              </div>


              {SUB_MENU[currentMenu]?.map(
                ([icon, title]) => (
                  <button
                    key={title}
                    className={styles.subMenuButton}
                  >
                    <span className={styles.subMenuIcon}>
                      {icon}
                    </span>

                    <span>
                      {title}
                    </span>

                    <span className={styles.arrow}>
                      →
                    </span>
                  </button>
                )
              )}


              {/* Back */}
              <button
                className={styles.backButton}
                onClick={handleBack}
              >
                ← ย้อนกลับ
              </button>

            </div>
          )}

        </div>


        {/* Input Preview */}
        <div className={styles.chatInput}>
          <div className={styles.inputBox}>
            พิมพ์ข้อความ...
          </div>

          <button className={styles.sendButton}>
            ↑
          </button>
        </div>

      </section>


      {/* Information */}
      <section className={styles.infoSection}>

        <div className={styles.infoCard}>
          <span>📍</span>
          <div>
            <strong>4 สาขา</strong>
            <p>กรุงเทพฯ และเชียงใหม่</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <span>🕐</span>
          <div>
            <strong>เปิดทุกวัน</strong>
            <p>07:00 - 20:00</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <span>📶</span>
          <div>
            <strong>Wi-Fi ฟรี</strong>
            <p>ทุกสาขา ไม่จำกัดเวลานั่ง</p>
          </div>
        </div>

      </section>

    </main>
  );
}