// ===============================
// ✅ Staff.jsx（VexFlow 最新兼容修正版）
// 解决 NaN / Too many ticks / IncompleteVoice 错误
// ===============================
import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";

export default function Staff({ note = "C4", clef = "treble" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 清空旧画布
    containerRef.current.innerHTML = "";

    // 创建渲染器
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    renderer.resize(350, 160);

    // 绘制五线谱
    const stave = new Stave(10, 40, 330);
    stave.addClef(clef).setContext(context).draw();

    // 转换音符格式，比如 C4 -> c/4
    const key = note.toLowerCase().replace(/(\d)/, "/$1");

    // 创建音符
    const staveNote = new StaveNote({
      clef,
      keys: [key],
      duration: "q", // 四分音符
    });

    // ✅ 新的 Voice 初始化方法（不使用过时参数）
    const voice = new Voice({ time: { num_beats: 4, beat_value: 4 } });
    voice.setStrict(false); // 允许节拍不满
    voice.addTickables([staveNote]);

    // ✅ 使用 Formatter 安全绘制
    new Formatter().joinVoices([voice]).format([voice], 250);
    voice.draw(context, stave);

    console.log("✅ 五线谱绘制成功，音符：", note);
  }, [note, clef]);

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <div style={{ marginBottom: "8px", fontSize: "16px", color: "#444" }}>
        🎵 当前音符：<strong>{note}</strong>
      </div>
      <div
        ref={containerRef}
        style={{
          width: "350px",
          height: "160px",
          margin: "0 auto",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      ></div>
    </div>
  );
}
