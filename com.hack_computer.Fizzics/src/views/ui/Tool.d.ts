import { ToolType } from "../../constants/types";
import { NavItem } from "./NavItem";
export declare class Tool extends NavItem<ToolType> {
    readonly activeFrame: string;
    readonly defaultFrame: string;
    select(): void;
    deselect(): void;
}
