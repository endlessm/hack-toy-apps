const Animations = [];

function step(timestamp) {

    Animations.forEach(function(element) {
        var img = element._currentFrame;

        if (!element._lastUpdated)
            element._lastUpdated = timestamp;

        var elapsed = timestamp - element._lastUpdated;

        if (elapsed >= img._delay) {
            img.style.visibility = 'hidden';

            /* Show next frame */
            var next = img.nextElementSibling ? img.nextElementSibling : element.firstElementChild;

            next.style.visibility = 'visible';
            element._lastUpdated = timestamp;

            element._currentFrame = next;
        }
    });

    requestAnimationFrame(step);
}

function animation_bootstrap()
{
    var elements = document.querySelectorAll( "div.Animation" );

    /* Initialize all animation */
    elements.forEach(function(element) {
        var frameTiming = JSON.parse(element.attributes['data-frames'].value);

        for (var i = 1, n = frameTiming.length; i <= n; i++) {
            var img = document.createElement ('img');

            img._delay = frameTiming[i-1];
            img.src = `images/${element.id}/${i}.png`;
            img.style.visibility = i === 1 ? 'visible' : 'hidden';

            element.appendChild(img);
        }

        element._currentFrame = element.firstElementChild;

        Animations.push(element);
    });

    requestAnimationFrame(step);
}

/* Bootstrap animations */
animation_bootstrap();

