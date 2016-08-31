(function(factory){
    self.define && self.define.amd && define(factory) || (self['Animation'] = factory());
})(function(){

    var t = (new Date).getTime(), 
        animation = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame, 
        failback = function(fn){ setTimeout(function(){fn((new Date).getTime() - t);}, 1000/60); };

    function Animation(dispatcher) {
        var o = dispatcher.init({}),
            on = o.on,
            off = o.off,
            trigger = o.trigger;

        // overwrite
        this.addHandler = function(fn){ on.call(this, 'tick', fn); };
        this.removeHandler = function(fn){ off.call(this, 'tick', fn); };
        this.trigger = function(data){ trigger.call(this, 'tick', data); };
        
    }

    Animation.prototype = {
        running: false,
        paused: false,
        run: function(useFailback){

            if (this.running) return this;

            var f = useFailback || !animation ? failback : animation,
                me = this;
            
            function loop(t) {
                me.paused || me.trigger(t);
                f(loop)
            }

            loop(0);
            this.running = true;

            return this;
        },
        pause: function(bool){
            this.paused = !!bool;
        }
    };

    return Animation;
})
