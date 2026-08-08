import { patterns } from '../data/patterns.js';

export class PatternsView {
    constructor() {
        this.container = null;
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
    }

    mount(parent, state) {
        this.container = document.createElement('div');
        this.container.className = 'patterns-view';
        parent.appendChild(this.container);
        
        // Add event delegation for accordion toggles
        this.container.addEventListener('click', this.handleAccordionClick);
        
        this.update(state);
    }

    unmount() {
        if (this.container) {
            this.container.removeEventListener('click', this.handleAccordionClick);
            this.container.remove();
            this.container = null;
        }
    }
    
    handleAccordionClick(e) {
        const header = e.target.closest('.accordion-header');
        if (!header) return;
        
        const item = header.closest('.accordion-item');
        if (!item) return;
        
        // Close all other items
        const allItems = this.container.querySelectorAll('.accordion-item');
        allItems.forEach(el => {
            if (el !== item) {
                el.classList.remove('active');
            }
        });
        
        // Toggle the clicked item
        item.classList.toggle('active');
    }

    update(state) {
        this.state = state;
        this.render();
    }

    renderDiagramSVG(path) {
        return `
            <svg viewBox="0 0 100 100" class="diagram-svg">
                <path d="${path}"></path>
            </svg>
        `;
    }

    render() {
        if (!this.container) return;

        const filteredPatterns = this.state.currentGrade === 'all' 
            ? patterns 
            : patterns.filter(p => p.level === this.state.currentGrade);

        if (filteredPatterns.length === 0) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <p>No patterns found for this grade.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="patterns-accordion-list">
                ${filteredPatterns.map(p => `
                    <div class="accordion-item">
                        <div class="accordion-header">
                            <div class="header-content">
                                <h3>${p.name}</h3>
                                <div class="meta">${p.level} &bull; ${p.moveCount} Moves</div>
                            </div>
                            <div class="badge">${p.koreanName}</div>
                            <div class="accordion-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                        <div class="accordion-content">
                            <div class="diagram-container">
                                ${this.renderDiagramSVG(p.diagramSvgPath)}
                            </div>
                            <div class="pattern-details">
                                <p class="starting-stance"><strong>Start:</strong> ${p.startingStance}</p>
                                <p>${p.meaning}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
