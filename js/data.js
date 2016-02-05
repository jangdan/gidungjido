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



/*
//unsused d3.js code
d3.json("data/ne_50m_admin_0_sovereignty.json", function(json){

	var paths = svg.selectAll("path")
	.data(json.features);

	paths.enter()
	.append("path")
	.attr("fill", function(d, i){

		return "rgb("+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+")"}
	)
	.attr("d", d3.geo.path().projection(projection) );

	console.log(paths);
});
*/