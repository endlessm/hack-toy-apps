import { Facade, Proxy } from "@koreez/mvcx";
import { ToolType } from "../constants/types";
import { ToolsVO } from "./ToolsVO";
export declare class ToolsVOProxy extends Proxy<ToolsVO> {
    onRegister(facade: Facade): void;
    onRemove(): void;
    initialize(): void;
    updateToolEnable(t: ToolType, value: boolean): void;
    updateToolInUse(t: ToolType, value: boolean): void;
    updateActiveTool(t: ToolType): void;
}
