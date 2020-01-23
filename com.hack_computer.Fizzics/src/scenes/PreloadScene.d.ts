import { AbstractScene } from "./AbstractScene";
export declare class PreloadScene extends AbstractScene {
    i18n: {
        initialize(config: object, cb: Function): void;
    };
    private _progressBar;
    preload(): void;
}
