class UserInterface {
  constructor() {
    this.lang = lang;
    this.layer = new Layer();
    this.overlay = new Overlay();

    this._isAnimationRunning = true;
    this._stations = [
      {element: "#cursor", children: ".cursor"},
      {element: "#window-manager", children: ".window"},
      {element: "#memory-manager", children: ".memory"},
      {element: "#file-system", children: ".file"},
      {element: "#dev-null", children: ".dev"},
      {element: "#kernel", children: ".kernel"},
    ];
    this._stations.forEach((station) => {
      this.hoverInteract(station.element, station.children);
    });

    $(".ui__area").click((event) => {
      const targetElement = $(event.currentTarget);
      const areaId = targetElement.data("id");

      targetElement.off("mouseenter mouseleave");
      $(".ui__overlay").stop().fadeIn(80);

      this.layer.show();
      this.unfoldContent(areaId);
      this.showBubbles();
      this.stopAnimation();
      $(`.${areaId}`).toggleClass("current");
    });

    $(".ui__layer-close").click(() => {
      $(".current").toggleClass("current");
      this.layer.hide();
      this.overlay.hide();
      this.runAnimation();
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

  hoverInteract(element, children) {
    $(element).hover((event) => {
      this.overlay.show();
      $(children).toggleClass("current");
      this.stopAnimation();
    }, (event) => {
      this.overlay.hide();
      $(children).toggleClass("current");
      this.runAnimation();
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

      const _content = $("<div>", {
        class: "ui__box-bubble-content",
        html: box.text
      });

      const _bubble = $("<div>", {
        class: `ui__box-bubble ${label}`,
      })
      .append(_content);

      const _box = $("<div />", {
        class: "ui__box",
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
    const _bubbles = $(".ui__box");
    let index = 0;

    const lapseLoading = () => {
      $(_bubbles[index]).fadeIn();
      if (index >= _bubbles.length)
        return;
      index++;
      setTimeout(lapseLoading, 2500);
    };

    setTimeout(() => {
      lapseLoading();
    }, 0);
  }

  unfoldContent(areaId) {
    const _content = this.lang[areaId];

    this.layer.setTitle(_content.title);

    _content.columns.forEach(boxes => {
      var _htmlBoxes = this.insertBox(boxes);

      $(".ui__layer-content").append(
        $("<div>", {
          class: "ui__layer-col"
        })
        .append(_htmlBoxes)
      );
    });
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

class Overlay {
  constructor() {
    this.element = $(".ui__overlay");
  }

  show() {
    this.element.stop().fadeIn(80);
  }

  hide() {
    this.element.stop().fadeOut(80);
  }
}

var UI = new UserInterface();
