/**
 * 简单的动画引擎
 * @author : luying1@staff
 * @param args
 * @param args.duration
 * @param args.fps
 * @param args.callback
 */
SinaEditor.animate = function (args) {
    var timeout = function (w, a) {
        return w['r' + a] || w["webkitR" + a] || w["r" + a] || w["mozR" + a] || w["msR" + a] || w["oR" + a]
    }(window, "equestAnimationFrame");
    var animate = SinaEditor.animate;
    var duration = args.duration || 1000;
    var fps = args.fps || 60;
    var cfg = {
        fps: fps,
        currFrame: 0,
        frames: Math.ceil(duration * fps / 1000)
    };

    if (animate.animating) {
        return;
    }
    animate.animating = true;
    var run = function () {
        if (cfg.currFrame >= cfg.frames) {
            clearInterval(timer);
            if ('function' == typeof args.callback) {
                args.callback(cfg);
            }
            animate.animating = false;
            return;
        } else {
            if (timeout) {
                timeout(run);
            }
        }
        cfg.currFrame++;
        args.func(cfg);
    }
    if (!timeout) {
        var timer = setInterval(run, 1000 / cfg.fps);
    } else {
        timeout(run);
    }

}
