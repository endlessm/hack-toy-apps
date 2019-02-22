var lapseBubble, lapseBubbleContent, lapseMask;
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

class Mask {
  show(maskClass) {
    $(".ui__mask")
      .addClass(`${maskClass}_mask`)
      .removeClass("hidden")
      .addClass("visible");
  }

  hide(maskClass, delay) {
    delay = delay || 0;

    $(".ui__mask")
      .addClass("hidden")
      .removeClass("visible");

    lapseMask = setTimeout(function() {
      $(".ui__mask")
        .removeClass(`${maskClass}_mask`);
    }, delay);
  }
};

UI.layer = new Layer();
UI.mask = new Mask();
UI.runAnimation = true;

UI.subSystems = {
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

$(".bg-sys").hover(function() {
  Sounds.playLoop("system/background/front");
}, function() {
  Sounds.stop("system/background/front");
});

UI.hover_interact = function(element, children, id) {
  var _content = UI.lang[id];

  $(element).stop().hover(function(e) {
    UI.mask.show(id);
    Sounds.stop("system/background/front");
    Sounds.playLoop(`operatingSystem/${id}`);

    $(children).addClass("current");
    UI.runAnimation = false;

    UI.layer.setTitle(_content.title);
    $(".ui__layer-title").addClass("visible");

    if (id != "daemons") {
      $("#OS_daemon_7").addClass("daemon_7_still");
    }
  }, function(e) {
    UI.mask.hide(id, 500);

    Sounds.stop(`operatingSystem/${id}`);
    $(children).removeClass("current");
    UI.runAnimation = true;
    UI.layer.setTitle("");
    $(".ui__layer-title").removeClass("visible");

    if (id != "daemons") {
      $("#OS_daemon_7").removeClass("daemon_7_still");
    }
  });
};

UI.insertBox = function(boxes) {
  var html = [];

  boxes.forEach(box => {
    var label = box.name.toLowerCase();
    var top = box.top || 10;
    var _loading = box.index > 0 ? "loading" : "";

    _avatar = $("<div>", {
      class: "ui__box-avatar",
      html: `<img src="images/avatars/${label}.png">`
    });

    _name = $("<div>", {
      class: "ui__box-name",
      text: box.name
    });

    _loader = $("<div>", {
      class: "ui__box-loading",
      html: "<span class='dot'></span><span class='dot'></span><span class='dot'></span>"
    });

    _content = $("<div>", {
      class: "ui__box-bubble-content",
      html: box.text
    });

    _clear = $("<div class='clearfix'></div>");

    _bubble = $("<div>", {
      class: `ui__box-bubble loading ${label}`,
    })
    .append(_loader)
    .append(_content)
    .append(_clear);

    _box = $("<div>", {
      class: `ui__box loading`,
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

  _content.columns.forEach(boxes => {
    var _htmlBoxes = UI.insertBox(boxes);
    var left = boxes[0].left || 0;

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
};

UI.bubbles;
UI.index = 0;
UI.showBubbles = function() {
  var lapseLoading = function() {
    lapseBubble = setTimeout(function() {
      if (UI.index >= UI.bubbles.length) {
        return;
      }

      $(UI.bubbles[UI.index])
        .fadeIn()
        .removeClass("loading");

      Sounds.play("operatingSystem/writing");

      lapseBubbleContent = setTimeout(function() {
        $(".ui__box-bubble", UI.bubbles[UI.index]).removeClass("loading");
        Sounds.play("operatingSystem/land");
        UI.index++;
        lapseLoading();
      }, 3000);
    }, 1250);
  }

  setTimeout(
    function() {
      UI.bubbles = $(".ui__box.loading");
      UI.index = 0;
      lapseLoading();
    }, 300);
};

$.each(UI.subSystems, function(index, el) {
  UI.hover_interact(el.element, el.children, index);
});

UI.showDialog = function(areaId) {
  Sounds.play("operatingSystem/select");
  UI.current = areaId;
  UI.layer.show();
  Sounds.play("operatingSystem/open");

  UI.unfoldContent(areaId);
  UI.showBubbles();
  UI.runAnimation = false;
  $(`.${areaId}`).addClass("current");

  if (areaId != "daemons") {
    $("#OS_daemon_7").addClass("daemon_7_still");
  }
};

UI.hideDialog = function() {
  $(".current").removeClass("current");
  UI.layer.hide();
  UI.mask.hide(UI.current);
  UI.runAnimation = true;
  Sounds.play("operatingSystem/close");
  Sounds.stop(`operatingSystem/${UI.current}`);
  Sounds.play("system/background/front");
  clearTimeout(lapseBubble);
  clearTimeout(lapseBubbleContent);

  if (UI.current != "daemons") {
    $("#OS_daemon_7").removeClass("daemon_7_still");
  }

  $.each(UI.subSystems, function(index, el) {
    UI.hover_interact(el.element, el.children, index);
  });

};

$(".whole").click(function(e) {
  $(this).unbind("mouseleave");
  UI.showDialog($(this).data("id"));
  UI.mask.show($(this).data("id"));
});

$(".ui__daemon").click(function(e) {
  $(this).unbind("mouseleave");
  UI.showDialog($(this).data("id"));
});

$(".ui__area").click(function(e) {
  $(this).unbind("mouseleave");
  UI.showDialog($(this).data("id"));
});

$(".ui__layer-close").click(function() {
  UI.hideDialog();
});

$(".ui__layer").on("click", function(e) {
  var classTarget = $(e.target).attr("class");
  var isNotTarget = function(classTarget) {
    return classTarget != "ui__layer" &&
           classTarget != "clearfix" &&
           classTarget != "ui__layer-col";
  }

  if (isNotTarget(classTarget)) {
    return false;
  }

  UI.hideDialog();
});
