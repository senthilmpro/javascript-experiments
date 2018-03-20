//create new channel
const channel = new BroadcastChannel("my-channel");

channel.onmessage = function(ev) {
  var el = document.getElementById("container");
  el.innerHTML = ev.data;
};