const clock = document.getElementById('rtc');

function clock_tick() {
    var seconds = Math.floor(Date.now()/1000);

    if (clock._seconds !== seconds) {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();;

        var hTransform = `rotate(${h * 30 + m/2}deg)`;
        var mTransform = `rotate(${m * 6 + s/10}deg)`;
        var sTransform = `rotate(${s * 6}deg)`;

        clock._hour.style.transform = clock._hShadow.style.transform = hTransform;
        clock._minute.style.transform = clock._mShadow.style.transform = mTransform;
        clock._second.style.transform = clock._sShadow.style.transform = sTransform;

        clock._seconds = seconds;
    }

    requestAnimationFrame(clock_tick);
}

function clock_init() {
    clock._hour = clock.querySelector('#hour');
    clock._hShadow = clock.querySelector('#hour-shadow');

    clock._minute = clock.querySelector('#minute');
    clock._mShadow = clock.querySelector('#minute-shadow');

    clock._second = clock.querySelector('#second');
    clock._sShadow = clock.querySelector('#second-shadow');

    requestAnimationFrame(clock_tick);
}

/* Start clock */
clock_init();

