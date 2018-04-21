
function TimerClass() {
    this.secondsRemaining = 1000;
    this.timeTick = function () {
        this.secondsRemaining--;
    }

    this.setupTimer = function () {
        var t = this;
        setInterval(function() {t.timeTick();}, 1000);
    }

    this.drawTimer = function () {
        colorText('Time remaining: ' + this.secondsRemaining + ' seconds', canvas.width - 150, 25, 'white');
    }
}