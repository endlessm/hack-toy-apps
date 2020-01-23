import { Facade, Mediator } from "@koreez/mvcx";
import { EffectsView } from "../../views/visuals/EffectsView";
export declare class EffectsViewMediator extends Mediator<EffectsView> {
    private _levelView;
    private _typesProxy;
    onRegister(facade: Facade): void;
    private _onLevelStart;
    private _onBallRemovedByTool;
    private _onBombCollision;
    private _onStarCollision;
    private _onDiamondCollision;
    private _getTypeConfig;
    private _getBallPosition;
}
