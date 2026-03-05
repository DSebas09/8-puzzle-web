/** Displays the current state (the array of 9 numbers) and draws it in the DOM */

import { getBlankIndex } from './state.js';
import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from './game.js';

// Same lookup pattern as MOVE_DELTA in game.js
const DELTA_TO_MOVE = {
    [-3]: MOVE_UP,
    [3]:  MOVE_DOWN,
    [-1]: MOVE_LEFT,
    [1]:  MOVE_RIGHT,
};


/**
 * Renders the current state of the board in an HTML container.
 * Use DocumentFragment for a single DOM reflow.
 * @param {number[]} state - The current array of the board.
 * @param {HTMLElement} container - The div where the board will be drawn.
 * @param {Function} onMove - Function to execute when the user makes a valid move.
 */
export function renderBoard(state, container, onMove) {
    const blankIdx = getBlankIndex(state);
    const fragment = document.createDocumentFragment();
    state.forEach((value, index) =>
        fragment.appendChild(createTile(value, index, blankIdx, onMove))
    );
    container.innerHTML = '';
    container.appendChild(fragment);
}

/**
 * Calculates which move ('up', 'down', 'left', 'right') a tile click represents.
 * @param {number} clickedIdx - Index of the clicked tile (0-8)
 * @param {number} blankIdx - Index of the empty space (0-8)
 * @returns {string | null} The resulting move, or null if they are not adjacent.
 */
function getMoveFromClick(clickedIdx, blankIdx) {
    const diff = clickedIdx - blankIdx;
    const col  = blankIdx % 3;
    if (diff === -1 && col === 0) return null; // Avoid left wrap-around
    if (diff ===  1 && col === 2) return null; // Avoid right wrap-around
    return DELTA_TO_MOVE[diff] ?? null;
}

/**
 * @param {number} seconds
 * @returns {string} MM:SS format
 */
function formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}

/**
 * Create an individual tile element.
 * Only register the click if a callback is provided (interactive tiles).
 * @param {number} value
 * @param {number} index
 * @param {number} blankIdx
 * @param {Function|null} onMove
 * @returns {HTMLElement}
 */
function createTile(value, index, blankIdx, onMove) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if (value === 0) {
        tile.classList.add('empty');
        return tile;
    }

    tile.textContent = value;

    if (onMove) {
        tile.addEventListener('click', () => {
            const move = getMoveFromClick(index, blankIdx);
            if (move) onMove(move);
        });
    }

    return tile;
}

/**
 * Updates the on-screen statistics text.
 * @param {number} moves - Number of moves performed
 * @param {number} time - Elapsed time in seconds
 * @param {HTMLElement} movesEl - DOM element for moves
 * @param {HTMLElement} timerEl - DOM element for the timer
 */
export function updateStats(moves, time, movesEl, timerEl) {
    if (movesEl) movesEl.textContent = moves;
    if (timerEl) timerEl.textContent = formatTime(time);
}

/**
 * Renders the target state in a thumbnail (read-only).
 * Reuses renderBoard but ensures no interactions.
 */
export function renderGoalPattern(goalState, container) {
    renderBoard(goalState, container, null);
}