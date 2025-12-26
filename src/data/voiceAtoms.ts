// src/data/voiceAtoms.ts
import { atom } from 'jotai';

export type VoiceModelState = 'idle' | 'loading' | 'ready' | 'error';

export const voiceModelStateAtom = atom<VoiceModelState>('idle');
export const voiceModelLoadProgressAtom = atom<number>(0);
export const isListeningAtom = atom<boolean>(false);
export const voiceErrorAtom = atom<string | null>(null);

// Atom to track which component is currently "listening"
// If null, no component is listening.
export const activeVoiceComponentIdAtom = atom<string | null>(null);
