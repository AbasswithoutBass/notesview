const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const midiNumberToNote = number => {
  if (!Number.isFinite(number)) return null;
  const normalized = Math.max(0, Math.min(127, Math.round(number)));
  const noteIndex = normalized % 12;
  const octave = Math.floor(normalized / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
};

export const normalizeVelocity = velocity => {
  if (!Number.isFinite(velocity)) return 1;
  const clamped = Math.max(0, Math.min(velocity, 127));
  return clamped / 127;
};
