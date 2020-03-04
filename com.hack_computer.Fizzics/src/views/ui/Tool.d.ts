import { ToolType } from "../../constants/types";
import { NavItem } from "./NavItem";
export declare class Tool extends NavItem<ToolType> {
    get activeFrame(): string;
    get defaultFrame(): string;
    select(): void;
    deselect(): void;
}
