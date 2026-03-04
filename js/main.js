import { GOAL_EASY, GOAL_NORMAL, GOAL_HARD } from './state.js';
import { generateSolvableState, applyMove } from './game.js';
import {renderBoard, renderGoalPattern, updateStats} from './ui.js';
import { solvePuzzle } from './ai.js';


const board1Container = document.getElementById('board-1');
const board2Container = document.getElementById('board-2');
const goalContainer = document.getElementById('goal-board');
const stats1 = document.getElementById('stats-1');
const stats2 = document.getElementById('stats-2');

const modeSelect = document.getElementById('game-mode');
const diffSelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');

let state1 = null;
let state2 = null;
let moves1 = 0;
let moves2 = 0;
let currentGoal = GOAL_NORMAL;
let gameMode = 'HvIA'; // 'HvH' o 'HvIA'

function startGame() {
    let shuffleCount = 50;
    const diff = diffSelect.value;

    if (diff === 'easy') { currentGoal = GOAL_EASY; shuffleCount = 20; }
    else if (diff === 'normal') { currentGoal = GOAL_NORMAL; shuffleCount = 50; }
    else if (diff === 'hard') { currentGoal = GOAL_HARD; shuffleCount = 100; }

    gameMode = modeSelect.value;

    renderGoalPattern(currentGoal, goalContainer);

    const initialState = generateSolvableState(currentGoal, shuffleCount);
    state1 = [...initialState];
    state2 = [...initialState];
    moves1 = 0;
    moves2 = 0;

    updateBoard1();
    updateBoard2();

    updateStats(moves1, 0, stats1, null);
    updateStats(moves2, 0, stats2, null);

    // If it's against AI, start the process.
    if (gameMode === 'HvIA') {
        runAI(initialState, currentGoal, diff);
    }
}

function updateBoard1() {
    renderBoard(state1, board1Container, (moveDirection) => {
        const newState = applyMove(state1, moveDirection);
        if (newState) {
            state1 = newState;
            moves1++;
            updateStats(moves1, 0, stats1, null);
            updateBoard1();
            checkWin(state1, 1);
        }
    });
}

function updateBoard2() {
    // If it's AI mode, we don't pass a callback (the user cannot click on board 2)
    const onMove = gameMode === 'HvH' ? (moveDirection) => {
        const newState = applyMove(state2, moveDirection);
        if (newState) {
            state2 = newState;
            moves2++;
            updateStats(moves2, 0, stats2, null);
            updateBoard2();
            checkWin(state2, 2);
        }
    } : null;

    renderBoard(state2, board2Container, onMove);
}

// AI Engine
function runAI(initialState, goal, difficulty) {
    const solution = solvePuzzle(initialState, goal, difficulty);

    if (!solution) return;

    let step = 0;
    // We use setInterval to animate the AI by moving one piece at a time
    // TODO: ADJUST THE INTERVAL DEPENDING ON THE DIFFICULTY
    const aiInterval = setInterval(() => {
        // Si el humano ganó primero, detenemos la IA
        if (state1.toString() === currentGoal.toString()) {
            clearInterval(aiInterval);
            return;
        }

        const move = solution[step];
        state2 = applyMove(state2, move);
        moves2++;
        updateStats(moves2, 0, stats2, null);
        updateBoard2();

        step++;

        if (step >= solution.length) {
            clearInterval(aiInterval);
            checkWin(state2, 'IA');
        }
    }, 500);
}

// Victory Condition
function checkWin(state, player) {
    if (state.toString() === currentGoal.toString()) {
        setTimeout(() => alert(`¡El Jugador ${player} ha ganado!`), 100);
    }
}


startBtn.addEventListener('click', startGame);
