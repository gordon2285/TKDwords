export class Router {
    constructor(initialState = {}) {
        this.state = {
            activeView: 'flashcards',
            currentGrade: 'all',
            languageMode: 'en-ko',
            ...initialState
        };
        this.listeners = [];
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }
}
