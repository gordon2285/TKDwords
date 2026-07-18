import { flashcards } from './data.js';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let currentIndex = 0;
let isFlipped = false;
let mode = 'en-ko'; // Options: 'ko-en' or 'en-ko'
let activeCards = shuffleArray([...flashcards]); // Filtered subset

// DOM Elements
const cardContainer = document.getElementById('flashcard');
const languageModeSelect = document.getElementById('language-mode');
const gradeFilterSelect = document.getElementById('grade-filter');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const progressText = document.getElementById('progress-text');

const frontWord = document.getElementById('front-word');
const frontCategory = document.getElementById('front-category');
const backWord = document.getElementById('back-word');
const backCategory = document.getElementById('back-category');
const backLevel = document.getElementById('back-level');

// New Quiz DOM Elements
const tabFlashcards = document.getElementById('tab-flashcards');
const tabQuiz = document.getElementById('tab-quiz');
const viewFlashcards = document.getElementById('view-flashcards');
const viewQuiz = document.getElementById('view-quiz');

const quizActiveArea = document.getElementById('quiz-active-area');
const quizEndArea = document.getElementById('quiz-end');
const quizProgressText = document.getElementById('quiz-progress-text');
const quizScoreText = document.getElementById('quiz-score-text');
const quizCategory = document.getElementById('quiz-category');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFinalScore = document.getElementById('quiz-final-score');
const btnRestartQuiz = document.getElementById('btn-restart-quiz');

const KUP_ORDER = ['10th Kup', '9th Kup', '8th Kup', '7th Kup', '6th Kup', '5th Kup', '4th Kup', '3rd Kup', '2nd Kup', '1st Kup'];

function applyFilter() {
    const grade = gradeFilterSelect.value;
    if (grade === 'all') {
        activeCards = shuffleArray([...flashcards]);
    } else {
        // Include selected grade AND all lower (higher-numbered) grades
        const cutoff = KUP_ORDER.indexOf(grade);
        const included = new Set(KUP_ORDER.slice(0, cutoff + 1));
        activeCards = shuffleArray(flashcards.filter(c => included.has(c.level)));
    }
    currentIndex = 0;
    updateCard();
}

function updateCard() {
    if (activeCards.length === 0) {
        frontWord.textContent = 'No cards for this grade';
        frontCategory.textContent = '';
        backWord.textContent = '';
        backCategory.textContent = '';
        backLevel.textContent = '';
        progressText.textContent = '0 / 0';
        return;
    }

    const card = activeCards[currentIndex];

    // Front side features the source language
    if (mode === 'ko-en') {
        frontWord.textContent = card.korean;
        backWord.textContent = card.english;
    } else {
        frontWord.textContent = card.english;
        backWord.textContent = card.korean;
    }

    frontCategory.textContent = card.category;
    backCategory.textContent = card.category;
    backLevel.textContent = card.level;

    progressText.textContent = `${currentIndex + 1} / ${activeCards.length}`;

    // Reset flip state when card updates without transition for immediate unflip
    if (isFlipped) {
        const inner = cardContainer.querySelector('.card-inner');
        inner.style.transition = 'none';
        cardContainer.classList.remove('flipped');
        isFlipped = false;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                inner.style.transition = '';
            });
        });
    }
}

// Event Listeners
cardContainer.addEventListener('click', () => {
    if (activeCards.length === 0) return;
    isFlipped = !isFlipped;
    cardContainer.classList.toggle('flipped', isFlipped);
});

btnNext.addEventListener('click', () => {
    if (activeCards.length === 0) return;
    currentIndex = (currentIndex + 1) % activeCards.length;
    updateCard();
});

btnPrev.addEventListener('click', () => {
    if (activeCards.length === 0) return;
    currentIndex = (currentIndex - 1 + activeCards.length) % activeCards.length;
    updateCard();
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        btnNext.click();
    } else if (e.key === 'ArrowLeft') {
        btnPrev.click();
    } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        cardContainer.click();
    }
});

languageModeSelect.addEventListener('change', (e) => {
    mode = e.target.value;
    updateCard();
    if (tabQuiz.classList.contains('active')) {
        startQuiz();
    }
});

gradeFilterSelect.addEventListener('change', () => {
    applyFilter();
    if (tabQuiz.classList.contains('active')) {
        startQuiz();
    }
});

// Initial render
updateCard();

// --- QUIZ LOGIC ---
const QUIZ_LENGTH = 10;
let quizCards = [];
let currentQuizIndex = 0;
let quizScore = 0;
let wrongGuesses = 0;
let currentCorrectAnswer = null;

function switchMode(newMode) {
    if (newMode === 'flashcards') {
        tabFlashcards.classList.add('active');
        tabQuiz.classList.remove('active');
        viewFlashcards.classList.remove('hidden');
        viewQuiz.classList.add('hidden');
    } else {
        tabFlashcards.classList.remove('active');
        tabQuiz.classList.add('active');
        viewFlashcards.classList.add('hidden');
        viewQuiz.classList.remove('hidden');
        startQuiz();
    }
}

tabFlashcards.addEventListener('click', () => switchMode('flashcards'));
tabQuiz.addEventListener('click', () => switchMode('quiz'));
btnRestartQuiz.addEventListener('click', () => startQuiz());

function startQuiz() {
    quizActiveArea.classList.remove('hidden');
    quizEndArea.classList.add('hidden');
    
    // Get a random selection of up to QUIZ_LENGTH cards from the currently active filter
    let pool = shuffleArray([...activeCards]);
    quizCards = pool.slice(0, Math.min(QUIZ_LENGTH, pool.length));
    
    if (quizCards.length === 0) {
        quizQuestion.textContent = 'No cards available for this grade.';
        quizCategory.textContent = '';
        quizOptions.innerHTML = '';
        return;
    }
    
    currentQuizIndex = 0;
    quizScore = 0;
    updateQuizScoreUI();
    loadQuizQuestion();
}

function updateQuizScoreUI() {
    quizProgressText.textContent = `Question ${currentQuizIndex + 1} / ${quizCards.length}`;
    quizScoreText.textContent = `Score: ${quizScore}`;
}

function loadQuizQuestion() {
    wrongGuesses = 0;
    updateQuizScoreUI();
    
    const card = quizCards[currentQuizIndex];
    quizCategory.textContent = card.category;
    
    // Set question and answer based on language mode
    let questionText, answerText;
    if (mode === 'ko-en') {
        questionText = card.korean;
        answerText = card.english;
        currentCorrectAnswer = card.english;
    } else {
        questionText = card.english;
        answerText = card.korean;
        currentCorrectAnswer = card.korean;
    }
    
    quizQuestion.textContent = questionText;
    
    // Generate 3 incorrect options from the full flashcards deck (to ensure variety)
    let options = [answerText];
    let possibleWrong = flashcards.filter(c => {
        let text = mode === 'ko-en' ? c.english : c.korean;
        return text !== answerText;
    });
    
    possibleWrong = shuffleArray([...possibleWrong]);
    for (let i = 0; i < 3 && i < possibleWrong.length; i++) {
        options.push(mode === 'ko-en' ? possibleWrong[i].english : possibleWrong[i].korean);
    }
    
    options = shuffleArray(options);
    
    quizOptions.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleQuizGuess(opt, btn));
        quizOptions.appendChild(btn);
    });
}

function handleQuizGuess(guess, btn) {
    if (btn.disabled) return;
    
    const allBtns = Array.from(quizOptions.querySelectorAll('.quiz-btn'));
    
    if (guess === currentCorrectAnswer) {
        // Correct
        btn.classList.add('correct');
        if (wrongGuesses === 0) quizScore++;
        
        // Disable all and advance
        allBtns.forEach(b => b.disabled = true);
        setTimeout(() => advanceQuiz(), 1000);
    } else {
        // Incorrect
        btn.classList.add('incorrect');
        btn.disabled = true;
        wrongGuesses++;
        
        if (wrongGuesses >= 2) {
            // Second wrong guess, reveal correct and advance
            allBtns.forEach(b => {
                b.disabled = true;
                if (b.textContent === currentCorrectAnswer) {
                    b.classList.add('correct');
                }
            });
            setTimeout(() => advanceQuiz(), 2000);
        }
    }
}

function advanceQuiz() {
    currentQuizIndex++;
    if (currentQuizIndex >= quizCards.length) {
        endQuiz();
    } else {
        loadQuizQuestion();
    }
}

function endQuiz() {
    quizActiveArea.classList.add('hidden');
    quizEndArea.classList.remove('hidden');
    quizFinalScore.textContent = `${quizScore} / ${quizCards.length}`;
    
    // Update score circle progress
    const percentage = (quizScore / quizCards.length) * 360;
    document.querySelector('.final-score-circle').style.setProperty('--score-deg', `${percentage}deg`);
}
