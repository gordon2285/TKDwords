import { belts } from '../data/belts.js';

export class BeltsView {
    constructor() {
        this.container = null;
    }

    mount(parent, state) {
        this.container = document.createElement('div');
        this.container.className = 'belts-view';
        parent.appendChild(this.container);
        this.update(state);
    }

    unmount() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }

    update(state) {
        this.state = state;
        this.render();
    }

    render() {
        if (!this.container) return;

        // The TAGB variant doesn't have meanings for stripe belts (tag belts), only full colors.
        // We filter out any belt that has a stripeHex.
        const fullColorBelts = belts.filter(b => !b.stripeHex);
        
        const filteredBelts = this.state.currentGrade === 'all' 
            ? fullColorBelts 
            : fullColorBelts.filter(b => b.rank === this.state.currentGrade);

        if (filteredBelts.length === 0) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <p>No full color belt found for this rank.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="belts-grid">
                ${filteredBelts.map(belt => `
                    <div class="belt-card">
                        <div class="belt-visual" style="background-color: ${belt.colorHex}">
                        </div>
                        <div class="belt-info">
                            <h3>${belt.name}</h3>
                            <div class="korean">${belt.korean} (${belt.rank})</div>
                            <p>${belt.meaning}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
