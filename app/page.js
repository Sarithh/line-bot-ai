"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>

      <header className={styles.header}>
        <div className={styles.logo}>☕</div>

        <div>
          <h1>Sunroot Coffee & Bake</h1>
          <p>LINE AI Chatbot</p>
        </div>
      </header>

      <div className={styles.chatContainer}>

        <div className={styles.chatHeader}>
          <div className={styles.botAvatar}>☕</div>

          <div>
            <strong>Sunroot Coffee & Bake</strong>
            <span>Online</span>
          </div>
        </div>

        <div className={styles.chatBody}>

          <div className={styles.botMessage}>
            <div className={styles.messageAvatar}>☕</div>

            <div className={styles.messageBubble}>
              สวัสดีค่ะ 👋
              <br />
              ยินดีต้อนรับสู่ Sunroot Coffee & Bake
              <br />
              เลือกหัวข้อที่ต้องการสอบถามได้เลยค่ะ
            </div>
          </div>

          <div className={styles.menuArea}>

            <button className={styles.menuButton}>
              <div className={styles.menuIcon}>🏪</div>
              <div className={styles.menuText}>
                <strong>ข้อมูลร้าน</strong>
                <small>ข้อมูลทั่วไปและเวลาเปิด-ปิด</small>
              </div>
              <span className={styles.arrow}>›</span>
            </button>

            <button className={styles.menuButton}>
              <div className={styles.menuIcon}>📍</div>
              <div className={styles.menuText}>
                <strong>สาขา</strong>
                <small>ข้อมูลสาขาของ Sunroot</small>
              </div>
              <span className={styles.arrow}>›</span>
            </button>

            <button className={styles.menuButton}>
              <div className={styles.menuIcon}>🎁</div>
              <div className={styles.menuText}>
                <strong>โปรโมชั่น</strong>
                <small>โปรโมชั่นและสิทธิพิเศษ</small>
              </div>
              <span className={styles.arrow}>›</span>
            </button>

          </div>

        </div>

        <div className={styles.chatInput}>
          <div className={styles.inputBox}>
            พิมพ์ข้อความ...
          </div>

          <button className={styles.sendButton}>
            ↑
          </button>
        </div>

      </div>

    </main>
  );
}