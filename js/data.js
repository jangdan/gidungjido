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



//GeoJSON parse functions

function parsePolygon(coordinates){

	var countryShapes;

	var paths = [];

	for(j = 0; j < coordinates.length; ++j){ //each seperate 'part' of a country (islands, exclaves, etc)


		var points = [];

		for(k = 0; k < coordinates[j].length; ++k){ //the points of that 'part'
			
			points.push(new THREE.Vector2( coordinates[j][k][0], coordinates[j][k][1] ));

		}

		var path = new THREE.Path(points);

		paths.push(path);

	}


	countryShapes = paths[0].toShapes(); //initialize the shape (toShapes() will only return ONE THREE.Shape)


	paths.splice(0, 1); //remove the first path (check GeoJSON specs for more information)

	Array.prototype.push.apply(countryShapes[0].holes, paths); //add the holes

	return countryShapes; //returns a THREE.Shape Array

}