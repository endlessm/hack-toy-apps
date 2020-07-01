import { DynamicMediator, Facade } from "@koreez/mvcx";
import { ToolsBarView } from "../../views/ui/ToolsBarView";
export declare class ToolsBarViewMediator extends DynamicMediator<ToolsBarView> {
    onRegister(facade: Facade): void;
    private _onActiveToolUpdate;
    private _onToolEnableChange;
    private _onToolInUseChange;
    private _onToolClick;
}
