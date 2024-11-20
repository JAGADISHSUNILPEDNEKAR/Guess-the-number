// Global Variables
let cnum, attempts, scores, currentPlayer, currentRound, players, rounds;
const singlePlayerDiv = document.getElementById("singlePlayer");
const multiPlayerDiv = document.getElementById("multiPlayer");
const multiFormDiv = document.getElementById("multiPlayerForm");
const winnerDiv = document.getElementById("winner");
const modeSelectionDiv = document.getElementById("modeSelection");

// Initialize Game
function initGame() {
    switchView(modeSelectionDiv);
}

// Switch View Function
function switchView(view) {
    document.querySelectorAll(".container").forEach((div) => (div.style.display = "none"));
    view.style.display = "block";
}

// Single Player Mode
function startSinglePlayer() {
    cnum = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById("singleAttempts").textContent = "0";
    document.getElementById("singleInp").value = "";
    document.getElementById("singleMsg").textContent = "";
    switchView(singlePlayerDiv);
}

function singlePlayerGuess() {
    const guess = parseInt(document.getElementById("singleInp").value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById("singleMsg").textContent = "Enter a valid number (1-100).";
        return;
    }

    attempts++;
    document.getElementById("singleAttempts").textContent = attempts;

    if (guess === cnum) {
        const classification = classifyPlayer(attempts);
        document.getElementById("singleMsg").innerHTML = `🎉 Congratulations! You guessed it in ${attempts} attempts. <br>${classification}`;
        startFireworks(attempts);  // Pass attempts to control fireworks
    } else {
        document.getElementById("singleMsg").textContent = guess > cnum ? "Too High!" : "Too Low!";
    }
}

// Multiplayer Mode
function startMultiPlayer() {
    players = parseInt(document.getElementById("playerCount").value);
    rounds = parseInt(document.getElementById("roundCount").value);

    if (isNaN(players) || isNaN(rounds) || players < 2 || rounds < 1) {
        alert("Enter valid numbers for players and rounds!");
        return;
    }

    scores = Array(players).fill(0);
    currentPlayer = 1;
    currentRound = 1;
    cnum = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    document.getElementById("multiMsg").textContent = "";
    document.getElementById("multiInp").value = "";
    document.getElementById("currentPlayer").textContent = currentPlayer;
    document.getElementById("currentRound").textContent = currentRound;
    document.getElementById("multiAttempts").textContent = attempts;

    updateScoreboard();
    switchView(multiPlayerDiv);
}

// Multiplayer Guess
function multiPlayerGuess() {
    const guess = parseInt(document.getElementById("multiInp").value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById("multiMsg").textContent = "Enter a valid number (1-100).";
        return;
    }

    attempts++;
    document.getElementById("multiAttempts").textContent = attempts;

    if (guess === cnum) {
        const points = Math.max(100 - (attempts - 1) * 10, 10);
        const classification = classifyPlayer(attempts);

        document.getElementById("multiMsg").innerHTML = `🎉 Player ${currentPlayer} guessed correctly and scored ${points} points! <br>${classification}`;
        scores[currentPlayer - 1] += points;
        startFireworks(attempts);  // Pass attempts to control fireworks

        if (currentPlayer < players) {
            currentPlayer++;
        } else if (currentRound < rounds) {
            currentPlayer = 1;
            currentRound++;
        } else {
            declareWinner();
            return;
        }

        cnum = Math.floor(Math.random() * 100) + 1;
        attempts = 0;

        document.getElementById("currentPlayer").textContent = currentPlayer;
        document.getElementById("currentRound").textContent = currentRound;
        document.getElementById("multiInp").value = "";
        document.getElementById("multiAttempts").textContent = attempts;

        updateScoreboard();
    } else {
        document.getElementById("multiMsg").textContent = guess > cnum ? "Too High!" : "Too Low!";
    }
}

// Utility Functions
function classifyPlayer(attempts) {
    if (attempts <= 3) return "You're a Pro!";
    if (attempts <= 6) return "You're an Intermediate Player!";
    if (attempts <= 9) return "You're a Beginner!";
    return "You're a Noob!";
}

function startFireworks(attempts) {
    let duration = 4 * 1000;  // Default fireworks duration (2 seconds)
    let color = "#ffeb3b";  // Default yellow color

    if (attempts <= 3) {
        duration = 10 * 1000;  // Longer fireworks for Pro
        color = "#00ff00";  // Green for Pro
    } else if (attempts > 9) {
        duration = 2 * 1000;  // Shorter fireworks for Noob
        color = "#ff0000";  // Red for Noob
    } else if (attempts <= 6) {
        duration = 7 * 1000;  // Standard duration for Intermediate
        color = "#ff8c00";  // Orange for Intermediate
    }

    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 5,
            spread: 55,
            origin: { x: 0 },
            colors: [color]
        });
        confetti({
            particleCount: 5,
            spread: 55,
            origin: { x: 1 },
            colors: [color]
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };

    frame();
}

function updateScoreboard() {
    const scoreboard = document.getElementById("scoreboardContent");
    scoreboard.innerHTML = scores
        .map((score, index) => `<p>Player ${index + 1}: ${score} points</p>`)
        .join("");
}

function declareWinner() {
    const maxScore = Math.max(...scores);
    const winners = scores.map((score, index) => (score === maxScore ? `Player ${index + 1}` : null)).filter(Boolean).join(", ");
    document.getElementById("winnerMsg").innerHTML = `🎉 The winner is ${winners} with ${maxScore} points!`;
    switchView(winnerDiv);
}

// Event Listeners
document.getElementById("singlePlayerBtn").addEventListener("click", startSinglePlayer);
document.getElementById("singleSubmit").addEventListener("click", singlePlayerGuess);
document.getElementById("multiPlayerBtn").addEventListener("click", () => switchView(multiFormDiv));
document.getElementById("startMultiGameBtn").addEventListener("click", startMultiPlayer);
document.getElementById("multiSubmit").addEventListener("click", multiPlayerGuess);
document.querySelectorAll(".restartBtn").forEach((btn) => btn.addEventListener("click", initGame));

// Initialize
initGame();
