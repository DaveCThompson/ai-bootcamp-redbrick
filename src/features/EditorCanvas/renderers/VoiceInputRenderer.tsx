// src/features/EditorCanvas/renderers/VoiceInputRenderer.tsx
import React, { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import TextareaAutosize from 'react-textarea-autosize';
import { WidgetComponent } from '../../../types';
import { commitActionAtom } from '../../../data/promptStateAtoms';
import { useVosk } from '../../../data/useVosk';
import styles from './VoiceInputRenderer.module.css';

interface VoiceInputRendererProps {
    component: WidgetComponent;
    mode: 'canvas' | 'preview';
}

export const VoiceInputRenderer: React.FC<VoiceInputRendererProps> = ({ component, mode }) => {
    const commitAction = useSetAtom(commitActionAtom);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Local state to handle text updates smoothly before committing
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        commitAction({
            action: {
                type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES',
                payload: {
                    componentId: component.id,
                    newProperties: { content: e.target.value }
                }
            },
            message: `Updated content for ${component.properties.label || component.id}`
        });
    };

    // Callback for when Vosk gives us text
    const handleVoiceResult = (text: string) => {
        // Append the new text to the existing content
        const currentContent = component.properties.content || '';
        const newContent = currentContent ? `${currentContent} ${text}` : text;

        commitAction({
            action: {
                type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES',
                payload: {
                    componentId: component.id,
                    newProperties: { content: newContent }
                }
            },
            message: `Dictated text for ${component.properties.label || component.id}`
        });
    };

    const { isListening, startListening, stopListening, modelState, error } = useVosk(component.id, handleVoiceResult);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Styling for the mic button based on state
    const getMicColor = () => {
        if (error) return 'var(--color-danger-9)';
        if (isListening) return 'var(--color-danger-9)';
        if (modelState === 'loading') return 'var(--color-accent-9)';
        return 'var(--color-text-subtle)';
    };

    const getMicIcon = () => {
        if (error) return 'error';
        if (modelState === 'loading') return 'downloading';
        if (isListening) return 'mic_off';
        return 'mic';
    };

    return (
        <div className={styles.container}>
            {component.properties.label && !component.properties.isLabelHidden && (
                <label className={styles.label}>{component.properties.label}</label>
            )}

            <div className={styles.inputWrapper}>
                <TextareaAutosize
                    ref={textareaRef}
                    className={styles.textarea}
                    value={component.properties.content || ''}
                    onChange={handleTextChange}
                    placeholder={component.properties.placeholder || "Click the mic to start dictating..."}
                    minRows={3}
                    readOnly={mode === 'preview'}
                />

                {mode === 'canvas' && (
                    <button
                        className={`${styles.micButton} ${isListening ? styles.pulsing : ''}`}
                        onClick={toggleListening}
                        title={error || (isListening ? "Stop Dictation" : "Start Dictation")}
                        style={{ color: getMicColor() }}
                    >
                        <span className="material-symbols-rounded">{getMicIcon()}</span>
                    </button>
                )}
            </div>

            {isListening && (
                <div className={styles.statusText}>
                    Listening... (Speak clearly)
                </div>
            )}
            {modelState === 'loading' && (
                <div className={styles.statusText}>
                    Initializing secure voice engine...
                </div>
            )}
            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
        </div>
    );
};
