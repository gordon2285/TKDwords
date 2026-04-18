import { flashcards } from './data.js';

let currentIndex = 0;
let isFlipped = false;
let mode = 'en-ko'; // Options: 'ko-en' or 'en-ko'
let activeCards = [...flashcards]; // Filtered subset

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

const KUP_ORDER = ['10th Kup', '9th Kup', '8th Kup', '7th Kup', '6th Kup', '5th Kup', '4th Kup', '3rd Kup', '2nd Kup', '1st Kup'];

function applyFilter() {
    const grade = gradeFilterSelect.value;
    if (grade === 'all') {
        activeCards = [...flashcards];
    } else {
        // Include selected grade AND all lower (higher-numbered) grades
        const cutoff = KUP_ORDER.indexOf(grade);
        const included = new Set(KUP_ORDER.slice(0, cutoff + 1));
        activeCards = flashcards.filter(c => included.has(c.level));
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
});

gradeFilterSelect.addEventListener('change', () => {
    applyFilter();
});

// Initial render
updateCard();
