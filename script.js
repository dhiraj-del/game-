// DOM要素の取得
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const speedSelect = document.getElementById('speed-select');

// ゲームの状態変数
let score = 0;
let timeLimit = 30; // 30秒
let timeLeft = timeLimit;
let gameInterval;
let timerInterval;
let isGameActive = false;
let lastHole = -1; // 最後にもぐらが出たマス

// 📂 効果音の準備
const hitSound = new Audio('assets/hit.mp3'); 

// 📝 スコアを更新する関数
function updateScore() {
    scoreDisplay.textContent = score;
}

// ⏱️ タイマーを更新する関数
function updateTimer() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

// 🕳️ ランダムにもぐらを出す場所を選ぶ関数
function pickRandomHole() {
    // 0から8のランダムなインデックスを取得
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    
    // 前回と同じマスでないことを確認（ランダム性が低い場合は必要）
    if (index === lastHole) {
        return pickRandomHole(); // 再帰的に選び直す
    }
    lastHole = index;
    return hole;
}

// ⬆️ もぐらが出現する（upクラスを追加）
function appearMole() {
    if (!isGameActive) return;

    // 前に出現していたもぐらを隠す
    holes.forEach(hole => hole.classList.remove('up'));

    // 新しい穴にもぐらを出す
    const hole = pickRandomHole();
    hole.classList.add('up');
}

// 🔨 マスをクリックしたときの処理
function whack(event) {
    if (!isGameActive) return;

    const hole = event.target;
    
    // もぐらが出ていれば（upクラスがあれば）叩けたと判定
    if (hole.classList.contains('up')) {
        score++;
        updateScore();
        hole.classList.remove('up'); // もぐらをすぐに隠す
        
        // 効果音を再生
        hitSound.currentTime = 0; // 再生位置を最初に戻す
        hitSound.play();
    }
}

// ▶️ ゲーム開始処理
function startGame() {
    if (isGameActive) return; // 既にゲーム中の場合は何もしない

    isGameActive = true;
    score = 0;
    timeLeft = timeLimit;
    updateScore();
    updateTimer();
    startButton.textContent = "ゲーム中...";
    startButton.disabled = true;

    // 選択されたもぐらの表示時間（ms）を取得
    const displayTime = parseInt(speedSelect.value);

    // もぐらを一定間隔で出現させるインターバル
    gameInterval = setInterval(appearMole, displayTime);

    // タイマーインターバル
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
    }, 1000); // 1秒ごとに実行

    // 各マスにクリックイベントリスナーを設定
    holes.forEach(hole => hole.addEventListener('click', whack));
}

// ⏹️ ゲーム終了処理
function endGame() {
    isGameActive = false;
    clearInterval(gameInterval); // もぐらの出現を停止
    clearInterval(timerInterval); // タイマーを停止

    // 全てのもぐらを隠す
    holes.forEach(hole => {
        hole.classList.remove('up');
        // クリックイベントリスナーを解除 (次のゲームに備えて)
        hole.removeEventListener('click', whack);
    });

    startButton.textContent = "もう一度プレイ！";
    startButton.disabled = false;

    // 最終スコアを表示
    alert(`ゲーム終了！あなたのスコアは ${score} 点です！`);
}

// 🚀 初期設定: スタートボタンにイベントリスナーを設定
startButton.addEventListener('click', startGame);

// 初期表示を更新
updateScore();
updateTimer();