import { Router } from './core/Router.js';
import { FlashcardsView } from './views/FlashcardsView.js';
import { QuizView } from './views/QuizView.js';
import { BeltsView } from './views/BeltsView.js';
import { PatternsView } from './views/PatternsView.js';

// DOM Elements
const appContent = document.getElementById('app-content');
const tabs = document.querySelectorAll('.mode-tabs .tab');
const gradeFilterSelect = document.getElementById('grade-filter');
const languageModeSelect = document.getElementById('language-mode');

// Instantiate Router
const router = new Router();

// Instantiate Views
const views = {
    'flashcards': new FlashcardsView(),
    'quiz': new QuizView(),
    'belts': new BeltsView(),
    'patterns': new PatternsView(),
    'syllabus': null // To be implemented in Ticket 006
};

let activeViewInstance = null;

// Subscribe to Router State Changes
router.subscribe((state) => {
    // 1. Update Navigation Tabs Active State
    tabs.forEach(tab => {
        if (tab.dataset.view === state.activeView) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 2. Handle View Mounting / Unmounting
    const NextView = views[state.activeView];
    
    if (activeViewInstance !== NextView) {
        if (activeViewInstance) {
            activeViewInstance.unmount();
        }
        
        activeViewInstance = NextView;
        
        if (activeViewInstance) {
            // Mount the new view
            activeViewInstance.mount(appContent, state);
        } else {
            // Placeholder for unimplemented views
            appContent.innerHTML = `<div style="padding: 2rem; text-align: center; color: #64748b;">
                <h2>${state.activeView.charAt(0).toUpperCase() + state.activeView.slice(1)} View</h2>
                <p>This section is under construction.</p>
            </div>`;
        }
    } else {
        // 3. Update existing view with new state (e.g. grade filter change)
        if (activeViewInstance) {
            activeViewInstance.update(state);
        }
    }
});

// Event Listeners for UI Shell triggering State Changes
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        router.setState({ activeView: e.target.dataset.view });
    });
});

gradeFilterSelect.addEventListener('change', (e) => {
    router.setState({ currentGrade: e.target.value });
});

languageModeSelect.addEventListener('change', (e) => {
    router.setState({ languageMode: e.target.value });
});

// Initial Render Bootstrap
router.notify();
