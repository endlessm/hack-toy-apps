//-------------------------------------------------------
// Canvas Optimizations
//-------------------------------------------------------
CanvasRenderingContext2D.prototype.drawImageCached = function (image, dx, dy, dWidth, dHeight)
{
    if (!this.getTransform().isIdentity)
    {
        this.drawImage(image, dx, dy, dWidth, dHeight);
        return;
    }

    dWidth = Math.round(dWidth);
    dHeight = Math.round(dHeight);

    if (!image._offScreen)
    {
        image._offScreen = document.createElement('canvas');
        image._offScreenCtx = image._offScreen.getContext('2d');
    }

    if (image._offScreen.width !== dWidth || image._offScreen.height !== dHeight)
    {
        image._offScreen.width = dWidth;
        image._offScreen.height = dHeight;
        image._offScreenCtx.drawImage(image, 0, 0, dWidth, dHeight);
    }

    this.drawImage(image._offScreen, dx, dy);
};

