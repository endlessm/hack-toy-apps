/*
 * Copyright © 2020 Endless OS Foundation LLC.
 *
 * This file is part of hack-toy-apps
 * (see https://github.com/endlessm/hack-toy-apps).
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
class UserInterface {
  constructor() {
    this.lang = lang;
    this.layer = new Layer();
    this.mask = new Mask();
    this.isHover = false;
    this.isShowDialog = false;

    this._currentMessageIndex = 0;
    this._isAnimationRunning = true;
    this._currentAreaId = null;
    this._subSystems = {
      "cursor": {element: "#cursor", children: ".cursor"},
      "window": {element: "#window-manager", children: ".window"},
      "memory": {element: "#memory-manager", children: ".memory"},
      "file": {element: "#file-system", children: ".file"},
      "dev": {element: "#dev-null", children: ".dev"},
      "kernel": {element: "#kernel", children: null},
      "clock": {element: "#clock", children: null},
      "daemons": {element: ".ui__daemon", children: ".Animation"},
      "system": {element: "#system", children: null},
    }
    this.applyHoverInteraction();

    $(".bg-sys").hover(function() {
      Sounds.playLoop("system/background/front");
    }, function() {
      Sounds.terminate("system/background/front");
    });

    $(".whole").click((event) => {
      if (this.isShowDialog) {
        this.layer.element.trigger("click"); return;
      }
      const targetElement = $(event.currentTarget);
      this.showDialog($(targetElement).data("id"));
      this.mask.show($(targetElement).data("id"));
    });

    $(".ui__daemon").click((event) => {
      if (this.isShowDialog) {
        this.layer.element.trigger("click"); return;
      }
      const targetElement = $(event.currentTarget);
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__area").click((event) => {
      if (this.isShowDialog) {
        this.layer.element.trigger("click"); return;
      }
      const targetElement = $(event.currentTarget);
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__layer-close").click(this.hideDialog.bind(this));
    $(".ui__layer-title").click(this.hideDialog.bind(this));

    $(".ui__layer").on("click", (event) => {
      const classTarget = $(event.target).attr("class");

      function isTarget(classTarget) {
        return ["ui__layer", "ui__box", "clearfix", "ui__box-name", "ui__layer-col"].includes(classTarget);
      }

      if (!isTarget(classTarget)) {
        return false;
      }

      if (this._isShowBubbles) {
        clearTimeout(this._lapseBubbleContent);
        this.showMessage(true);
        this.lapseLoading(100);
      } else {
        this.hideDialog();
      }
    });
  }

  runAnimation() {
    this._isAnimationRunning = true;
  }

  stopAnimation() {
    this._isAnimationRunning = false;
  }

  get isAnimationRunning() {
    return this._isAnimationRunning;
  }

  getTitleByAreaId(areaId) {
    return $(`.title-${areaId}`);
  }

  showTitle(areaId) {
    this.getTitleByAreaId(areaId).addClass("visible").addClass("normal").removeClass("hidden");
  }

  hideTitle(areaId) {
    this.getTitleByAreaId(areaId).addClass("hidden").removeClass("normal").removeClass("visible");
  }

  hoverInteract(element, children, id) {
    const _content = this.lang[id];

    $(element).hover((event) => {
      this.mask.show(id);
      Sounds.terminate("system/background/front");
      Sounds.playLoop(`operatingSystem/${id}`);
      this.isHover = true;

      $(children).addClass("current");
      this.stopAnimation();
      this.showTitle(id);

      if (id !== "daemons") {
        $("#OS_daemon_7").addClass("daemon_7_still");
      }
    }, (event) => {
      this.isHover = false;

      if (this.isShowDialog) return;

      this.mask.hide(id);
      Sounds.terminate(`operatingSystem/${id}`);
      $(children).removeClass("current");
      this.runAnimation();
      this.hideTitle(id);

      if (id !== "daemons") {
        $("#OS_daemon_7").removeClass("daemon_7_still");
      }
    });
  }

  applyHoverInteraction() {
    $.each(this._subSystems, (index, el) => {
      this.hoverInteract(el.element, el.children, index);
      this.getTitleByAreaId(index).css({"pointer-events": "none"});
    });
  }

  insertBox(boxes) {
    const html = [];

    boxes.forEach(box => {
      const label = box.name.toLowerCase();
      const top = box.top || 10;

      const _avatar = $("<div>", {
        class: "ui__box-avatar",
        html: `<img src="images/avatars/${label}.png">`
      });

      const _name = $("<div>", {
        class: "ui__box-name",
        text: box.name
      });

      const _loader = $("<div>", {
        class: "ui__box-loading",
        html: "<span class='dot'></span><span class='dot'></span><span class='dot'></span>"
      });

      const _content = $("<div>", {
        class: "ui__box-bubble-content",
        html: box.text
      });

      const _clear = $("<div class='clearfix'></div>");

      const _bubble = $("<div>", {
        class: `ui__box-bubble loading ${label}`,
      })
      .append(_loader)
      .append(_content)
      .append(_clear);

      const _box = $("<div>", {
        class: "ui__box loading",
        style: `margin-top: ${top}px;`,
        "data-index": box.index
      })
      .append(_avatar)
      .append(_name)
      .append(_bubble);

      html.push(_box);
    });

    return html;
  }

  getMessageByIndex(index) {
    return $(`.ui__box[data-index=${index}]`);
  }

  showMessage(cancelLapseLoading = false) {
    this.getMessageByIndex(this._currentMessageIndex).find(".ui__box-bubble").removeClass("loading")
    Sounds.play("operatingSystem/land");
    this._currentMessageIndex++;
    if (this._currentMessageIndex >= $(".ui__box").length) {
      this._isShowBubbles = false;
    }

    if (!cancelLapseLoading) {
      this.lapseLoading(1250);
    }
  }

  lapseLoading(delay) {
    this._lapseBubble = setTimeout(() => {
      if (this._currentMessageIndex >= $(".ui__box").length) {
        return;
      }

      if (delay == 0) {
        this.getMessageByIndex(this._currentMessageIndex).fadeIn();
      } else {
        this.getMessageByIndex(this._currentMessageIndex).fadeIn('fast');
      }

      this.getMessageByIndex(this._currentMessageIndex).removeClass("loading");

      Sounds.play("operatingSystem/writing");
      this._lapseBubbleContent = setTimeout(() => {
        this.showMessage();
      }, 2500);

    }, delay);
  }

  showBubbles() {
    this._currentMessageIndex = 0;
    this.lapseLoading(0);
  }

  showDialog(areaId) {
    this._isShowBubbles = true;
    this.isShowDialog = true;

    Sounds.play("operatingSystem/select");
    this._currentAreaId = areaId;
    this.layer.show();

    $(this._subSystems[areaId].element).css({"z-index": "710"});

    Sounds.play("operatingSystem/open");
    this.showTitle(areaId);
    this.getTitleByAreaId(areaId).css({"pointer-events": "auto"});

    this.unfoldContent(areaId);
    this.showBubbles();
    this.stopAnimation();
    $(`.${areaId}`).addClass("current");

    if (areaId != "daemons") {
      $("#OS_daemon_7").addClass("daemon_7_still");
    }
  }

  hideDialog() {
    $(".current").removeClass("current");
    this.layer.hide();
    this.runAnimation();
    this.getTitleByAreaId(this._currentAreaId).css({"pointer-events": "none"});
    Sounds.play("operatingSystem/close");
    this.isShowDialog = false;

    $(this._subSystems[this._currentAreaId].element).removeAttr("style");

    if (!this.isHover) {
      this.mask.hide(this._currentAreaId);
      this.hideTitle(this._currentAreaId);
      Sounds.terminate(`operatingSystem/${this._currentAreaId}`);
      Sounds.play("system/background/front");
    }

    clearTimeout(this._lapseBubble);
    clearTimeout(this._lapseBubbleContent);

    if (this._currentAreaId !== "daemons") {
      $("#OS_daemon_7").removeClass("daemon_7_still");
    }
  };

  unfoldContent(areaId) {
    const _content = this.lang[areaId];

    _content.columns.forEach(boxes => {
      var _htmlBoxes = this.insertBox(boxes);
      const left = boxes[0].left || 0;

      $(".ui__layer-content").append(
        $("<div>", {
          class: "ui__layer-col",
          style: `margin-left: ${left}px;`
        })
        .append(_htmlBoxes)
      );
    });

    $(".ui__layer-content").append(
      $("<div class='clearfix'></div>")
    );
  }
}

class Layer {
  constructor() {
    this.element = $(".ui__layer");
  }

  emptyContent() {
    $(".ui__layer-content", this.element).empty();
  };

  show() {
    this.element.show();
    $(".ui__layer-close").show();
  }

  hide() {
    this.element.hide();
    this.emptyContent();
    $(".ui__layer-close").hide();
  }
}

class Mask {
  constructor() {
    this.element = $(".ui__overlay");
  }

  show(maskClass) {
    $(`#mask-${maskClass}`)
      .removeClass("hidden")
      .addClass("visible");
  }
  hide(maskClass) {
    $(`#mask-${maskClass}`)
      .addClass("hidden")
      .removeClass("visible");
  }
};

var UI = new UserInterface();
