// src/data/useVosk.ts
import { useEffect, useRef, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { createModel, Model, VoskResult } from 'vosk-browser';
import {
    voiceModelStateAtom,
    isListeningAtom,
    voiceErrorAtom,
    activeVoiceComponentIdAtom,
} from './voiceAtoms';

// Singleton reference to the model to prevent reloading
let globalModel: Model | null = null;

// Custom grammar for AI Engineering (Reserved for future use)
// const AI_GRAMMAR = [ ... ]; 

export const useVosk = (componentId: string, onResult: (text: string) => void) => {
    const [modelState, setModelState] = useAtom(voiceModelStateAtom);
    const [isListening, setIsListening] = useAtom(isListeningAtom);
    const setError = useSetAtom(voiceErrorAtom);
    const [activeId, setActiveId] = useAtom(activeVoiceComponentIdAtom);

    // We only want this specific hook instance to react if it's the active one
    const isActive = activeId === componentId;

    const loadModel = useCallback(async () => {
        if (globalModel) {
            setModelState('ready');
            return;
        }

        try {
            setModelState('loading');
            setError(null);

            // The model path should be relative to the public directory
            const modelPath = '/models/vosk-model-small-en-us-0.15.zip';

            const model = await createModel(modelPath);

            globalModel = model;

            // Create a dummy recognizer to verify it works, then clean up
            const recognizer = new model.KaldiRecognizer(16000);
            recognizer.setWords(true);
            // We don't need to keep this global recognizer for now

            setModelState('ready');
        } catch (err: unknown) {
            console.error("Failed to load Vosk model:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to load speech model";
            setError(errorMessage);
            setModelState('error');
        }
    }, [setModelState, setError]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const stopListening = useCallback(() => {
        if (audioContextRef.current) {
            void audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        setIsListening(false);
        setActiveId(null);
    }, [setIsListening, setActiveId]);

    const startListening = useCallback(async () => {
        if (modelState !== 'ready' || !globalModel) {
            await loadModel();
        }

        // Re-check model state after await
        if (!globalModel) return;

        if (activeId && activeId !== componentId) {
            // Another component is listening, take over.
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate: 16000
                }
            });

            mediaStreamRef.current = stream;

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);

            // Create a recognizer instance for this session
            const recognizer = new globalModel.KaldiRecognizer(16000);

            recognizer.on("result", (message: any) => {
                const result = message.result as VoskResult;
                if (result && result.text) {
                    onResult(result.text);
                }
            });

            // Use a ScriptProcessor to extract raw PCM data
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
                // Vosk expects audio data sent to the recognizer
                recognizer.acceptWaveform(event.inputBuffer);
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

            setActiveId(componentId);
            setIsListening(true);

        } catch (err: unknown) {
            console.error("Error starting microphone:", err);
            const errorMessage = err instanceof Error ? err.message : "Microphone access denied or error occurred.";
            setError(errorMessage);
            stopListening();
        }
    }, [modelState, loadModel, activeId, componentId, setActiveId, setIsListening, setError, onResult, stopListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isActive) {
                stopListening();
            }
        };
    }, [isActive, stopListening]);

    return {
        modelState,
        isListening: isActive && isListening,
        startListening,
        stopListening,
        error: isActive ? useAtom(voiceErrorAtom)[0] : null
    };
};
