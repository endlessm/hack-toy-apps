import { DynamicMediator, Facade } from "@koreez/mvcx";
import { FlingerView } from "../../views/balls/FlingerView";
export declare class FlingerViewMediator extends DynamicMediator<FlingerView> {
    onRegister(facade: Facade): void;
    private _onBallFlingEnabled;
    private _onFlingEnd;
    private _onFlingReset;
    private _onBallDistanceReached;
    private _onFlingDistanceChange;
    private _onFlingStart;
    private _cleanup;
}
