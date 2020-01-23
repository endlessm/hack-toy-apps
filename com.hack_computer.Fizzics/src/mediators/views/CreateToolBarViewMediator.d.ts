import { DynamicMediator, Facade } from "@koreez/mvcx";
import { CreateToolBarView } from "../../views/ui/CreateToolBarView";
export declare class CreateToolBarViewMediator extends DynamicMediator<CreateToolBarView> {
    onRegister(facade: Facade): void;
    private _onOptionClick;
    private _onActiveOptionUpdate;
    private _onOptionEnableChange;
    private _onScenePointerDown;
    private _onTypeFrameIndex;
}
