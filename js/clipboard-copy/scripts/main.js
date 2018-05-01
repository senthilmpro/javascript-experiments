(function(){

    document.getElementById('btnCopy').onclick = function(){
        copyContent();
    }

    
    document.getElementById('btnPaste').onclick = function(){
        pasteContent();
    }

    function copyContent(){
        if(document.queryCommandSupported('copy')) {
            var range = document.createRange();
            range.selectNode(document.querySelector('#clipboard'));
            window.getSelection().addRange(range);
            document.getElementById('clipboard').focus();
            document.execCommand('SelectAll');

            document.execCommand('Copy');
        }
    }


    function pasteContent(){
        //var el = document.querySelector('#pasteContainer');
        //el.select();
        document.getElementById('pasteContainer').focus();

        try {
            var successful = document.execCommand('paste');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('paste text command was ' + msg);
        } catch(ex){
            console.log('err > ', ex);
        }
    }

    var CLIPBOARD = new CLIPBOARD_CLASS("my_canvas", true);

/**
 * image pasting into canvas
 * 
 * @param {string} canvas_id - canvas id
 * @param {boolean} autoresize - if canvas will be resized
 */
function CLIPBOARD_CLASS(canvas_id, autoresize) {
	var _self = this;
	var canvas = document.getElementById(canvas_id);
	var ctx = document.getElementById(canvas_id).getContext("2d");

	//handlers
	document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

	//on paste
	this.paste_auto = function (e) {
		if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (!items) return;
			
			//access data directly
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					//image
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);
					this.paste_createImage(source);
				}
			}
			e.preventDefault();
		}
	};
	//draw pasted image to canvas
	this.paste_createImage = function (source) {
		var pastedImage = new Image();
		pastedImage.onload = function () {
			if(autoresize == true){
				//resize
				canvas.width = pastedImage.width;
				canvas.height = pastedImage.height;
			}
			else{
				//clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(pastedImage, 0, 0);
		};
		pastedImage.src = source;
	};
}


})();