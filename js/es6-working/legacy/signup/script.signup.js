/* 
SYMANTEC:     Copyright (c) 2017 Symantec Corporation. All rights reserved.
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


var secs=0;
var timerID = null;
var timerRunning = false;
var delay = 1000;
var stopRefresh= false;
var HTTP_TOO_MANY_REQUESTS = 429;
function InitializeTimer(seconds)
{
    secs=seconds;
    // Set the length of the timer, in seconds
    StopTheClock();
    if (secs > 0) {
    StartTheTimer();
    }
}

function StopTheClock()
{
    if(timerRunning) {
        clearTimeout(timerID);
    }
    timerRunning = false;
}

function StartTheTimer()
{
    if (secs==0)
    {
    queryHubStatus();
    InitializeTimer(30);
        
    }
    else
    {
        self.status = secs;
        secs = secs - 1;
        timerRunning = true;
        timerID = self.setTimeout("StartTheTimer()", delay);
    }
}

var enrollmentState = {
    Enrolled: 0,
    Unenrolled: 1,
    UnenrollFailed: 2
};

var enrolledDomainExists = false;

$(document).ready(function () {
    var deferred = $.Deferred();
    deferred.done(function(domainId){
        checkEnrollStatus(domainId);
    })
    loadFn(deferred);

    //disable right click functionality
    $(this).bind("contextmenu", function (e) {
        //e.preventDefault();
    });
});

$("#signUpLink").on('click', function(e) {
    // If SEPM is using web-browser then open the link in a new tab
    // Otherwise open that in system's browser via javaFx in order to perform POST request to cloud sign-up url.
    if(window.jfx){
        e.preventDefault(); 
        window.jfx.openUrlWithBrowser($(this).attr("href"));
    } 
});

$('#enrollButton').on('click', function(e) {
    
    // to stop the form from submitting
    e.preventDefault(); 
    // clear any previous error message
    $('#enrollError').hide();
    $('#replicationError').hide();
    $('#multiDomainError').hide();
	$('#serverTimeSyncError').hide();
	
    
    //Check SEPM License and call doEnroll only if license is not expired
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/licenses/summary";
    var authString = "Bearer "+ accessToken;
    
    var ajaxObj = {
            url: restAPIURL,
            type: "GET",
            headers: {},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', authString);
            },
            success: function (data) {
            	if(data!=null && data.ended == true ){
            		alert("Your Symantec Endpoint Protection Manager license is expired. You cannot enroll a domain in Security Cloud until you renew the license.");
            		console.log("SEPM license is expired.");
            	}else{
            	    //simple validation
            	    if(validateInput()){
            	        try {
            	            doEnroll();
            	        }
            	        catch(ex) {
            	            console.log("Error in Enrollment " + ex.stack);
            	            $('#enrollError').show();
            	            $('#epmpEnroll')[0].reset();
            	        }       
            	    }
            	    else{
            	        alert("Invalid input");
            	    }
            	}
            },
            error: function (data) {
                $('#enrollError').show();
                $('#enrollButton').button('reset');
                console.log("Error while retriving license information.");
            }
        }
    $.ajax(ajaxObj);
});

$('#unenrollButton').on('click', function(e) {
    
    // to stop the form from submitting
    e.preventDefault();
    var retVal = confirm("Unenrollment removes all the domain's data from Security Cloud. Are you sure that you want to unenroll?");
    if( retVal == true ){
        doUnenroll();
    }    
});

$('#navbar a').click(function(e) {
    $('.container-fluid > div').hide();
    $(this.hash).show();
    e.preventDefault(); //to prevent scrolling
});

$('#enrollmentLink').click(function(e) {
    $('.container-fluid > div').hide();
	location.reload(true);
    $(this.hash).show();
    queryHubStatus();
    e.preventDefault(); //to prevent scrolling
});

$('#hubStatusLink').click(function(e) {
    $('.container-fluid > div').hide();
    $(this.hash).show();
    queryHubStatus();
    e.preventDefault(); //to prevent scrolling
});


function validateInput(){
    var epmpToken = $('#epmpToken').val();
    
    if (epmpToken == null || epmpToken == "") {
        return false;
    }
    return true;
}

function isSiteHasReplicationPartner(){
	  var accessToken = getParameterByName("accessToken");
	    var origin = getURLOrigin();
	    var restAPIURL=origin + "/sepm/api/v1/replication/is_replicated";
	    var authString = "Bearer "+ accessToken;
	    
	    var ajaxObj = {
	            url: restAPIURL,
	            type: "GET",
	            headers: {},
	            beforeSend: function (xhr) {
	                xhr.setRequestHeader('Authorization', authString);
	            },
	            success: function (data) {
	            	if(data==true){
	            		$('#registrationForm').find('*').attr('disabled',true);
	            		$('#replicationError').show();
	            	}
	            },
	            error: function (data) {
	                $('#enrollError').show();
	                $('#enrollButton').button('reset');
	            }
	        }
	    $.ajax(ajaxObj);
}

function checkEnrollStatus(domainId){
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/cloud/epmp/enroll?domainid=" + domainId;
    var authString = "Bearer " + accessToken;

    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
           localStorage.setItem(restAPIURL, JSON.stringify(data));
			paintUIForEnrollmentStatus(data);
        },
        error: function (data) {
			 //when request fail for too many request response. use the previous values so UI does not break.
 	 		 //This is intermittent behavior, in rare case when ratethreshold exceeds for given request.
			if(typeof(data.status) !== "undefined"  && data.status == HTTP_TOO_MANY_REQUESTS){
				paintUIForEnrollmentStatus(JSON.parse(localStorage.getItem(restAPIURL)));
			}else{
				displayPreEnroll();		                
			}
        }
    }

    $.ajax(ajaxObj);
}

/** Parse the Token from the cloud in the format epmp_customer_id=WoHVxy1MQlGg9BzGkYVBIQ&epmp_domain_id=ysj8gKrYS3GBdF3mNDXXwA&client_id=O2ID.WoHVxy1MQlGg9BzGkYVBIQ.ysj8gKrYS3GBdF3mNDXXwA.prdm9ci2ts879b3od6jc5gs92n&client_secret=1k00039j3f5ro52srij3029n9ns3jkc92f07
Calls the SEPM Enrollment REST API.
Displays enrolled to saep if successful else displays appropriate error on the UI.
*/
function doEnroll(){
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/cloud/epmp/enroll?domainid=" + $('#domainId').val();
    var authString = "Bearer "+ accessToken;
    
    var encryptedToken = $('#epmpToken').val();
    try
    {
        var tokenStr = decryptToken(encryptedToken);
    }
    catch(ex)
    {
        $('#epmpEnroll')[0].reset();
        $('#enrollError').show();
        throw new Error("Malformed UTF-8 data");
    }
    var str_array = tokenStr.split('&');
    
    //Decoded token should have 4 values returned : epmpCustomerId ,epmpDomainId ,clientId ,clientSecret
    if(str_array.length !=4)
    {
        $('#enrollError').show();
        $('#epmpEnroll')[0].reset();
        throw new Error("Invalid Epmp Token");
    }

    var epmpCustomerId = str_array[0].split('=')[1];
    var epmpDomainId = str_array[1].split('=')[1];
    var clientId = str_array[2].split('=')[1];
    var clientSecret = str_array[3].split('=')[1];
    
    if (epmpCustomerId == null || epmpCustomerId == ""
        || epmpDomainId == null || epmpDomainId == ""
        || clientId == null || clientId == ""
        || clientSecret == null || clientSecret == "")
    {
        $('#enrollError').show();
        $('#epmpEnroll')[0].reset();
        throw new Error("Invalid Decoded Fields");
    }
    
    var epmpData = JSON.stringify({ 
        "epmpCustomerId" : epmpCustomerId,
        "epmpDomainId" : epmpDomainId,
        "clientId" : clientId,
        "clientSecret" : clientSecret })
        
    $('#enrollButton').button('loading');
    var ajaxObj = {
        url: restAPIURL,
        type: "POST",
        data: epmpData,
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
            xhr.setRequestHeader( "Content-type", "application/json" );
        },
        success: function (data) {
            $('#signUpRow').hide();
            $('#registrationForm').hide();
            $('#enrollButton').button('reset');
            checkEnrollStatus($('#domainId').val());
            queryHubStatus();
        },
        error: function (data) {
            $('#epmpEnroll')[0].reset();
			//check if the server time is in sync with S3, if not then show the server time sync error.
			if(isServerTimeIncorrect(data)){
			//Display the time sync error 
				$('#serverTimeSyncError').show();
			} else{
			//show the enroll error.
				$('#enrollError').show();
			} 
            $('#enrollButton').button('reset');
        }
    }

    $.ajax(ajaxObj);
    
}

function loadFn(deferred) {
    var API_URL = "/sepm/api/v1";
    var origin = getURLOrigin();
    var accessToken = getParameterByName("accessToken");
    if (!accessToken || 0 === accessToken.length) {
        createErrorPage(400, "Access token is null or invalid");
    }
    var restAPIURL = origin + API_URL + "/" + "sessions" + "/currentuser";
    var authString = "Bearer " + accessToken;
    // construct ajax object
    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
            var title = data.role.title;
            if (title.indexOf('sysadmin') == -1) {
                createErrorPage(401, "Unauthorized");
            }
            deferred.resolve(data.domainid);
            var domainIdHiddenInput = $('<input id="domainId" name="domainId" type="hidden" value="'+ data.domainid + '">');
            $('#epmpEnroll').append(domainIdHiddenInput);
			
			var signUpLink = origin + "/sepm/console/signup/landing.html?accessToken="+accessToken+"&adminId="+data.adminId;
            $('#signUpLink').attr("href", signUpLink);
			
            isSiteHasReplicationPartner();
            checkForMultiDomainEnrollment();
            queryHubStatus();
        },
        error: function (jqreq, textStatus, textError) {
			var errorStr = "Target: " + restAPIURL + "<br>";
			if (jqreq.status == 401) {
				errorStr += "Auth: " + authString + "<br>";
			}
			errorStr += "State: " + textStatus + "<br>";
			errorStr += "Error: " + textError + "<br>";
			errorStr += "Response: " + jqreq.responseText + "<br>";
            createErrorPage(jqreq.status, errorStr);
        }
    }
    $.ajax(ajaxObj);
}

function queryHubStatus(){
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/cloud/epmp/hubstatus";
    var authString = "Bearer " + accessToken;

    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
			localStorage.setItem(restAPIURL, JSON.stringify(data));
            printHubStatus(data);
        },
        error: function (data) {
			//when request fail for too many request response. use the previous values so the UI does not break.
 	 		//This is intermittent behavior, in rare case when ratethreshold exceeds for given request.
			if(typeof(data.status) !== "undefined"  && data.status == HTTP_TOO_MANY_REQUESTS){
				printHubStatus(JSON.parse(localStorage.getItem(restAPIURL)));
			}
        }
    }

    $.ajax(ajaxObj);
}

//Checks whether the server time is correct or not with respect to S3.
function isServerTimeIncorrect(data){
if(data != null){
	var jsonResponse = data.responseJSON;
	if(jsonResponse!= null){
		var errorCode = jsonResponse.appErrorCode;
		if(errorCode === "7"){
			return true;
		}
	}
}
return  false;
}

function checkForMultiDomainEnrollment(){
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/domains/";
    var authString = "Bearer " + accessToken;
    var count = 0;
    
    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
			
			for(var i = 0; i < data.length & !enrolledDomainExists; i++)
			{
				var domainID = data[i].id;
				isEnrolled(domainID);			
			}               
        },
        error: function (data) {
            $('#epmpEnroll')[0].reset();        
            $('#enrollButton').button('reset');
        }
    }
    $.ajax(ajaxObj);
}

function isEnrolled(domainId){
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/cloud/epmp/isEnrolled?domainid=" + domainId;
    var authString = "Bearer "+ accessToken;
    
    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
            localStorage.setItem(restAPIURL, JSON.stringify(data));
			paintUIForMultiDomainError(data);
        },
        error: function (data) {
			// when request fail for too many request response.  use the previous values so UI does not break here.
 	 		// This is intermittent behavior, in rare case when ratethreshold exceeds for given request.
			if(typeof(data.status) !== "undefined"  && data.status == HTTP_TOO_MANY_REQUESTS){
				paintUIForMultiDomainError(JSON.parse(localStorage.getItem(restAPIURL)));
			}
        	console.log("Failed to get enrollment details ");         
        }
    }
    $.ajax(ajaxObj);
}

function doUnenroll() {
    var accessToken = getParameterByName("accessToken");
    var origin = getURLOrigin();
    var restAPIURL=origin + "/sepm/api/v1/cloud/epmp/enroll?domainid=" + $('#domainId').val();
    var authString = "Bearer "+ accessToken;

        
    $('#unenrollButton').button('loading');
    var ajaxObj = {
        url: restAPIURL,
        type: "DELETE",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
            $('#dvUnenroll').hide();
            $('#unenrollButton').button('reset');
            checkEnrollStatus($('#domainId').val());
            queryHubStatus();
            location.reload(true);
        },
        error: function (data) {
            $('#unenrollButton').button('reset');
            checkEnrollStatus($('#domainId').val());
        }
    }

    $.ajax(ajaxObj);
}


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

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function createErrorPage(errorCode, errorMsg) {
    var pageName = "errorpage.html";
    var qs = {
        errorCode: errorCode,
        errorMsg: errorMsg
    };
    var qsString = objToQueryString(qs);
    window.location.href = pageName.concat(qsString);
}

function getURLOrigin(){
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

function displayPreEnroll(is_master) {
    $('#consoleLinkText').html('Start your trial of Symantec Advanced Endpoint Protection');
    $('#signUpRow').show();
    $('#registrationForm').show();
    // Check if AD is enabled and set the toggle button for master status
    $('#assetMasterCloudToggleButton').show();
    if (is_master)
    	$('#assetMasterCheckbox').prop('disabled',true);
    else
    {
    	$('#assetMasterCheckbox').prop('checked',true);
  		$('#assetMasterCheckbox').prop('disabled',true);
  	}
    $('#epmpEnroll')[0].reset();
    $('#dvUnenroll').hide();
    $('#enrollmentStatus').html('');
    $('#hubStatusError').hide();
    $("#enrollmentStatus").removeAttr('style');
    $('#enrollmentTimeStamp').html('');
    $('#enrollmentCustomerId').html('');
    $('#enrollmentDomainId').html('');
}

function displayAfterEnroll(enrollmentTime, customerId, domainId){
    $('#signUpRow').hide();
    $('#registrationForm').hide();
    $('#assetMasterCloudToggleButton').hide(); // No need to display toggle after enrolment
    $('#dvUnenroll').show()
    $('#consoleLinkText').html('Log in to Symantec Advanced Endpoint Protection');
    $('#enrollmentStatus').html('Enrolled');
    $("#enrollmentStatus").removeAttr('style');   
    $('#hubStatusError').show();   
    var timestamp = new Date(enrollmentTime); // The 0 there is the key, which sets the date to the epoch
    $('#enrollmentTimeStamp').html(timestamp.toLocaleString());
    $('#enrollmentCustomerId').html(customerId);
    $('#enrollmentDomainId').html(domainId);
}

function displayUnenrollFailed() {
    $('#signUpRow').hide();
    $('#registrationForm').hide();
    $('#assetMasterCloudToggleButton').hide(); // No need to display toggle after enrolment
    $('#dvUnenroll').show()
    $('#consoleLinkText').html('Start your trial of Symantec Advanced Endpoint Protection');
    $('#enrollmentStatus').html('Unenrollment error. Please try again.');
    $("#enrollmentStatus").css("color", "red");  
    $('#hubStatusError').hide();  
    $('#enrollmentTimeStamp').html('');
    $('#enrollmentCustomerId').html('');
    $('#enrollmentDomainId').html('');
}

function printHubStatus(data){
	var biggestTime = 0;
	var latestUpdateServer = "Unknown";
	var installationStatus = "UNKNOWN";
    var hubStatusError = false;
    $('#hubStatusError').html('');


    for(var i = 0; i < data.length; i++){
        if(data[i].agent_name == "ASSET_COLLECTOR"){
            if(data[i].last_status_code == "0"){
                $("#assetsConnectionStatus").html("Active");
                $("#assetsConnectionStatus").css("color", "green");
                $("#assetsConnectionError").html("None");
            } 
			else if(data[i].last_status_code == enrollmentState.Unenrolled){
                $("#assetsConnectionStatus").html("Inactive");
                $("#assetsConnectionStatus").css("color", "black");
                $("#assetsConnectionError").html("None");
            }
			else {
                hubStatusError = true;
            }
			var timestamp = new Date(data[i].last_runtime);
			$('#assetsConnectionTime').html(timestamp.toLocaleString());
        }
        else if(data[i].agent_name == "EVENT_COLLECTOR"){
            if(data[i].last_status_code == "0"){
                $("#eventsConnectionStatus").html("Active");
                $("#eventsConnectionStatus").css("color", "green");
                $("#eventsConnectionError").html("None");
            } 
			else if(data[i].last_status_code == enrollmentState.Unenrolled){
                $("#eventsConnectionStatus").html("Inactive");
                $("#eventsConnectionStatus").css("color", "black");
                $("#eventsConnectionError").html("None");
            } else {
                hubStatusError = true;
            }
			var timestamp = new Date(data[i].last_runtime);
			$('#eventsConnectionTime').html(timestamp.toLocaleString());
        }
        else if(data[i].agent_name == "BRIDGE"){
            if(data[i].last_status_code == "0"){
                $("#bridgeConnectionStatus").html("Active");
                $("#bridgeConnectionStatus").css("color", "green");
                $("#bridgeConnectionError").html("None");
            } else  if(data[i].last_status_code == enrollmentState.Unenrolled){
                $("#bridgeConnectionStatus").html("Inactive");
                $("#bridgeConnectionStatus").css("color", "black");
                $("#bridgeConnectionError").html("None");
            } else {
                hubStatusError = true;
            }
			var timestamp = new Date(data[i].last_runtime);
			$('#bridgeConnectionTime').html(timestamp.toLocaleString());
        }
		// Even If there are no running status reported, we can still get installation status. 
		if (data[i].last_status_code == "-1"){
			latestUpdateServer = data[i].machine_name;
		} else {
			if(data[i].last_runtime > biggestTime && data[i].last_status_code == "0"){
				latestUpdateServer = data[i].machine_name;
				biggestTime = data[i].last_runtime;
			}
		}
		// Update installation status for this data set.
		installationStatus = data[i].install_status
		var installationStatusMsg = data[i].install_status_msg;
        if(installationStatus == "INSTALLED"){
			$("#hubInstallStatus").html(installationStatusMsg);
            $("#hubInstallStatus").css("color", "green");
        }
		else if(installationStatus == "NOTINSTALLED"){
            $("#hubInstallStatus").html(installationStatusMsg);
            $("#hubInstallStatus").css("color", "black");
        }
        else if(installationStatus == "PENDING"){
            $("#hubInstallStatus").html(installationStatusMsg);
            $("#hubInstallStatus").css("color", "orange");
        }
        else if(installationStatus == "UNKNOWN"){
            $("#hubInstallStatus").html(installationStatusMsg);
            $("#hubInstallStatus").css("color", "red");
        }
		else if(installationStatus == "ERROR"){
			$("#hubInstallStatus").html(installationStatusMsg);
            $("#hubInstallStatus").css("color", "red");
            hubStatusError = true;
		}
    }

    // There must be 3 HubAgentRunningStatuses for proper hub functioning
    if(data.length < 3 && installationStatus != "PENDING" && installationStatus != "INSTALLED"){
        hubStatusError = true;
    }

	if(latestUpdateServer != "Unknown"){
		// To be i18n
		$("#hubStatusTitle").html("Bridge Status" + "<br>" + latestUpdateServer);
	}
    if(hubStatusError && installationStatus != "PENDING" ){
        // To be i18n
        $('#hubStatusError').html("The bridge is malfunctioning. Check Bridge Status for details.");            
    }
}

function paintUIForMultiDomainError(data){
	if(typeof(value) !== "undefined" && data == true){
		enrolledDomainExists = true;
		$('#multiDomainError').show();
		$('#registrationForm').find("*").attr("disabled" , true);
	}
}
 	 		 
function paintUIForEnrollmentStatus(data){
	if(typeof(data) !== "undefined" ){
		if (data.enrollment_state == enrollmentState.UnenrollFailed) {
		displayUnenrollFailed();
		}
		else if (data.enrollment_state == enrollmentState.Enrolled) {
			displayAfterEnroll(data.enrollment_time, data.epmp_customer_id, data.epmp_domain_id);
		}
		else {
			displayPreEnroll(data.is_master);
		}
		queryHubStatus();
	}
	
}
InitializeTimer(30);