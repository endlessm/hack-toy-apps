import { ToolType } from "../constants/types";
import { CreateToolVO } from "./CreateToolVO";
import { ToolVO } from "./ToolVO";
export declare class ToolsVO {
    tools: Map<ToolType, ToolVO>;
    activeTool: ToolType;
    constructor();
    readonly createTool: CreateToolVO;
}
