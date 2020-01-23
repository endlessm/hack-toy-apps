import { ToolType } from "../constants/types";
export declare class ToolVO {
    t: ToolType;
    enabled: boolean;
    inUse: boolean;
    constructor(toolType: ToolType);
}
