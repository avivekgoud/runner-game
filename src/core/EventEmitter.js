/**
 * Simple, high-performance EventEmitter for decoupled game communication.
 */
export class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return () => this.off(event, callback);
    }

    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    off(event, callback) {
        const list = this.listeners.get(event);
        if (list) {
            list.delete(callback);
            if (list.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    emit(event, ...args) {
        const list = this.listeners.get(event);
        if (list) {
            for (const cb of list) {
                try {
                    cb(...args);
                } catch (err) {
                    console.error(`Error in event listener for "${event}":`, err);
                }
            }
        }
    }

    clear() {
        this.listeners.clear();
    }
}

export const events = new EventEmitter();
