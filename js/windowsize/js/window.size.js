window.addEventListener('resize', update);

function update(){
    var x = window.document.getElementById('windowsize');
    x.innerHTML = 'height : '+ window.innerHeight +' width :'+ window.innerWidth;
}

window.onload = function(){
	update()
}