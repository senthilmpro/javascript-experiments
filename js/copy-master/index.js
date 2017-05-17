const express = require('express'),
    app = express(),
    cheerio = require('cheerio'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    request = require('request'),
    schedule = require('node-schedule');

require('shelljs/global');

var PORT_NUMBER = 3355;

var settings = {
    "buildUrl": "https://cm-jenkins.xxxx.com/mybuild/",
    "desktopFolder": "",
    "buildNumber": 0
};

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0,1,2,3,4,5,6];
rule.second = 25;

var j = schedule.scheduleJob(rule, function(){
    getLatestBuildNumber();
});

function getLatestBuildNumber() {
    // GET PAGE AND GET LATEST VERSION
    request({
        method: 'GET',
        uri: settings.buildUrl
    }, function (err, response, body) {
        // Get status code
        const statusCode = response.statusCode;
        if (statusCode = 200) {
            console.log("Page request : SUCCESS ");
            const $ = cheerio.load(body);
            const title = $('title').text();
            const numArray = title.match(/\d+/g);
            const buildNumber = numArray[numArray.length - 1];
            settings.buildNumber = buildNumber;

            // Now pass the build number to desktop folder and create a copy
            if (buildNumber !== undefined && buildNumber !== null) {
                createNewFolder(buildNumber);
            } else {
                console.log("INVALID BUILD NUMBER");
            }

        } else {
            console.log("ERROR : Page cannot be retrieved");
        }
    });
}



function callCommandLine(buildNumber, newDirLocation) {
    // Sync call to exec()
    var version = exec('node --version', { silent: true }).output;
    const srcLocation = "\\mylocation"
    console.log(srcLocation);
    const initialCommand = "net use " + srcLocation + " /user:username password";
    console.log(initialCommand);
    exec(initialCommand, function (status, output) {
        console.log('Exit status:', status);
        console.log('Program output:', output);
    });

    const commandToExec = 'xcopy ' + srcLocation + ' "' + newDirLocation + '" /e /i /h';

    exec(commandToExec, function (status, output) {
        console.log('Exit status:', status);
        console.log('Program output:', output);
    });
}


function createNewFolder(buildNumber) {
    const homeDir = os.homedir();
    const newDirLocation = path.normalize(homeDir + "\\Desktop\\" + buildNumber);
    console.log("NEW DIRECTORY LOCATION"+ newDirLocation);
    if (!fs.existsSync(newDirLocation)) {
        fs.mkdirSync(newDirLocation);
        callCommandLine(buildNumber, newDirLocation);
    } else {
        console.log("FOLDER ALREADY EXISTS");
    }

}

