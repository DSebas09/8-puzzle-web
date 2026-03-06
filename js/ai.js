/** ai.js: it involves graph search algorithms. */

import { isGoal } from './state.js';
import { getValidMoves, applyMove } from './game.js';

/** Misplaced tiles: non-blank tiles not in their goal position. (easy mode) */
export const getMisplacedTilesCount = (state, goalState) =>
    state.reduce((n, tile, i) => n + (tile !== 0 && tile !== goalState[i] ? 1 : 0), 0);

/** Manhattan distance: sum of row+col distances per non-blank tile (normal/hard mode). */
export function getManhattanDistance(state, goalState) {
    const goalPos = Object.fromEntries(goalState.map((tile, i) => [tile, i]));

    return state.reduce((sum, tile, i) => {
        if (tile === 0) return sum;
        const gi = goalPos[tile];
        return sum
            + Math.abs(Math.floor(i / 3) - Math.floor(gi / 3))
            + Math.abs((i % 3) - (gi % 3));
    }, 0);
}

const HEURISTIC = {
    easy:   getMisplacedTilesCount,
    normal: getManhattanDistance,
    hard:   getManhattanDistance,
};

/** Auxiliary class for the search tree nodes. */
class Node {
    constructor(state, parent, move, g, h) {
        this.state = state;   // Current board configuration
        this.parent = parent; // Previous node (where we came from)
        this.move = move;     // What move generated this state
        this.g = g;           // Actual cost: how many steps from the start
        this.h = h;           // Estimated cost: heuristic to the goal
        this.f = g + h;       // Total priority
    }
}

/**
 * Reconstructs the list of moves from the final node backwards.
 */
const reconstructPath = node => {
    const path = [];
    for (let n = node; n.parent; n = n.parent) path.push(n.move);
    return path.reverse();
};

/**
 * Solves the puzzle with A*.
 * Easy → Misplaced Tiles heuristic | Normal/Hard → Manhattan Distance.
 * @param {number[]} initialState
 * @param {number[]} goalState
 * @param {string}   difficulty - 'easy' | 'normal' | 'hard'
 * @returns {string[]} Ordered moves to solve the puzzle, e.g. ['up', 'left', 'down']
 */
export function solvePuzzle(initialState, goalState, difficulty) {
    if (isGoal(initialState, goalState)) return [];

    const heuristic = HEURISTIC[difficulty] ?? getManhattanDistance;
    const openList  = [new Node(initialState, null, null, 0, 0)];
    const visited   = new Set();
    let nodesExplored = 0;

    while (openList.length) {
        openList.sort((a, b) => a.f - b.f);
        const current = openList.shift();
        const key = current.state.toString();

        if (visited.has(key)) continue;
        visited.add(key);
        nodesExplored++;

        if (isGoal(current.state, goalState)) {
            console.log(`Solved! Nodes explored: ${nodesExplored}, Depth: ${current.g}`);
            return reconstructPath(current);
        }

        for (const move of getValidMoves(current.state)) {
            const next = applyMove(current.state, move);
            if (!visited.has(next.toString())) {
                const g = current.g + 1;
                openList.push(new Node(next, current, move, g, heuristic(next, goalState)));
            }
        }
    }

    return null;
}
