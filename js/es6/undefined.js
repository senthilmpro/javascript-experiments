var uVar = undefined;
!uVar // true
typeof uVar // "undefined"

uVar = null;
!uVar // true
typeof uVar // "object"

uVar = 1;
!uVar // false
typeof uVar // "number"

uVar = "Senthil";
!uVar // false
typeof uVar // "string"
uVar instanceof String // true

uVar = [1,2,3];
!uVar // false
typeof uVar // "object"
uVar instanceof Array // true
uVar instanceof Object // true

uVar = {};
!uVar // false
typeof uVar //"object"
uVar instanceof Object //true
uVar instanceof Array //false

uVar = new Date();
!uVar // false
typeof uVar // "object"
uVar instanceof Date // true
uvar instanceof Object // true


