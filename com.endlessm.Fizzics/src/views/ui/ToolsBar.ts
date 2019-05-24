import { NinePatch } from "@koreez/phaser3-ninepatch";
import { Images } from "../../assets";
import {
  TOOLS_BAR_CREATE_TOOL_CONFIG,
  TOOLS_BAR_DELETE_TOOL_CONFIG,
  TOOLS_BAR_DRAG_TOOL_CONFIG,
  TOOLS_BAR_FLING_TOOL_CONFIG
} from "../../constants/constants";
import { BallTypes, ToolType } from "../../constants/types";
import { AbstractView } from "../AbstractView";
import { CreateToolView } from "./CreateToolView";
import { ToolView } from "./ToolView";

export class ToolsBar extends AbstractView {
  private _tools: Map<ToolType, ToolView>;

  public getTool(value: ToolType): ToolView {
    return this._tools.get(value);
  }

  public getCreateTool(): CreateToolView {
    return this.getTool(ToolType.CREATE) as CreateToolView;
  }

  public build() {
    const bgPadding = 10;
    const buttonsPadding = 8;
    const buttonHeight = 50;
    const bgHeight = 4 * buttonHeight + 3 * buttonsPadding + 2 * bgPadding;

    const bg = this._createBg(bgHeight);

    const flingTool = new ToolView(this.scene, TOOLS_BAR_FLING_TOOL_CONFIG);
    const dragTool = new ToolView(this.scene, TOOLS_BAR_DRAG_TOOL_CONFIG);
    const createTool = new CreateToolView(
      this.scene,
      TOOLS_BAR_CREATE_TOOL_CONFIG
    );
    const deleteTool = new ToolView(this.scene, TOOLS_BAR_DELETE_TOOL_CONFIG);

    Phaser.Display.Align.In.BottomCenter(deleteTool, bg, 0, -bgPadding);
    Phaser.Display.Align.To.TopCenter(
      createTool,
      deleteTool,
      0,
      buttonsPadding
    );
    Phaser.Display.Align.To.TopCenter(dragTool, createTool, 0, buttonsPadding);
    Phaser.Display.Align.To.TopCenter(flingTool, dragTool, 0, buttonsPadding);

    flingTool.on("onClick", this._onFlingToolClick, this);
    dragTool.on("onClick", this._onDragToolClick, this);
    createTool.on("onClick", this._onCreateToolClick, this);
    createTool.on("onOptionClick", this._onCreateToolOptionClick, this);
    deleteTool.on("onClick", this._onDeleteToolClick, this);

    this.add(bg);
    this.scene.add.existing(flingTool);
    this.scene.add.existing(dragTool);
    this.scene.add.existing(createTool);
    this.scene.add.existing(deleteTool);

    this.add(flingTool);
    this.add(dragTool);
    this.add(createTool);
    this.add(deleteTool);

    this._tools = new Map([
      [ToolType.FLING, flingTool],
      [ToolType.DRAG, dragTool],
      [ToolType.CREATE, createTool],
      [ToolType.DELETE, deleteTool]
    ]);
  }

  public updateToolEnable(type: ToolType, visible: boolean): void {
    const tool = this._tools.get(type);
    visible ? tool.enable() : tool.disable();
  }

  public updateActiveTool(type: ToolType): void {
    this._tools.forEach((tool: ToolView, key: ToolType) => {
      key === type ? tool.select() : tool.deselect();
    });
  }

  public updateToolInUse(type: ToolType, inUse: boolean): void {
    const tool = this._tools.get(type);
    inUse ? tool.show() : tool.hide();
  }

  // public updateToolFrame(type: ToolType, frame: string): void {
  // }

  private _onFlingToolClick(): void {
    this.emit("toolClick", ToolType.FLING);
  }

  private _onDragToolClick(): void {
    this.emit("toolClick", ToolType.DRAG);
  }

  private _onCreateToolClick(): void {
    this.emit("toolClick", ToolType.CREATE);
  }

  private _onCreateToolOptionClick(option: BallTypes): void {
    this.emit("createToolOptionClick", option);
  }

  private _onDeleteToolClick(): void {
    this.emit("toolClick", ToolType.DELETE);
  }

  private _createBg(height: number): NinePatch {
    //@ts-ignore
    const bg = this.scene.add.ninePatch(0, 0, 65, height, Images.ToolsBg.Name);
    bg.setAlpha(0.8);
    bg.setPosition(bg.width / 2, bg.height / 2);
    return bg;
  }
}
