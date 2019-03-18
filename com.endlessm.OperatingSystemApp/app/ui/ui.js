class UserInterface {
  constructor() {
    this.lang = lang;
    this.layer = new Layer();
    this.mask = new Mask();

    this._index = 0;
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
      const targetElement = $(event.currentTarget);
      $(targetElement).off("mouseleave mouseenter");
      this.showDialog($(targetElement).data("id"));
      this.mask.show($(targetElement).data("id"));
      $(".whole-title").show();
    });

    $(".ui__daemon").click((event) => {
      const targetElement = $(event.currentTarget);
      $(targetElement).off("mouseleave mouseenter");
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__area").click((event) => {
      const targetElement = $(event.currentTarget);
      $(targetElement).off("mouseleave mouseenter");
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__layer-close").click(this.hideDialog.bind(this));
    $(".ui__layer-title").click(this.hideDialog.bind(this));

    $(".ui__layer").on("click", (event) => {
      const classTarget = $(event.target).attr("class");
      function isNotTarget(classTarget) {
        return classTarget != "ui__layer" &&
               classTarget != "clearfix" &&
               classTarget != "ui__layer-col";
      }

      if (isNotTarget(classTarget)) {
        return false;
      }

      this.hideDialog();
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

    $(element).stop().hover((event) => {
      this.mask.show(id);
      Sounds.terminate("system/background/front");
      Sounds.playLoop(`operatingSystem/${id}`);

      $(children).addClass("current");
      this.stopAnimation();
      this.showTitle(id);

      if (id !== "daemons") {
        $("#OS_daemon_7").addClass("daemon_7_still");
      }
    }, (event) => {
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

  showBubbles() {
    let index;
    let bubbles;

    const lapseLoading = () => {
      this._lapseBubble = setTimeout(() => {
        if (index >= bubbles.length) {
          return;
        }
        $(bubbles[index])
          .fadeIn()
          .removeClass("loading");

        Sounds.play("operatingSystem/writing");
        this._lapseBubbleContent = setTimeout(function() {
          $(".ui__box-bubble", bubbles[index]).removeClass("loading");
          Sounds.play("operatingSystem/land");
          index++;
          lapseLoading();
        }, 2500);

      }, 1250);
    };

    setTimeout(() => {
        bubbles = $(".ui__box.loading");
        index = 0;
        lapseLoading();
      }, 300
    );
  }

  showDialog(areaId) {
    Sounds.play("operatingSystem/select");
    this._currentAreaId = areaId;
    this.layer.show();
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
    this.mask.hide(this._currentAreaId);
    this.runAnimation();
    this.hideTitle(this._currentAreaId);
    this.getTitleByAreaId(this._currentAreaId).css({"pointer-events": "none"});

    Sounds.play("operatingSystem/close");
    Sounds.terminate(`operatingSystem/${this._currentAreaId}`);
    Sounds.play("system/background/front");

    clearTimeout(this._lapseBubble);
    clearTimeout(this._lapseBubbleContent);

    if (this._currentAreaId !== "daemons") {
      $("#OS_daemon_7").removeClass("daemon_7_still");
    }
    $(".whole-title").hide();

    this.hoverInteract(
      this._subSystems[this._currentAreaId].element,
      this._subSystems[this._currentAreaId].children,
      this._currentAreaId
    );
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
