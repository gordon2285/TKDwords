import { flashcards } from '../data.js';

const KUP_ORDER = ['10th Kup', '9th Kup', '8th Kup', '7th Kup', '6th Kup', '5th Kup', '4th Kup', '3rd Kup', '2nd Kup', '1st Kup'];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class FlashcardsView {
    constructor() {
        this.container = null;
        this.currentIndex = 0;
        this.isFlipped = false;
        this.activeCards = [];
        this.boundKeydown = this.handleKeydown.bind(this);
    }

    mount(container, state) {
        this.container = container;
        this.renderShell();
        this.cacheDOM();
        this.bindEvents();
        
        // Add global keydown listener when mounted
        document.addEventListener('keydown', this.boundKeydown);
        
        this.update(state);
    }

    renderShell() {
        this.container.innerHTML = `
            <div id="view-flashcards">
                <div class="card-container" id="flashcard">
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="card-category" id="front-category"></div>
                            <div class="card-word" id="front-word"></div>
                            <div class="card-hint">Tap to flip</div>
                        </div>
                        <div class="card-back">
                            <div class="card-category" id="back-category"></div>
                            <div class="card-word" id="back-word"></div>
                            <div class="card-level" id="back-level"></div>
                        </div>
                    </div>
                </div>

                <div class="controls-bottom">
                    <button id="btn-prev" class="btn secondary">Previous</button>
                    <div class="progress" id="progress-text">0 / 0</div>
                    <button id="btn-next" class="btn primary">Next</button>
                </div>
            </div>
        `;
    }

    cacheDOM() {
        this.cardContainer = this.container.querySelector('#flashcard');
        this.btnPrev = this.container.querySelector('#btn-prev');
        this.btnNext = this.container.querySelector('#btn-next');
        this.progressText = this.container.querySelector('#progress-text');
        
        this.frontWord = this.container.querySelector('#front-word');
        this.frontCategory = this.container.querySelector('#front-category');
        this.backWord = this.container.querySelector('#back-word');
        this.backCategory = this.container.querySelector('#back-category');
        this.backLevel = this.container.querySelector('#back-level');
    }

    bindEvents() {
        this.cardContainer.addEventListener('click', () => {
            if (this.activeCards.length === 0) return;
            this.isFlipped = !this.isFlipped;
            this.cardContainer.classList.toggle('flipped', this.isFlipped);
        });

        this.btnNext.addEventListener('click', () => {
            if (this.activeCards.length === 0) return;
            this.currentIndex = (this.currentIndex + 1) % this.activeCards.length;
            this.updateCardUI();
        });

        this.btnPrev.addEventListener('click', () => {
            if (this.activeCards.length === 0) return;
            this.currentIndex = (this.currentIndex - 1 + this.activeCards.length) % this.activeCards.length;
            this.updateCardUI();
        });
    }

    handleKeydown(e) {
        if (!this.container) return; // Ensure we are mounted
        if (e.key === 'ArrowRight') {
            this.btnNext.click();
        } else if (e.key === 'ArrowLeft') {
            this.btnPrev.click();
        } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.cardContainer.click();
        }
    }

    update(state) {
        // State updates logic
        // Whenever grade or mode changes, we might need to recalculate cards if grade changed
        if (this.lastGrade !== state.currentGrade) {
            this.lastGrade = state.currentGrade;
            this.applyFilter(state.currentGrade);
        }
        
        this.currentMode = state.languageMode;
        this.updateCardUI();
    }

    applyFilter(grade) {
        if (grade === 'all') {
            this.activeCards = shuffleArray([...flashcards]);
        } else {
            // Include selected grade AND all lower (higher-numbered) grades
            const cutoff = KUP_ORDER.indexOf(grade);
            const included = new Set(KUP_ORDER.slice(0, cutoff + 1));
            this.activeCards = shuffleArray(flashcards.filter(c => included.has(c.level)));
        }
        this.currentIndex = 0;
    }

    updateCardUI() {
        if (this.activeCards.length === 0) {
            this.frontWord.textContent = 'No cards for this grade';
            this.frontCategory.textContent = '';
            this.backWord.textContent = '';
            this.backCategory.textContent = '';
            this.backLevel.textContent = '';
            this.progressText.textContent = '0 / 0';
            return;
        }

        const card = this.activeCards[this.currentIndex];

        // Front side features the source language
        if (this.currentMode === 'ko-en') {
            this.frontWord.textContent = card.korean;
            this.backWord.textContent = card.english;
        } else {
            this.frontWord.textContent = card.english;
            this.backWord.textContent = card.korean;
        }

        this.frontCategory.textContent = card.category;
        this.backCategory.textContent = card.category;
        this.backLevel.textContent = card.level;

        this.progressText.textContent = `${this.currentIndex + 1} / ${this.activeCards.length}`;

        // Reset flip state when card updates without transition for immediate unflip
        if (this.isFlipped) {
            const inner = this.cardContainer.querySelector('.card-inner');
            inner.style.transition = 'none';
            this.cardContainer.classList.remove('flipped');
            this.isFlipped = false;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    inner.style.transition = '';
                });
            });
        }
    }

    unmount() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
        document.removeEventListener('keydown', this.boundKeydown);
    }
}
