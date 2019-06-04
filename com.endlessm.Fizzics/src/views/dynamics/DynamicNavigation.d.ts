import { NinePatch } from "@koreez/phaser3-ninepatch";
import { INavigationConfig } from "../../constants/types";
import { NavItem } from "../ui/NavItem";
import { DynamicContainer } from "./DynamicContainer";
export declare class DynamicNavigation<T> extends DynamicContainer {
    tools: Map<T, NavItem<T>>;
    protected bg: NinePatch;
    build(config: INavigationConfig): void;
    setToolActive(t: T): void;
    updateToolEnable(t: T, value: boolean): void;
    updateToolInUse(t: T, value: boolean): void;
    private _onItemClick;
    private _createBg;
}
