// src/data/snippetsAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Snippet } from '../types';

// Core atom with localStorage persistence
export const snippetsBaseAtom = atomWithStorage<Record<string, Snippet>>('ai-bootcamp-snippets', {});

// Derived list for UI (sorted alphabetically)
export const snippetListAtom = atom((get) => {
    const snippets = get(snippetsBaseAtom);
    return Object.values(snippets).sort((a, b) => a.name.localeCompare(b.name));
});

// Modal state
export const snippetModalAtom = atom<{
    isOpen: boolean;
    editingSnippetId: string | null;
}>({
    isOpen: false,
    editingSnippetId: null,
});

/**
 * CRUD Operations via Atoms
 */

// Add or Update a snippet
export const addSnippetAtom = atom(
    null,
    (get, set, snippetParams: { name: string; content: string; id?: string }) => {
        const snippets = get(snippetsBaseAtom);
        const now = new Date().toISOString();

        if (snippetParams.id && snippets[snippetParams.id]) {
            // Update
            const existing = snippets[snippetParams.id];
            const updated: Snippet = {
                ...existing,
                name: snippetParams.name,
                content: snippetParams.content,
                updatedAt: now,
            };
            set(snippetsBaseAtom, { ...snippets, [snippetParams.id]: updated });
        } else {
            // Create
            const id = crypto.randomUUID();
            const newSnippet: Snippet = {
                id,
                name: snippetParams.name,
                content: snippetParams.content,
                createdAt: now,
                updatedAt: now,
            };
            set(snippetsBaseAtom, { ...snippets, [id]: newSnippet });
        }
    }
);

// Delete a snippet
export const deleteSnippetAtom = atom(
    null,
    (get, set, id: string) => {
        const snippets = { ...get(snippetsBaseAtom) };
        delete snippets[id];
        set(snippetsBaseAtom, snippets);
    }
);

// Clear all snippets
export const clearAllSnippetsAtom = atom(
    null,
    (_get, set) => {
        set(snippetsBaseAtom, {});
    }
);
