
import { GOALS, isGoal }                              from './state.js';
import { generateSolvableState, applyMove }           from './game.js';
import { renderBoard, renderGoalPattern, updateStats } from './ui.js';
import { solvePuzzle }                                from './ai.js';

// Config by difficulty

const DIFFICULTY = {
    easy:   { goal: GOALS.easy,   shuffles: 20,  aiDelay: 2000 },
    normal: { goal: GOALS.normal, shuffles: 50,  aiDelay: 1500 },
    hard:   { goal: GOALS.hard,   shuffles: 100, aiDelay: 500 },
};


const DOM = {
    boards:   [document.getElementById('board-1'),  document.getElementById('board-2')],
    stats:    [document.getElementById('stats-1'),  document.getElementById('stats-2')],
    timers:   [document.getElementById('timer-1'),  document.getElementById('timer-2')],
    goal:      document.getElementById('goal-board'),
    mode:      document.getElementById('game-mode'),
    diff:      document.getElementById('difficulty'),
    startBtn:  document.getElementById('start-btn'),
};

let session = null;

function createSession(initialState, goal, mode) {
    const makePlayer = () => ({ state: [...initialState], moves: 0 });
    return { goal, mode, over: false, aiIntervalID: null, players: [makePlayer(), makePlayer()] };
}

function clearAll() {
    if (session?.aiIntervalID) clearInterval(session.aiIntervalID);
}

function renderPlayer(i) {
    const interactive = i === 0 || session.mode === 'HvH';
    renderBoard(session.players[i].state, DOM.boards[i], interactive ? move => onMove(i, move) : null);
}

function onMove(i, move) {
    if (session.over) return;

    const p = session.players[i];
    const next = applyMove(p.state, move);
    if (!next) return;

    p.state = next;
    p.moves++;

    updateStats(p.moves, 0, DOM.stats[i], null);
    renderPlayer(i);
    checkWin(i);
}

function runAI(initialState, diff) {
    const { goal, aiDelay } = DIFFICULTY[diff];
    const solution = solvePuzzle(initialState, goal, diff);

    if (!solution?.length) return;
    const p = session.players[1];
    let step = 0;

    session.aiIntervalID = setInterval(() => {
        // Stop the AI if the game is over or if the human (Player 0) has already reached the goal
        if (session.over || isGoal(session.players[0].state, session.goal)) {
            clearAll();
            return;
        }

        p.state = applyMove(p.state, solution[step++]);
        p.moves++;

        updateStats(p.moves, 0, DOM.stats[1], null);
        renderPlayer(1);

        if (step >= solution.length) {
            clearAll();
            checkWin(1);
        }
    }, aiDelay);
}

function checkWin(i) {
    if (!isGoal(session.players[i].state, session.goal)) return;

    session.over = true;
    clearAll();

    const winner = i === 0 ? 'Jugador 1' : (session.mode === 'HvH' ? 'Jugador 2' : 'la IA');
    setTimeout(() => alert(`¡${winner} ha ganado!`), 100);
}

function startGame() {
    clearAll();

    const diff = DOM.diff.value;
    const mode = DOM.mode.value;
    const { goal, shuffles } = DIFFICULTY[diff];
    const initialState = generateSolvableState(goal, shuffles);

    session = createSession(initialState, goal, mode);

    renderGoalPattern(goal, DOM.goal);

    renderPlayer(0);
    renderPlayer(1);
    updateStats(0, 0, DOM.stats[0], null);
    updateStats(0, 0, DOM.stats[1], null);

    if (mode === 'HvIA') runAI(initialState, diff);
}

DOM.startBtn.addEventListener('click', startGame);