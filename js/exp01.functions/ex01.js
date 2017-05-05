/**
 * Experimenting with arguments of a function
 */
function alpha(){
    for(var i =0 ; i < arguments.length; i++){
        console.log("type of : "+ arguments[i] + " is "+ typeof arguments[i]);
    }
    return null;
}

/**
 * SAMPLE OUTPUT
 * 
 *  alpha(1,"a",null, undefined, {});
 * 
    VM583:4 type of : 1 is number
    VM583:4 type of : a is string
    VM583:4 type of : null is object
    VM583:4 type of : undefined is undefined
    VM583:4 type of : [object Object] is object
 * 
 */