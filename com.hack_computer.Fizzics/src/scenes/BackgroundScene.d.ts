import { AbstractScene } from "./AbstractScene";
export declare class BackgroundScene extends AbstractScene {
    private _bg;
    build(): void;
    updateBackground(imageIndex: number): void;
    private _buildBg;
}
