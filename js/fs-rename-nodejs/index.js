var fs = require("fs");
var walk = require("walk");
var path = require("path");

var READ_PATH = "M:/folder_name";
var walker = walk.walk(READ_PATH, { followLinks: false });


let keyword = "XXX";
let newKeyWord = "AAAAA";
walker.on("file", function(root, stat, next) {

  
  var fullPath = root + "/" + stat.name;
  if (
    stat.name
      .toString()
      .toLowerCase()
      .indexOf(keyword) == -1
  ) {
    var extension = path.extname(stat.name);
    var basename = stat.name.split(extension);
    if (basename.length > 0) {
      var newName = basename[0] + " - " + newKeyWord + extension;
      fs.rename(fullPath, root + "/" + newName, function(err) {
        if (err) {
          console.log("ERROR >> " + err);
        }
        console.log("renamed :" + newName);
      });
    }
  }
  //console.log(stat.name);
  next();
});

walker.on("end", function() {
  // console.log(files);
});
