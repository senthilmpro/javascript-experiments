(function() {
  //create new channel
  const channel = new BroadcastChannel("my-channel");

  try {
    var btn = document.getElementById("updateBtn");
    btn.onclick = function() {
      var msg = document.getElementById("txtMsg").value || "";
      channel.postMessage(msg);
    };
  } catch (ex) {
    console.log("ERROR : ", ex);
  }
})();
