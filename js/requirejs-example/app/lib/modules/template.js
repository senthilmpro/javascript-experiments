define(['underscore', 'jquery'], function() {
  var showName = function(el, n) {
    var temp = _.template("Hello <%= name %>");
    $(el).html(temp({name: n}));
  };
  return {
    showName: showName
  };
});


