class Logger {
    constructor(type) {
        this.type = type || 'INFO';
        this.msgQueue = [];
        this.levels = [{
            'name': 'ERROR',
            'value': 0
        }, {
            'name': 'DEBUG',
            'value': 1
        }]
    }

    // static levels(){
    //     return {
    //         'ERROR' : 0,
    //         'DEBUG' : 1,
    //         'WARNING' : 2,
    //         'INFO' : 3
    //     }
    // }

    error(msg) {
        let errorMsg = {
            type: 'ERROR',
            msg: msg,
            time : new Date()
        };
        this.msgQueue.push(errorMsg);
        console.log(errorMsg);
    }

    debug(msg) {
        let debugMsg = {
            type: 'DEBUG',
            msg: msg,
            time : new Date()
        };
        this.msgQueue.push(debugMsg);
        console.log(debugMsg);
    }

    printMessages() {
        // Get current debug level and print the logs accordingly. As of now, print everything.
        //console.log(this.msgQueue.filter((n) => (n.type == 'ERROR')));
        //console.log(this.msgQueue)

        let msgArray = this.msgQueue.map(function(obj) {return obj.msg});
        console.log(msgArray);
    }
}


export default Logger;