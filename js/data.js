//from http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(url, callback){   

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");

	xobj.open('GET', url, true);

	xobj.onreadystatechange = function(){
		if(xobj.readyState == 4 && xobj.status == "200"){
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(JSON.parse(xobj.responseText));
		}
	};

	xobj.send(null);  

}