import { useState, useEffect, useCallback, useRef } from 'react';
import { DIFFICULTY_LEVELS } from '../constants/difficulty';
import { ALL_NOTES, ENHARMONIC_FLATS, ENHARMONIC_SHARPS } from '../constants/notes';
import { generateNotes, calculateScore, checkNotes } from '../utils/noteUtils';
import {
  saveHighScore,
  updateUserStats,
  getHighScores,
  getUserStats,
  clearStatsData
} from '../utils/storage';
import {
  recordMemoryResult,
  getDueNotes,
  getMemorySummary,
  clearMemoryData
} from '../utils/memoryCurve';

const CHORD_WINDOW_MS = 220;

const parseNoteString = (note) => {
  const match = String(note || '').trim().match(/^([A-G](?:#|b)?)(\d)$/i);
  if (!match) return null;
  
  let pitch = match[1].toLowerCase();
  
  // 标准化格式：第一个字母大写，其他小写
  if (pitch.length === 2) {
    pitch = pitch[0].toUpperCase() + pitch[1]; // C# or Db
  } else {
    pitch = pitch.toUpperCase(); // C
  }
  
  return {
    pitch,
    octave: parseInt(match[2], 10)
  };
};

// 获取音符在 ALL_NOTES 中的索引，支持升号和降号
const getPitchIndex = (pitch) => {
  // 如果是降号，转换为升号
  const sharpPitch = ENHARMONIC_SHARPS[pitch] || pitch;
  return ALL_NOTES.indexOf(sharpPitch);
};

const noteToAbsoluteIndex = ({ pitch, octave }) => {
  const pitchIndex = getPitchIndex(pitch);
  if (pitchIndex === -1) return -1;
  return octave * 12 + pitchIndex;
};

const buildNoteRange = (startNote, endNote) => {
  const start = parseNoteString(startNote);
  const end = parseNoteString(endNote);
  if (!start || !end) return [];

  const startIndex = noteToAbsoluteIndex(start);
  const endIndex = noteToAbsoluteIndex(end);

  if (startIndex === -1 || endIndex === -1) return [];

  const low = Math.min(startIndex, endIndex);
  const high = Math.max(startIndex, endIndex);
  const result = [];
  for (let idx = low; idx <= high; idx += 1) {
    const octave = Math.floor(idx / 12);
    const pitchIndex = idx % 12;
    const pitch = ALL_NOTES[pitchIndex];
    
    // 保存升号形式
    result.push(`${pitch}${octave}`);
  }
  return result;
};

const STANDARD_CLEF_NOTES = {
  treble: buildNoteRange('A3', 'C6'),
  bass: buildNoteRange('C2', 'E4'),
  alto: buildNoteRange('B2', 'D5'),
  tenor: buildNoteRange('G2', 'C5')
};

// 扩音域的完整音符范围
const EXTENDED_CLEF_NOTES = {
  treble: buildNoteRange('A2', 'D7'),    // 包括上下加线
  bass: buildNoteRange('C1', 'E5'),      // 包括上下加线
  alto: buildNoteRange('B1', 'E6'),      // 包括上下加线
  tenor: buildNoteRange('G1', 'E6')      // 包括上下加线
};

const EXTENDED_CLEF_OCTAVES = {
  treble: { min: 3, max: 6 },
  bass: { min: 1, max: 4 },
  alto: { min: 2, max: 5 },
  tenor: { min: 2, max: 5 }
};

const computeOctaveBounds = (notes = []) => {
  if (!notes.length) return { min: 4, max: 4 };
  const octaves = notes
    .map(parseNoteString)
    .filter(Boolean)
    .map(entry => entry.octave);
  return {
    min: Math.min(...octaves),
    max: Math.max(...octaves)
  };
};

const getRangeConfig = (rangeMode, clef) => {
  if (rangeMode === 'standard') {
    const allowedNotes = STANDARD_CLEF_NOTES[clef] || STANDARD_CLEF_NOTES.treble;
    return {
      allowedNotes,
      octaveRange: computeOctaveBounds(allowedNotes)
    };
  }

  // 扩音域：使用完整的扩音域音符列表
  const extendedNotes = EXTENDED_CLEF_NOTES[clef] || EXTENDED_CLEF_NOTES.treble;
  const octaveRange = EXTENDED_CLEF_OCTAVES[clef] || EXTENDED_CLEF_OCTAVES.treble;
  return {
    allowedNotes: extendedNotes,
    octaveRange
  };
};

const isNoteWithinRange = (note, { allowedSet, octaveRange }) => {
  const parsed = parseNoteString(note);
  if (!parsed) return false;
  const canonical = `${parsed.pitch}${parsed.octave}`;
  if (allowedSet) {
    return allowedSet.has(canonical);
  }
  if (octaveRange) {
    return parsed.octave >= octaveRange.min && parsed.octave <= octaveRange.max;
  }
  return true;
};

const DEFAULT_RANGE_MODE = 'standard';

export const usePractice = () => {
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [currentNotes, setCurrentNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastResult, setLastResult] = useState({ status: null, timestamp: 0 });
  const [highScores, setHighScores] = useState(() => getHighScores());
  const [lifetimeStats, setLifetimeStats] = useState(() => getUserStats());
  const [memorySummary, setMemorySummary] = useState(() => getMemorySummary());
  const [clef, setClef] = useState('treble');
  const [currentClef, setCurrentClef] = useState('treble');
  const [rangeMode, setRangeMode] = useState(DEFAULT_RANGE_MODE);
  const [ignoreOctave, setIgnoreOctave] = useState(true);
  const [questionId, setQuestionId] = useState(0);
  const [gameStats, setGameStats] = useState({
    startTime: 0,
    totalNotes: 0,
    correctNotes: 0,
    maxCombo: 0,
    totalResponseTime: 0
  });
  const chordBufferRef = useRef([]);

  const prepareNextQuestion = useCallback((memoryMap) => {
    const level = DIFFICULTY_LEVELS[difficulty];
    const focusNotes = getDueNotes(level.noteCount, memoryMap, currentClef);
    const targetClef = clef;
    const { allowedNotes, octaveRange } = getRangeConfig(rangeMode, targetClef);
    const allowedSet = allowedNotes ? new Set(allowedNotes) : null;

    const focusInRange = focusNotes.filter(note =>
      isNoteWithinRange(note, { allowedSet, octaveRange })
    );

    let notes;
    let attempts = 0;
    do {
      notes = generateNotes(difficulty, {
        focusNotes: focusInRange,
        octaveRange,
        allowedNotes,
        focusProbability: 0.1
      });
      attempts += 1;
    } while (
      attempts < 10 &&
      currentNotes.length > 0 &&
      notes.length === currentNotes.length &&
      notes.every((note, index) => note === currentNotes[index])
    );

    return { notes, clef: targetClef };
  }, [difficulty, clef, rangeMode, currentNotes]);

  const startPractice = useCallback(() => {
    const level = DIFFICULTY_LEVELS[difficulty];
    const { notes, clef: nextClef } = prepareNextQuestion();
    setCurrentNotes(notes);
    setCurrentClef(nextClef);
    setQuestionId(prev => prev + 1);
    setScore(0);
    setCombo(0);
    setIsPlaying(true);
    setTimeLeft(level.timeLimit * 1000);
    setLastResult({ status: null, timestamp: Date.now() });
    chordBufferRef.current = [];
    setMemorySummary(getMemorySummary());
    setGameStats({
      startTime: Date.now(),
      totalNotes: 0,
      correctNotes: 0,
      maxCombo: 0,
      totalResponseTime: 0
    });
  }, [difficulty, prepareNextQuestion]);

  const handleNoteInput = useCallback((note, meta = {}) => {
    if (!isPlaying) return;

    const level = DIFFICULTY_LEVELS[difficulty];
    const penalty = Math.round(level.baseScore * 0.5);
    const maxTime = level.timeLimit * 1000;

    const resolveRound = (isCorrect, questionTime = Math.max(0, Date.now() - gameStats.startTime)) => {
      const updatedMemory = recordMemoryResult(currentNotes, isCorrect, currentClef);
      setMemorySummary(getMemorySummary(updatedMemory));
      chordBufferRef.current = [];

      const resultingCombo = isCorrect ? combo + 1 : 0;

      if (isCorrect) {
        const gainedScore = calculateScore(questionTime, maxTime, true, combo, level.baseScore);
        setCombo(resultingCombo);
        setScore(prevScore => prevScore + gainedScore);
        setLastResult({ status: 'correct', timestamp: Date.now() });
      } else {
        setCombo(0);
        setScore(prevScore => prevScore - penalty);
        setLastResult({ status: 'wrong', timestamp: Date.now() });
      }

      setGameStats(prevStats => ({
        ...prevStats,
        totalNotes: prevStats.totalNotes + 1,
        correctNotes: prevStats.correctNotes + (isCorrect ? 1 : 0),
        maxCombo: Math.max(prevStats.maxCombo, resultingCombo),
        totalResponseTime: prevStats.totalResponseTime + questionTime
      }));

      setTimeLeft(level.timeLimit * 1000 + 500);

      setTimeout(() => {
        const refreshedLevel = DIFFICULTY_LEVELS[difficulty];
    const { notes: nextNotes, clef: nextClef } = prepareNextQuestion(updatedMemory);
    setCurrentNotes(nextNotes);
    setCurrentClef(nextClef);
    setQuestionId(prev => prev + 1);
        setGameStats(prevStats => ({
          ...prevStats,
          startTime: Date.now()
        }));
        setTimeLeft(refreshedLevel.timeLimit * 1000);
      }, 500);
    };

    if (note === '__TIMEOUT__') {
      resolveRound(false, maxTime);
      return;
    }

    if (level.noteCount === 1) {
      const isCorrect = checkNotes(currentNotes, [note], { ignoreOctave });
      resolveRound(isCorrect);
      return;
    }

    const now = Date.now();
    chordBufferRef.current = chordBufferRef.current
      .filter(entry => now - entry.time <= CHORD_WINDOW_MS);

    const existingIndex = chordBufferRef.current.findIndex(entry => entry.note === note);
    if (existingIndex >= 0) {
      chordBufferRef.current[existingIndex] = { note, time: now };
    } else {
      chordBufferRef.current.push({ note, time: now });
    }

    const sortedEntries = [...chordBufferRef.current].sort((a, b) => a.time - b.time);
    if (sortedEntries.length >= level.noteCount) {
      const recentEntries = sortedEntries.slice(-level.noteCount);
      const span = recentEntries[recentEntries.length - 1].time - recentEntries[0].time;
      const uniqueNotes = Array.from(new Set(recentEntries.map(entry => entry.note)));

      if (span <= CHORD_WINDOW_MS && uniqueNotes.length === level.noteCount) {
        const questionTime = Math.max(0, recentEntries[recentEntries.length - 1].time - gameStats.startTime);
        const isCorrect = checkNotes(currentNotes, uniqueNotes, { ignoreOctave });
        resolveRound(isCorrect, questionTime);
      }
    }
  }, [isPlaying, difficulty, currentNotes, combo, gameStats.startTime, prepareNextQuestion, ignoreOctave]);

  const endPractice = useCallback(() => {
    setIsPlaying(false);

    const improved = saveHighScore(difficulty, score);
    if (improved) {
      setHighScores(getHighScores());
    }

    const sessionAverage = gameStats.totalNotes ? gameStats.totalResponseTime / gameStats.totalNotes : 0;
    const updatedStats = updateUserStats({
      totalNotes: gameStats.totalNotes,
      correctNotes: gameStats.correctNotes,
      totalScore: score,
      averageTime: sessionAverage,
      maxCombo: gameStats.maxCombo
    });
    setLifetimeStats(updatedStats);
    setMemorySummary(getMemorySummary());
  }, [difficulty, score, gameStats]);

  const clearPracticeHistory = useCallback(() => {
    clearStatsData();
    clearMemoryData();
    setHighScores(getHighScores());
    setLifetimeStats(getUserStats());
    setMemorySummary(getMemorySummary());
    setMisplayedNotes([]);
    setQuestionId(0);
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            handleNoteInput('__TIMEOUT__');
            return DIFFICULTY_LEVELS[difficulty].timeLimit * 1000;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, handleNoteInput, difficulty]);

  return {
    difficulty,
    setDifficulty,
    currentNotes,
    isPlaying,
    score,
    combo,
    timeLeft,
    gameStats,
    startPractice,
    handleNoteInput,
    endPractice,
    lastResult,
    highScores,
    lifetimeStats,
    memorySummary,
    clef,
    setClef,
    currentClef,
    rangeMode,
    setRangeMode,
    ignoreOctave,
    setIgnoreOctave,
    clearPracticeHistory,
    questionId
  };
};