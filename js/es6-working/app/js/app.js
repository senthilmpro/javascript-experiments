/**
 * @author : senthilmpro
 * @title : Renovated design for Symantec Security Cloud page
 */

window.onload = function () {
    // load properties into window's scope.
    (function () {
        window.sepm = {};
        window.sepm.globals = {};

        window.sepm.defaults = {
            language: 'en-US',
            encoding: 'UTF-8',
            debug: 'false',
            name: 'Symantec Security Cloud',
            logging: false,
            browsers: {
                "IE": 11,
                "Mozilla": 40,
                "Chrome": 5
            },
            font : {
                "font-family" : "Goudy Stout",
                "font-style" : "normal",
                "font-weight": 700
            }
        };

        window.sepm.globals.INSTALLSTATUS = Object.freeze({
            INSTALLED: "INSTALLED",
            NOT_INSTALLED: "NOTINSTALLED",
            UNKNOWN: "UNKNOWN",
            PENDING: "PENDING",
            ERROR: "ERROR"
        });

        window.sepm.globals.AGENTNAME = Object.freeze({
            ASSET_COLLECTOR: "ASSET_COLLECTOR",
            EVENT_COLLECTOR: "EVENT_COLLECTOR",
            BRIDGE: "BRIDGE"
        });

        window.sepm.globals.HUGAGENTNAME = Object.freeze({
            NONE : "NONE",
            INSTALL : "INSTALL",
            UNINSTALL : "UNINSTALL",
            BRIDGE : "BRIDGE",
            ASSET_COLLECTOR : "ASSET_COLLECTOR",
            EVENT_COLLECTOR : "EVENT_COLLECTOR"
        })

        window.sepm.globals.ENROLLMENTSTATE = Object.freeze({
            ENROLLED: 0,
            UNENROLLED: 1,
            UNENROLL_FAILED: 2
        });

        window.sepm.globals.RUNNINGSTATUS = Object.freeze({
            DEFAULT: -1,
            UPDATED: 0
        });

        window.sepm.globals.COLOR = Object.freeze({
            SUCCESS: 'Green',
            NOTFOUND: 'Black',
            WARNING: 'Orange',
            ERROR: 'Red'
        });

        var settings = window.sepm.defaults;
        console.log(window.sepm);
    })();

    //load list of environmental variables
    const language = navigator.language || window.sepm.defaults.language;

    alert("Browser support language :"+ language);
    console.log(JSON.stringify(window.sepm));

}



var settings = {
    timer : {
        delay : 1000,
        interval : 30
    }
}

function Timer(){
    this.id = "SEPM_Hub_Status_Query_Timer";
    this.initTime = new Date();
    this.interval = 30;
    this.intervalTimer = null;
}
/**
 * Initialize the timer task to query the hub every 30 seconds
 */
Timer.prototype.setTimerInterval = function(seconds){
    this.clearTimerInterval();
    var interval = seconds * 1000 || settings.timer.interval * 1000;
    this.intervalTimer = setInterval(function(){
        //queryhubstatus();
        console.log("Querying hub status :"+ (new Date()));
    }, interval);
}

Timer.prototype.InitializeTimer = function(){
    console.log("Initializing Timer at "+ new Date());
    var interval = settings.timer.interval || 30;
    this.setTimerInterval(interval);
}

Timer.prototype.clearTimerInterval = function(){
    console.log("Clearing Interval..");
    clearInterval(this.intervalTimer);
}

window.sepm = window.sepm || {};
window.sepm.timer = window.sepm.timer || new Timer();
window.sepm.timer.InitializeTimer();


// Unless force status is enforced, return the cache status if the interval is less than 20 minutes


var UtilManager = (function () {
    // convert object to query string
    function objToQueryString(obj) {
        var str = "?";
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + "=" + encodeURIComponent(obj[p]) + "&";
            }
        }
        return str.substring(0, str.length - 1);
    }

    function getURLOrigin() {
        var location = document.location;
        var hostname = location.hostname;
        var port = location.port;
        var protocol = location.protocol;
        return protocol + "//" + hostname + ":" + port;
    }

    function decryptToken(token) {
        var parsedTokenArray = CryptoJS.enc.Base64.parse(token);
        var parsedTokenStr = parsedTokenArray.toString(CryptoJS.enc.Utf8);
        return parsedTokenStr;
    }

    return {
        objToQueryString: objToQueryString,
        getURLOrigin: getURLOrigin,
        decryptToken : decryptToken
    }
})();


var AuthManager = (function(){
    var accessToken = null;

    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    function getAccessToken(){
        if(accessToken == null){
            console.log("Getting accessToken : ");
            accessToken =  getParameterByName("accessToken");
        }
        return accessToken;
    }

    return {
        accessToken : getAccessToken()
    }
})();

