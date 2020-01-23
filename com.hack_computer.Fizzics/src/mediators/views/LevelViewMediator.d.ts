import { DynamicMediator, Facade } from "@koreez/mvcx";
import { LevelView } from "../../views/LevelView";
export declare class LevelViewMediator extends DynamicMediator<LevelView> {
    onRegister(facade: Facade): void;
    private _onTypeRadius;
    private _onTypeGravity;
    private _onTypeBounce;
    private _onTypeFriction;
    private _onTypeFrozen;
    private _onBallFrozen;
    private _onTypeFrameIndex;
    private _onBallDraggableUpdate;
    private _onBallFlingableUpdate;
    private _onBallCollisionGroupUpdate;
    private _onBallCreate;
    private _onBallRemove;
}
