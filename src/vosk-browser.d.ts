declare module 'vosk-browser' {
    export interface VoskResult {
        text: string;
        result?: Array<{
            conf: number;
            end: number;
            start: number;
            word: string;
        }>;
    }

    export interface VoskPartialResult {
        partial: string;
    }

    export interface Model {
        KaldiRecognizer: new (sampleRate: number) => KaldiRecognizer;
        terminate: () => void;
    }

    export interface KaldiRecognizer {
        on: (event: string, callback: (message: { result: VoskResult } | { partial: string }) => void) => void;
        setWords: (words: boolean) => void;
        acceptWaveform: (buffer: AudioBuffer | Float32Array) => void;
        setGrammar: (grammar: string) => void;
    }

    export function createModel(path: string): Promise<Model>;
}
