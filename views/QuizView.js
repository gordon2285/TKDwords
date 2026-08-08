import { flashcards } from '../data.js';

const QUIZ_LENGTH = 10;
const KUP_ORDER = ['10th Kup', '9th Kup', '8th Kup', '7th Kup', '6th Kup', '5th Kup', '4th Kup', '3rd Kup', '2nd Kup', '1st Kup'];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class QuizView {
    constructor() {
        this.container = null;
        this.quizCards = [];
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.wrongGuesses = 0;
        this.currentCorrectAnswer = null;
        this.lastGrade = null;
        this.currentMode = 'en-ko';
    }

    mount(container, state) {
        this.container = container;
        this.renderShell();
        this.cacheDOM();
        this.bindEvents();
        
        this.lastGrade = state.currentGrade;
        this.currentMode = state.languageMode;
        
        this.startQuiz();
    }

    renderShell() {
        this.container.innerHTML = `
            <div id="view-quiz">
                <div id="quiz-active-area">
                    <div class="quiz-header">
                        <div class="quiz-progress" id="quiz-progress-text">Question 1 / 10</div>
                        <div class="quiz-score" id="quiz-score-text">Score: 0</div>
                    </div>
                    <div class="quiz-question-container">
                        <div class="quiz-category" id="quiz-category"></div>
                        <div class="quiz-question" id="quiz-question"></div>
                    </div>
                    <div class="quiz-options" id="quiz-options">
                        <!-- Options injected by JS -->
                    </div>
                </div>
                
                <!-- Quiz End State -->
                <div class="quiz-end hidden" id="quiz-end">
                    <h2>Quiz Complete!</h2>
                    <div class="final-score-circle">
                        <span id="quiz-final-score">10 / 10</span>
                    </div>
                    <button id="btn-restart-quiz" class="btn primary">Restart Quiz</button>
                </div>
            </div>
        `;
    }

    cacheDOM() {
        this.quizActiveArea = this.container.querySelector('#quiz-active-area');
        this.quizEndArea = this.container.querySelector('#quiz-end');
        this.quizProgressText = this.container.querySelector('#quiz-progress-text');
        this.quizScoreText = this.container.querySelector('#quiz-score-text');
        this.quizCategory = this.container.querySelector('#quiz-category');
        this.quizQuestion = this.container.querySelector('#quiz-question');
        this.quizOptions = this.container.querySelector('#quiz-options');
        this.quizFinalScore = this.container.querySelector('#quiz-final-score');
        this.btnRestartQuiz = this.container.querySelector('#btn-restart-quiz');
    }

    bindEvents() {
        this.btnRestartQuiz.addEventListener('click', () => this.startQuiz());
    }

    update(state) {
        let needsRestart = false;
        
        if (this.lastGrade !== state.currentGrade) {
            this.lastGrade = state.currentGrade;
            needsRestart = true;
        }
        
        if (this.currentMode !== state.languageMode) {
            this.currentMode = state.languageMode;
            needsRestart = true;
        }

        if (needsRestart) {
            this.startQuiz();
        }
    }

    getFilteredCards(grade) {
        if (grade === 'all') {
            return shuffleArray([...flashcards]);
        }
        const cutoff = KUP_ORDER.indexOf(grade);
        const included = new Set(KUP_ORDER.slice(0, cutoff + 1));
        return shuffleArray(flashcards.filter(c => included.has(c.level)));
    }

    startQuiz() {
        this.quizActiveArea.classList.remove('hidden');
        this.quizEndArea.classList.add('hidden');
        
        let pool = this.getFilteredCards(this.lastGrade);
        this.quizCards = pool.slice(0, Math.min(QUIZ_LENGTH, pool.length));
        
        if (this.quizCards.length === 0) {
            this.quizQuestion.textContent = 'No cards available for this grade.';
            this.quizCategory.textContent = '';
            this.quizOptions.innerHTML = '';
            return;
        }
        
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.updateQuizScoreUI();
        this.loadQuizQuestion();
    }

    updateQuizScoreUI() {
        this.quizProgressText.textContent = `Question ${this.currentQuizIndex + 1} / ${this.quizCards.length}`;
        this.quizScoreText.textContent = `Score: ${this.quizScore}`;
    }

    loadQuizQuestion() {
        this.wrongGuesses = 0;
        this.updateQuizScoreUI();
        
        const card = this.quizCards[this.currentQuizIndex];
        this.quizCategory.textContent = card.category;
        
        let questionText, answerText;
        if (this.currentMode === 'ko-en') {
            questionText = card.korean;
            answerText = card.english;
            this.currentCorrectAnswer = card.english;
        } else {
            questionText = card.english;
            answerText = card.korean;
            this.currentCorrectAnswer = card.korean;
        }
        
        this.quizQuestion.textContent = questionText;
        
        let options = [answerText];
        let possibleWrong = flashcards.filter(c => {
            let text = this.currentMode === 'ko-en' ? c.english : c.korean;
            return text !== answerText;
        });
        
        possibleWrong = shuffleArray([...possibleWrong]);
        for (let i = 0; i < 3 && i < possibleWrong.length; i++) {
            options.push(this.currentMode === 'ko-en' ? possibleWrong[i].english : possibleWrong[i].korean);
        }
        
        options = shuffleArray(options);
        
        this.quizOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => this.handleQuizGuess(opt, btn));
            this.quizOptions.appendChild(btn);
        });
    }

    handleQuizGuess(guess, btn) {
        if (btn.disabled) return;
        
        const allBtns = Array.from(this.quizOptions.querySelectorAll('.quiz-btn'));
        
        if (guess === this.currentCorrectAnswer) {
            btn.classList.add('correct');
            if (this.wrongGuesses === 0) this.quizScore++;
            
            allBtns.forEach(b => b.disabled = true);
            setTimeout(() => this.advanceQuiz(), 1000);
        } else {
            btn.classList.add('incorrect');
            btn.disabled = true;
            this.wrongGuesses++;
            
            if (this.wrongGuesses >= 2) {
                allBtns.forEach(b => {
                    b.disabled = true;
                    if (b.textContent === this.currentCorrectAnswer) {
                        b.classList.add('correct');
                    }
                });
                setTimeout(() => this.advanceQuiz(), 2000);
            }
        }
    }

    advanceQuiz() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex >= this.quizCards.length) {
            this.endQuiz();
        } else {
            this.loadQuizQuestion();
        }
    }

    endQuiz() {
        this.quizActiveArea.classList.add('hidden');
        this.quizEndArea.classList.remove('hidden');
        this.quizFinalScore.textContent = `${this.quizScore} / ${this.quizCards.length}`;
        
        const percentage = (this.quizScore / this.quizCards.length) * 360;
        this.container.querySelector('.final-score-circle').style.setProperty('--score-deg', `${percentage}deg`);
    }

    unmount() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
    }
}
