import { NinePatch } from "@koreez/phaser3-ninepatch";
import { INavigationConfig } from "../../constants/types";
import { NavItem } from "../ui/NavItem";
import { DynamicContainer } from "./DynamicContainer";

export class DynamicNavigation<T> extends DynamicContainer {
  public tools: Map<T, NavItem<T>>;
  protected bg: NinePatch;

  public build(config: INavigationConfig): void {
    this.tools = new Map();
    const { items, gap, padding, scale } = config;

    //@ts-ignore
    this.bg = this._createBg();
    this.add(this.bg);

    items.forEach((item: NavItem<T>, index: number) => {
      item.setY(index * gap);
      item.setScale(scale);
      item.on("onClick", this._onItemClick, this);

      this.tools.set(item.t, item);
      this.add(item);
    });

    const firstItem = Array.from(this.tools)[0][1];
    const lastItem = Array.from(this.tools)[this.tools.size - 1][1];

    const y = firstItem.y;
    const width = firstItem.displayWidth + padding.x;
    const height = y + lastItem.y + lastItem.displayHeight + padding.y;

    this.bg.resize(width, height);
    this.bg.setY(
      y + this.bg.height / 2 - firstItem.displayHeight / 2 - padding.y / 2
    );
    this.setSize(this.bg.width, this.bg.height);
  }

  public setToolActive(t: T): void {
    this.tools.forEach((tool: NavItem<T>, key: T) => {
      key === t ? tool.select() : tool.deselect();
    });
  }

  public updateToolEnable(t: T, value: boolean): void {
    const tool = this.tools.get(t);
    value ? tool.enable() : tool.disable();
  }

  public updateToolInUse(t: T, value: boolean): void {
    const tool = this.tools.get(t);
    value ? tool.show() : tool.hide();
  }

  private _onItemClick(t: T): void {
    this.emit("optionClick", t);
  }

  private _createBg(): NinePatch {
    //@ts-ignore
    return this.scene.add.ninePatch(0, 0, 0, 0, "fizzics", "tools_bg");
  }
}
