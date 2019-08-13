//-------------------------------------------------------
// Canvas Optimizations
//-------------------------------------------------------
CanvasRenderingContext2D.prototype.drawImageCached = function (image, dx, dy, dWidth, dHeight)
{
    // No-Op if the image is not loaded
    if (image.tagName === 'IMG' && !image.complete)
        return;

    const t = this.getTransform() || this.currentTransform || this.webkitCurrentTransform;
    if (t === undefined)
    {
        this.drawImage(image, dx, dy, dWidth, dHeight);
        return;
    }

    dWidth = Math.round(dWidth);
    dHeight = Math.round(dHeight);

    var off = image._off;
    if (!off || off.canvas.width !== dWidth || off.canvas.height !== dHeight ||
        off._t.a !== t.a || off._t.d !== t.d)
    {
        if (!off)
            image._off = off = document.createElement('canvas').getContext('2d');

        off._t = t;
        off.scale(t.a, t.d);
        off.canvas.width = dWidth;
        off.canvas.height = dHeight;
        off.drawImage(image, 0, 0, dWidth, dHeight);
    }

    this.drawImage(off.canvas, dx, dy);
};

