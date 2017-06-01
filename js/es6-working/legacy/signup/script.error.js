/* 
SYMANTEC:     Copyright (c) 2016-2017 Symantec Corporation. All rights reserved.
THIS SOFTWARE CONTAINS CONFIDENTIAL INFORMATION AND TRADE SECRETS OF SYMANTEC CORPORATION.  USE, 
DISCLOSURE OR REPRODUCTION IS PROHIBITED WITHOUT THE PRIOR EXPRESS WRITTEN PERMISSION OF SYMANTEC 
CORPORATION.
The Licensed Software and Documentation are deemed to be commercial computer software as defined in
FAR 12.212 and subject to restricted rights as defined in FAR Section 52.227-19 "Commercial Computer
Software - Restricted Rights" and DFARS 227.7202, Rights in "Commercial Computer Software or Commercial
Computer Software Documentation," as applicable, and any successor regulations, whether delivered by
Symantec as on premises or hosted services.  Any use, modification, reproduction release, performance,
display or disclosure of the Licensed Software and Documentation by the U.S. Government shall be solely
in accordance with the terms of this Agreement.
*/

$(document).ready(function () {
    // parse query string and display appropriate error
    var errCode = getParameterByName('errorCode');
    var errMsg = getParameterByName('errorMsg');

    var errorHTML = parseError(errCode, errMsg);

    $('#errorDesc').html(errorHTML);

    //disable right click
    $(this).bind("contextmenu", function (e) {
        e.preventDefault();
    });
});



function parseError(errorCode, errorMsg) {
    var errHTML = "";
    if (errorCode !== null && errorMsg !== null) {
        errHTML += "<div><h3 class='danger'>" + errorCode + "<br>" + errorMsg + "</h3></div>";
    }
    return errHTML;
}



function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}