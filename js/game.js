/** game.js: Generate valid moves (up/down/left/right) and the shuffle from the goal to ensure solvability. */

import { cloneState, getBlankIndex, createState, statesAreEqual } from './state.js';

// Constants for movements (where the hole moves/0)
export const MOVE_UP = 'up';
export const MOVE_DOWN = 'down';
export const MOVE_LEFT = 'left';
export const MOVE_RIGHT = 'right';

const ALL_MOVES = [MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT];

/**
 * Returns an array of valid moves for a given state.
 *
 * @param {number[]} state
 * @returns {string[]} E.g., ['up', 'left', 'right']
 */
export function getValidMoves(state) {
    const blankIdx = getBlankIndex(state);
    const validMoves = [];

    // Calculate current row and column (0, 1 or 2)
    const row = Math.floor(blankIdx / 3);
    const col = blankIdx % 3;


    if (row > 0) validMoves.push(MOVE_UP);    // If the row is greater than 0, the gap can go up
    if (row < 2) validMoves.push(MOVE_DOWN);  // If the row is less than 2, the gap can go down
    if (col > 0) validMoves.push(MOVE_LEFT);  // If the column is greater than 0, the gap can go to the left
    if (col < 2) validMoves.push(MOVE_RIGHT); // If the column is less than 2, the gap can go to the right

    return validMoves;
}

/**
 * Applies a move to the state and returns a *NEW* state (without mutating the original).
 * Returns null if the move is invalid.
 *
 * @param {number[]} state
 * @param {string} move
 * @returns {number[] | null}
 */
export function applyMove(state, move) {
    const validMoves = getValidMoves(state);
    if (!validMoves.includes(move)) {
        return null;
    }

    const newState = cloneState(state);
    const blankIdx = getBlankIndex(state);
    let targetIdx;

    // Calculate the index of the token to be exchanged according to the movement
    switch (move) {
        case MOVE_UP:    targetIdx = blankIdx - 3; break;
        case MOVE_DOWN:  targetIdx = blankIdx + 3; break;
        case MOVE_LEFT:  targetIdx = blankIdx - 1; break;
        case MOVE_RIGHT: targetIdx = blankIdx + 1; break;
    }

    newState[blankIdx] = newState[targetIdx];
    newState[targetIdx] = 0;

    return newState;
}

/**
 * Generates a solvable initial state by applying random moves backwards from the goal state.
 * By shuffling from the goal, we avoid mathematically calculating "parity".
 * @param {number[]} goalState
 * @param {number} shuffleCount - Number of moves to perform
 * @returns {number[]} A new shuffled state
 */
export function generateSolvableState(goalState, shuffleCount) {
    let currentState = createState(goalState);
    let previousState = null;

    for (let i = 0; i < shuffleCount; i++) {
        const validMoves = getValidMoves(currentState);

        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]; // Choose a random move
        let nextState = applyMove(currentState, randomMove);

        // Minor optimization: avoid undoing the move we just made
        // (i.e., if we moved 'up', avoid moving 'down' immediately)
        while (previousState && statesAreEqual(nextState, previousState)) {
            randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            nextState = applyMove(currentState, randomMove);
        }

        previousState = currentState;
        currentState = nextState;
    }

    return currentState;
}
