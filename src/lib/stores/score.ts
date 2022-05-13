import { writable } from 'svelte-local-storage-store';

export const score = writable('score', 0);
