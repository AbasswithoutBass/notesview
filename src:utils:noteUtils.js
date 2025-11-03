// src/utils/noteUtils.js
// 负责出题与记忆曲线逻辑（含详细中文注释）

// 全部可能的音符（可根据教学范围调整）
export const NOTES = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5"
];

// 1️⃣ 出题算法：随机选择一个音符
export function generateQuestion() {
  const randomIndex = Math.floor(Math.random() * NOTES.length);
  return NOTES[randomIndex];
}

// 2️⃣ 错题存储算法
// localStorage 保存错题记录，每个音符带上“下次复习时间”
export function recordWrong(note) {
  const wrongs = JSON.parse(localStorage.getItem("wrongNotes") || "[]");

  // 使用艾宾浩斯遗忘曲线的间隔时间（分钟为单位）
  const intervals = [5, 30, 720, 1440, 4320, 10080]; // 5分钟、30分钟、12小时、1天、3天、7天
  const now = Date.now();

  wrongs.push({
    note,
    createdAt: now,
    schedule: intervals.map((m) => now + m * 60 * 1000),
  });

  localStorage.setItem("wrongNotes", JSON.stringify(wrongs));
}

// 3️⃣ 获取应复习的错题
export function getDueWrongs() {
  const wrongs = JSON.parse(localStorage.getItem("wrongNotes") || "[]");
  const now = Date.now();

  // 如果当前时间已超过复习计划中的任何一个时间点 → 返回该音符
  return wrongs.filter((w) => w.schedule.some((t) => t <= now));
}
