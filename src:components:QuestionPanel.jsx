// src/components/QuestionPanel.jsx
import React, { useState, useEffect } from "react";
import { generateQuestion, recordWrong } from "../utils/noteUtils";

export default function QuestionPanel({ onNewNote }) {
  const [currentNote, setCurrentNote] = useState(generateQuestion());
  const [score, setScore] = useState(0);

  // 学生答题（从 PianoKeyboard 传入）
  const handleAnswer = (note) => {
    if (note === currentNote) {
      setScore((s) => s + 10);
      const next = generateQuestion();
      setCurrentNote(next);
      onNewNote(next); // 通知五线谱刷新
    } else {
      recordWrong(currentNote);
      alert(`答错啦！正确答案是 ${currentNote}`);
    }
  };

  // 页面初始时同步显示题目
  useEffect(() => {
    onNewNote(currentNote);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>🎼 当前题目：{currentNote}</h2>
      <h3>当前得分：{score}</h3>
      <button onClick={() => {
        const next = generateQuestion();
        setCurrentNote(next);
        onNewNote(next);
      }}>下一题</button>
    </div>
  );
}
