const UI = {};

UI.lang = lang;

class Layer {
  constructor() {
    this.element = $(".ui__layer");
  }

  emptyContent() {
    $(".ui__layer-content", this.element).empty();
  };

  setTitle(text) {
    var _text = text || "";
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
  show(maskClass) {
    $(".ui__overlay").stop().fadeIn("80");
  }

  hide(maskClass, delay) {
    $(".ui__overlay").stop().fadeOut("80");
  }
};

UI.layer = new Layer();
UI.overlay = new Overlay();
UI.runAnimation = true;

UI.stations = [
  {element: "#cursor", children: ".cursor"},
  {element: "#window-manager", children: ".window"},
  {element: "#memory-manager", children: ".memory"},
  {element: "#file-system", children: ".file"},
  {element: "#dev-null", children: ".dev"},
  {element: "#kernel", children: ".kernel"},
];

UI.hover_interact = function(element, children) {
  $(element).hover(function(e) {
    UI.overlay.show();
    $(children).toggleClass("current");
    UI.runAnimation = false;
  }, function(e) {
    UI.overlay.hide();
    $(children).toggleClass("current");
    UI.runAnimation = true;
  });
};

UI.insertBox = function(boxes) {
  var html = [];

  boxes.forEach(box => {
    var label = box.name.toLowerCase();
    var top = box.top || 10;

    _avatar = $("<div>", {
      class: "ui__box-avatar",
      html: `<img src="images/avatars/${label}.png">`
    });

    _name = $("<div>", {
      class: "ui__box-name",
      text: box.name
    });

    _content = $("<div>", {
      class: "ui__box-bubble-content",
      html: box.text
    });

    _bubble = $("<div>", {
      class: `ui__box-bubble ${label}`,
    })
    .append(_content);

    _box = $("<div />", {
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
};

UI.unfoldContent = function(areaId) {
  var _content = UI.lang[areaId];

  UI.layer.setTitle(_content.title);

  _content.columns.forEach(boxes => {
    var _htmlBoxes = UI.insertBox(boxes);

    $(".ui__layer-content").append(
      $("<div>", {
        class: "ui__layer-col"
      })
      .append(_htmlBoxes)
    );
  });
};

UI.showBubbles = function() {
  var _bubbles = $(".ui__box");
  var index = 0;

  var lapseLoading = function() {
    $(_bubbles[index]).fadeIn();
    if (index >= _bubbles.length)
      return;
    index++;
    setTimeout(lapseLoading, 2500);
  }

  setTimeout(function() {
    lapseLoading();
  }, 0);
};

UI.stations.forEach(function(station) {
  UI.hover_interact(station.element, station.children);
});

$(".ui__area").click(function(e) {
  var areaId = $(this).data("id");
  $(this).unbind("mouseenter mouseleave");
    $(".ui__overlay").stop().fadeIn("80");
    UI.layer.show();
    UI.unfoldContent(areaId);

    UI.showBubbles();

    UI.runAnimation = false;
    $(`.${areaId}`).toggleClass("current");
});

$(".ui__layer-close").click(function() {
  $(".current").toggleClass("current");
  UI.layer.hide();
  UI.overlay.hide();
  UI.runAnimation = true;
});
