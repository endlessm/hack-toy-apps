import { BallType } from "../constants/types";
import { CreateOptionVO } from "./CreateOptionVO";
import { ToolVO } from "./ToolVO";
export declare class CreateToolVO extends ToolVO {
    options: Map<BallType, CreateOptionVO>;
    activeOption: BallType;
    constructor();
}
