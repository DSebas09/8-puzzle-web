/** state.js: It's the core: representing the board, cloning the state, finding the empty space. No movement logic yet. */

export const GOAL_EASY   = [1, 2, 3, 4, 5, 6, 7, 8, 0];
export const GOAL_NORMAL = [1, 2, 3, 8, 0, 4, 7, 6, 5];
export const GOAL_HARD   = [1, 4, 7, 2, 5, 8, 3, 6, 0];

/**
 * Creates or initializes a state.
 * @param {number[]} boardArray - Array of 9 elements [0-8]
 * @returns {number[]} The initialized state
 */
export function createState(boardArray) {
    return [...boardArray];
}

/**
 * Clones the state to maintain function purity and prevent mutations (crucial for AI).
 * @param {number[]} state - Array of 9 elements
 * @returns {number[]} New cloned array
 */
export function cloneState(state) {
    return [...state];
}

/**
 * Find the position of the empty space (0) on the board.
 * @param {number[]} state - Array of 9 elements
 * @returns {number} Index of 0 (between 0 and 8)
 */
export function getBlankIndex(state) {
    return state.indexOf(0);
}

/**
 * Checks if two states are exactly the same.
 * Since these are small flat arrays (9 elements), a traditional or 'every' loop is very fast.
 * @param {number[]} stateA
 * @param {number[]} stateB
 * @returns {boolean}
 */
export function statesAreEqual(stateA, stateB) {
    for (let i = 0; i < 9; i++) {
        if (stateA[i] !== stateB[i]) return false;
    }
    return true;
}

/**

 * Checks if the current state is equal to the goal state.
 * @param {number[]} state - Current state
 * @param {number[]} goalState - Goal state based on difficulty
 * @returns {boolean}
 */
export function isGoal(state, goalState) {
    return statesAreEqual(state, goalState);
}

/**

 * Validates that a state has the correct format.
 * @param {number[]} state
 * @returns {boolean}
 */
export function isValidState(state) {
    if (!Array.isArray(state) || state.length !== 9) return false;

    // It must contain exactly the numbers from 0 to 8 without repetition
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].every(num => state.includes(num));
}
