import { IHackToyApps } from "./IHackToyApps";
export declare class FizzicsGame extends Phaser.Game implements IHackToyApps {
    constructor(gameConfig: GameConfig);
    readonly flip: () => void;
    readonly reset: () => void;
    readonly saveState: (state: Object) => void;
    readonly loadState: (state: Object) => void;
    readonly globalParametersUpdate: (prop: string, val: string | number | boolean) => void;
    private readonly _proxyGlobalParameters;
}
