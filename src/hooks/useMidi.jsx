import { useCallback, useEffect, useRef, useState } from 'react';
import { midiNumberToNote, normalizeVelocity } from '../utils/midi';

const MIDI_NOT_SUPPORTED_ERROR = '当前浏览器不支持 Web MIDI API';

export const useMidi = ({ onNoteOn, onNoteOff } = {}) => {
  const midiAccessRef = useRef(null);
  const inputsRef = useRef(new Map());
  const stateChangeHandlerRef = useRef(null);
  const [isSupported, setIsSupported] = useState(typeof navigator !== 'undefined' && !!navigator.requestMIDIAccess);
  const [isEnabled, setIsEnabled] = useState(false);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const disconnectInputs = useCallback(() => {
    inputsRef.current.forEach((handler, input) => {
      if (input?.removeEventListener) {
        input.removeEventListener('midimessage', handler);
      } else if (input) {
        input.onmidimessage = null;
      }
    });
    inputsRef.current.clear();
  }, []);

  const handleMidiMessage = useCallback((message) => {
    const [status, noteNumber, velocity] = message?.data || [];
    if (status === undefined) return;

    const command = status & 0xf0;
    if (command === 0x90 && velocity > 0) {
      const note = midiNumberToNote(noteNumber);
      if (!note) return;
      onNoteOn?.({
        note,
        velocity: normalizeVelocity(velocity),
        rawVelocity: velocity,
        channel: status & 0x0f,
        timestamp: message.timeStamp
      });
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      const note = midiNumberToNote(noteNumber);
      if (!note) return;
      onNoteOff?.({
        note,
        velocity: normalizeVelocity(velocity),
        rawVelocity: velocity,
        channel: status & 0x0f,
        timestamp: message.timeStamp
      });
    }
  }, [onNoteOn, onNoteOff]);

  const attachListener = useCallback((input) => {
    if (!input) return;
    const handler = (event) => handleMidiMessage(event);
    if (input.addEventListener) {
      input.addEventListener('midimessage', handler);
    } else {
      input.onmidimessage = handler;
    }
    inputsRef.current.set(input, handler);
  }, [handleMidiMessage]);

  const refreshDeviceList = useCallback(() => {
    if (!midiAccessRef.current) return;
    const connectedInputs = Array.from(midiAccessRef.current.inputs.values());
    setDevices(connectedInputs.map((input) => input.name || `MIDI 设备 ${input.id}`));
    disconnectInputs();
    connectedInputs.forEach(attachListener);
  }, [attachListener, disconnectInputs]);

  const connect = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      setIsSupported(false);
      setError(MIDI_NOT_SUPPORTED_ERROR);
      return false;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      midiAccessRef.current = access;
      setIsEnabled(true);
      setError(null);
      refreshDeviceList();

      const handleStateChange = () => {
        refreshDeviceList();
      };

      stateChangeHandlerRef.current = handleStateChange;

      access.addEventListener
        ? access.addEventListener('statechange', handleStateChange)
        : (access.onstatechange = handleStateChange);

      return true;
    } catch (err) {
      setError(err?.message || '无法连接到 MIDI 设备');
      console.error('MIDI connection failed:', err);
      return false;
    }
  }, [refreshDeviceList]);

  const disconnect = useCallback(() => {
    if (!midiAccessRef.current) return;
    disconnectInputs();
    if (stateChangeHandlerRef.current) {
      if (midiAccessRef.current.removeEventListener) {
        midiAccessRef.current.removeEventListener('statechange', stateChangeHandlerRef.current);
      } else {
        midiAccessRef.current.onstatechange = null;
      }
    }
    midiAccessRef.current = null;
    stateChangeHandlerRef.current = null;
    setIsEnabled(false);
    setDevices([]);
  }, [disconnectInputs]);

  useEffect(() => () => {
    disconnect();
  }, [disconnect]);

  return {
    isSupported,
    isEnabled,
    devices,
    error,
    connect,
    disconnect
  };
};
