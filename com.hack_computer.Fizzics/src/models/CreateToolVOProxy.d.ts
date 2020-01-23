import { Proxy } from "@koreez/mvcx";
import { BallType } from "../constants/types";
import { CreateToolVO } from "./CreateToolVO";
export declare class CreateToolVOProxy extends Proxy<CreateToolVO> {
    initialize(vo: CreateToolVO): void;
    updateCreateToolActiveOption(t: BallType): void;
    updateToolEnable(t: BallType, value: boolean): void;
}
