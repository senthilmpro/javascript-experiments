"use strict";
//es6 app.js
import Logger from './logger.js';

class SEPM {
    constructor(settings) {
        this.settings = settings;
    }

    static RESTAPIManager() {
        return {
            HUBSTATUS: "",
            ENROLL: "",

        }
    }

    static globals() {
        return Object.freeze({
            "INSTALLSTATUS": Object.freeze({
                INSTALLED: "INSTALLED",
                NOT_INSTALLED: "NOTINSTALLED",
                UNKNOWN: "UNKNOWN",
                PENDING: "PENDING",
                ERROR: "ERROR"
            }),
            "AGENTNAME": Object.freeze({
                ASSET_COLLECTOR: "ASSET_COLLECTOR",
                EVENT_COLLECTOR: "EVENT_COLLECTOR",
                BRIDGE: "BRIDGE"
            }),
            "HUGAGENTNAME": Object.freeze({
                NONE: "NONE",
                INSTALL: "INSTALL",
                UNINSTALL: "UNINSTALL",
                BRIDGE: "BRIDGE",
                ASSET_COLLECTOR: "ASSET_COLLECTOR",
                EVENT_COLLECTOR: "EVENT_COLLECTOR"
            }),
            "ENROLLMENTSTATE" : Object.freeze({
                ENROLLED: 0,
                UNENROLLED: 1,
                UNENROLL_FAILED: 2
            }),
            "COLOR" : Object.freeze({
                SUCCESS: 'Green',
                NOTFOUND: 'Black',
                WARNING: 'Orange',
                ERROR: 'Red'
            }),
            "RUNNINGSTATUS": Object.freeze({
                DEFAULT: -1,
                UPDATED: 0
            })
        });
    }
}

var settings = {
    logging: false,
    debug: false,
    i18n : "disabled",
    language: 'en-US',
    encoding: 'UTF-8'
}

var app = new SEPM(settings);

// print all the globals.
SEPM.globals();

var logger = new Logger('DEBUG');
logger.error("New Error");
logger.debug("New Debug");
logger.printMessages();

/**
 * Enroll SEPM to Cloud
 */
function enrollSEPM(){
    try {
        let enrollUrl = SEPM.RESTAPIManager().ENROLL;
    } catch(err){
        logger.error("Visibility >> EnrollSEPM >> "+ err);
    }
}

