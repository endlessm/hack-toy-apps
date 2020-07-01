export interface IHackToyApps {
    flip(): void;
    reset(): void;
    saveState(state: Object): void;
    loadState(state: Object): void;
}
