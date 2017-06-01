// backup.js


var settings = {
    timer : {
        delay : 1000,
        interval : 30
    }
}

function Timer(){
    this.secs = 0;
    this.id = null;
    this.running = false;
    this.delay = settings.timer.delay || 1000;
    console.log(this);
}

Timer.prototype.InitializeTimer = function(seconds){
    this.secs = seconds || settings.timer.interval;
    this.StopTheClock();
    if(this.secs > 0){
        //this.StartTheTimer();
        this.setInterval(seconds);
    }
}

Timer.prototype.StopTheClock = function(){
    if(this.running){
        clearTimeout(this.id);
    }
}

Timer.prototype.StartTheTimer = function(){
    if(this.secs == 0){
        // query hub status
        var interval = settings.timer.interval || 30;
        this.InitializeTimer(interval);
    } else {
        this.secs = this.secs - 1;
        this.running = true;
        this.id = setTimeout("this.StartTheTimer()", this.delay);
        console.log(this.id);
    }
}

/**
 * Initialize the timer task to query the hub every 30 seconds
 */
Timer.prototype.setInterval = function(seconds){
    interval = seconds * 1000 || settings.timer.interval * 1000;
    setInterval(function(){
        // queryhub status();
        console.log("Querying hub status :"+ (new Date()));
    }, interval);
}