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
$(document).ready(function () {
    submitSignUpForm();
});

function submitSignUpForm(){
    var accessToken = getParameterByName("accessToken");
    var adminId = getParameterByName("adminId");
    var origin = getURLOrigin();
    
    var restAPIURL=origin + "/sepm/api/v1/admin-users/" + adminId;
    var authString = "Bearer " + accessToken;

    var ajaxObj = {
        url: restAPIURL,
        type: "GET",
        headers: {},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (data) {
            var fullName = data.fullName;
            var email = data.email;
            var company = data.companyName;
            var onboardUrl = data.cloud_onboarding;
            
            if (onboardUrl != null) {
                $('#signUpForm').attr("action", onboardUrl);
            }
            
            // Pass hard-coded product ID as per CS-CP team's requirement
            var productId = $('<input id="pr_id" name="pr_id" value="31B0C880-0229-49E8-94C5-48D56B1BD7B9">');
            $('#signUpForm').append(productId);

            if (fullName != null) {
                var names = fullName.split(" ");
                var firstName = $('<input id="f_name" name="f_name" value="' + names[0] + '">');
                $('#signUpForm').append(firstName);
                if (names.length > 1) {
                    var lastName = $('<input id="l_name" name="l_name" value="' + names[names.length - 1] + '">');
                    $('#signUpForm').append(lastName);
                }
            }
            if (email != null) {
                email = $('<input id="email" name="email" value="' + email + '">');
                $('#signUpForm').append(email);
            }
            if (company != null) {
                company = $('<input id="comp_name" name="comp_name" value="' + company + '">');
                $('#signUpForm').append(company);
            }
            $('#signUpForm').submit();
        },
        error: function (data) {
            $('#signUpForm').submit();
        }
    }

    $.ajax(ajaxObj);
}

function getURLOrigin(){
    var location = document.location;    
    var hostname = location.hostname;
    var port = location.port;
    var protocol = location.protocol;
    return protocol + "//" + hostname + ":" + port;
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}