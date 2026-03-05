/** game.js: Generate valid moves (up/down/left/right) and the shuffle from the goal to ensure solvability. */

import { getBlankIndex, createState } from './state.js';

const MOVE_DELTA = { up: -3, down: +3, left: -1, right: +1 };

const IS_INVALID = {
    up:    (row, _c) => row === 0,
    down:  (row, _c) => row === 2,
    left:  (_r, col) => col === 0,
    right: (_r, col) => col === 2,
};

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

export const MOVE_UP    = 'up';
export const MOVE_DOWN  = 'down';
export const MOVE_LEFT  = 'left';
export const MOVE_RIGHT = 'right';

export const MOVES = [MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT];

/**
 * Returns valid moves for the blank tile in the given state.
 * @param {number[]} state
 * @returns {string[]}
 */
export function getValidMoves(state) {
    const blank = getBlankIndex(state);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    return MOVES.filter(m => !IS_INVALID[m](row, col));
}

/**
 * Applies a move and returns a NEW state. Returns null if invalid.
 * @param {number[]} state
 * @param {string} move
 * @returns {number[] | null}
 */
export function applyMove(state, move) {
    const blank = getBlankIndex(state);
    const row = Math.floor(blank / 3);
    const col = blank % 3;

    if (!MOVE_DELTA[move] || IS_INVALID[move](row, col)) return null;

    const next = createState(state);
    const target = blank + MOVE_DELTA[move];
    [next[blank], next[target]] = [next[target], 0];
    return next;
}

/**
 * Generates a solvable state by shuffling from the goal.
 * Avoids immediate backtracking using the OPPOSITE map.
 * @param {number[]} goalState
 * @param {number} shuffleCount
 * @returns {number[]}
 */
export function generateSolvableState(goalState, shuffleCount) {
    let state = createState(goalState);
    let lastMove = null;

    for (let i = 0; i < shuffleCount; i++) {
        const moves = getValidMoves(state).filter(m => m !== OPPOSITE[lastMove]);
        lastMove = moves[Math.floor(Math.random() * moves.length)];
        state = applyMove(state, lastMove);
    }

    return state;
}
