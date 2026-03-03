/** Displays the current state (the array of 9 numbers) and draws it in the DOM */

import { getBlankIndex } from './state.js';
import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from './game.js';

/**
 * Renders the current state of the board in an HTML container.
 *
 * @param {number[]} state - The current array of the board.
 * @param {HTMLElement} container - The div where the board will be drawn.
 * @param {Function} onMoveCallback - Function to execute when the user makes a valid move.
 */
export function renderBoard(state, container, onMoveCallback) {
    container.innerHTML = '';
    const blankIdx = getBlankIndex(state);

    state.forEach((tileValue, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        if (tileValue === 0) {
            tile.classList.add('empty');
        } else {
            tile.textContent = tileValue;

            // Click event: if the touched tile is adjacent to 0, try to move
            tile.addEventListener('click', () => {
                const moveDirection = getMoveFromClick(index, blankIdx);
                if (moveDirection && onMoveCallback) {
                    onMoveCallback(moveDirection);
                }
            });
        }
        container.appendChild(tile);
    });
}

/**
 * Calculates which move ('up', 'down', 'left', 'right') a tile click represents.
 *
 * @param {number} clickedIdx - Index of the clicked tile (0-8)
 * @param {number} blankIdx - Index of the empty space (0-8)
 * @returns {string | null} The resulting move, or null if they are not adjacent.
 */
function getMoveFromClick(clickedIdx, blankIdx) {
    if (clickedIdx === blankIdx - 3) return MOVE_UP;
    if (clickedIdx === blankIdx + 3) return MOVE_DOWN;
    if (clickedIdx === blankIdx - 1 && blankIdx % 3 !== 0) return MOVE_LEFT;
    if (clickedIdx === blankIdx + 1 && (blankIdx + 1) % 3 !== 0) return MOVE_RIGHT;

    return null; // Invalid click (non-adjacent tile)
}

/**
 * Updates the on-screen statistics text.
 *
 * @param {number} moves - Number of moves performed
 * @param {number} time - Elapsed time in seconds
 * @param {HTMLElement} movesEl - DOM element for moves
 * @param {HTMLElement} timerEl - DOM element for the timer
 */
export function updateStats(moves, time, movesEl, timerEl) {
    if (movesEl) movesEl.textContent = moves;
    if (timerEl) {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        timerEl.textContent = `${minutes}:${seconds}`;
    }
}
