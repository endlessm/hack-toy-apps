import { DynamicMediator, Facade } from "@koreez/mvcx";
import { LevelBarView } from "../../views/ui/LevelBarView";
export declare class LevelBarViewMediator extends DynamicMediator<LevelBarView> {
    onRegister(facade: Facade): void;
    private _onLevelStart;
    private _onLevelDiamondsUpdate;
    private _onLevelFlingsUpdate;
    private _onLevelStateUpdate;
    private _checkForButtonsState;
    private _onPrevLevel;
    private _onNextLevel;
    private _onRetryLevel;
    private _sendLevelSwitchNotification;
}
