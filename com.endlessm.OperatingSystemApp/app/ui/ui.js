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
      "kernel": {element: "#kernel", children: ".kernel"},
      "clock": {element: "#clock", children: ".kernel-clock"},
      "daemons": {element: ".ui__daemon", children: ".Animation"},
      "system": {element: "#system", children: null},
    }
    this.applyHoverInteraction();


    $(".whole").click((event) => {
      const targetElement = $(event.currentTarget);
      $(targetElement).unbind("mouseleave");
      this.showDialog($(targetElement).data("id"));
      this.mask.show($(targetElement).data("id"));
    });

    $(".ui__daemon").click((event) => {
      const targetElement = $(event.currentTarget);
      $(targetElement).off("mouseleave");
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__area").click((event) => {
      const targetElement = $(event.currentTarget);
      $(targetElement).unbind("mouseleave");
      this.showDialog($(targetElement).data("id"));
    });

    $(".ui__layer-close").click(this.hideDialog.bind(this));

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

  hoverInteract(element, children, id) {
    const _content = this.lang[id];

    $(element).hover((event) => {
      this.mask.show();
      $(children).toggleClass("current");
      this.stopAnimation();

      this.layer.setTitle(_content.title);
      $(".ui__layer-title").addClass("visible");
      if (id !== "daemons") {
        $("#OS_daemon_7").addClass("daemon_7_still");
      }
    }, (event) => {
      this.mask.hide();
      $(children).toggleClass("current");
      this.runAnimation();

      this.layer.setTitle("");
      $(".ui__layer-title").removeClass("visible");
      if (id !== "daemons") {
        $("#OS_daemon_7").removeClass("daemon_7_still");
      }
    });
  }

  applyHoverInteraction() {
    $.each(this._subSystems, (index, el) => {
      this.hoverInteract(el.element, el.children, index);
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

        this._lapseBubbleContent = setTimeout(function() {
          $(".ui__box-bubble", bubbles[index]).removeClass("loading");
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
    this._currentAreaId = areaId;
    this.layer.show();

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

    clearTimeout(this._lapseBubble);
    clearTimeout(this._lapseBubbleContent);

    if (this._currentAreaId !== "daemons") {
      $("#OS_daemon_7").removeClass("daemon_7_still");
    }
    this.applyHoverInteraction();
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

  setTitle(text) {
    const _text = text || "";
    $(".ui__layer-title").text(_text);
  };

  show() {
    this.element.show();
  }

  hide() {
    this.element.hide();
    this.emptyContent();
    this.setTitle();
  }
}

class Mask {
  constructor() {
    this.element = $(".ui__overlay");
  }

  show() {
    this.element.stop().fadeIn(80);
  }
  hide() {
    this.element.stop().fadeOut(80);
  }
};

var UI = new UserInterface();
