/** state.js: It's the core: representing the board, cloning the state, finding the empty space. No movement logic yet. */

export const GOALS = {
    easy:   [1, 2, 3, 4, 5, 6, 7, 8, 0],
    normal: [1, 2, 3, 8, 0, 4, 7, 6, 5],
    hard:   [1, 4, 7, 2, 5, 8, 3, 6, 0],
};

/**
 * Creates or initializes a state.
 * @param {number[]} board - Array of 9 elements [0-8]
 * @returns {number[]} The initialized state
 */
export function createState(board) {
    return [...board];
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
 * @param {number[]} a
 * @param {number[]} b
 * @returns {boolean}
 */
export function statesAreEqual(a, b) {
    return a.every((v, i) => v === b[i]);
}

/**
 * Checks if the current state is equal to the goal state.
 * @param {number[]} state - Current state
 * @param {number[]} goal - Goal state based on difficulty
 * @returns {boolean}
 */
export function isGoal(state, goal) {
    return statesAreEqual(state, goal);
}

/**
 * Validates that a state has the correct format.
 * @param {number[]} state
 * @returns {boolean}
 */
export function isValidState(state) {
    return Array.isArray(state) &&
        state.length === 9 &&
        new Set(state).size === 9 &&
        state.every((n) => n >= 0 && n <= 8);
}