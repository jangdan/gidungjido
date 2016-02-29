//CONSTANTS
var CLEAR_COLOR = 0xDDDDDD;



var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;

var CAMERA_MOVEMENT_SPEED = 0.5;


var MOUSE = new THREE.Vector2();

stopcameramotion(); //keep the imaginary mouse at the center so nothing moves... yet



var PRELOADED_DATA_INDICIES = [
	"Gross Domestic Product",
	"Population",
	"Gross Domestic Product per Capita"
];


var preloadeddata = { countries: [], maximums: [] }; //the data that will be shown




//defaults

var DEFAULT_MAXIMUM_COUNTRY_HEIGHT = 4;

var DEFAULT_CONTRAST = 3;


//varibales that can be changed with user interaction through the GUI

var MAXIMUM_COUNTRY_HEIGHT = DEFAULT_MAXIMUM_COUNTRY_HEIGHT;

var CONTRAST = DEFAULT_CONTRAST;


var DATA_INDEX = 0; //choose from PRELOADED_DATA_INDICIES




var scene = new THREE.Scene();




var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

camera.rotation.order = "ZXY";


var intendedcamera = {
	zoom: camera.zoom,
	rotation: new THREE.Euler(),
	position: new THREE.Vector3()
}

intendedcamera.position.copy(camera.position);
intendedcamera.rotation.copy(camera.rotation);


intendedcamera.position.z = camera.position.z = 40;


//random starting rotations
camera.rotation.x = intendedcamera.rotation.x = Math.random() * Math.PI/2;
camera.rotation.z = intendedcamera.rotation.z = Math.random() * Math.PI*2;




var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );

renderer.setClearColor(CLEAR_COLOR, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);




var pressedkeys = [];



var raycaster = new THREE.Raycaster();

var NORMALIZED_MOUSE = new THREE.Vector2();





var countries = [];





loadJSON("data/ne_10m_admin_0_sovereignty_moderate.json", function(JSONObject){ //JSONObject is a very large GeoJSON-formatted object

	var data = JSONObject;

	//console.log(data.features.length);



	var maximums = [];

	maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] = 0;
	maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] = 0;
	maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] = 0;


	for(i = 0; i < data.features.length; ++i){ //first, load the data


		var countrydata = {
			"name": data.features[i].properties.SOVEREIGNT,
			"data": [
				data.features[i].properties.GDP_MD_EST,
				data.features[i].properties.POP_EST,
				data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST,
			]
		};


		preloadeddata.countries.push(countrydata);


		//validate & update maximum values (for later use)

		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] < data.features[i].properties.GDP_MD_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] = data.features[i].properties.GDP_MD_EST;

		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] < data.features[i].properties.POP_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] = data.features[i].properties.POP_EST;

		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] < data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] = data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST;

	}

	preloadeddata.maximums = maximums;

	//console.log(preloadeddata);


	for(i = 0; i < data.features.length; ++i){ //then, show the data. (ugh TWO FOR LOOPS?!?)


		if(data.features[i].properties.SOVEREIGNT == "Antarctica") continue; //skip Antarctica (although there are stats for the continent)



		var countryShapes = []; //will be a THREE.Shape or an Array of THREE.Shape


		if(!data.features[i].geometry) continue;

		switch(data.features[i].geometry.type){

			case "Polygon": //http://geojson.org/geojson-spec.html#id4

				Array.prototype.push.apply( countryShapes, parsePolygon(data.features[i].geometry.coordinates) );

				break;


			case "MultiPolygon": //

				for(l = 0; l < data.features[i].geometry.coordinates.length; ++l)
					Array.prototype.push.apply( countryShapes, parsePolygon(data.features[i].geometry.coordinates[l]) );

				break;

		}


		var country = new Country(data.features[i].properties.SOVEREIGNT);

		country.setFromShapesAndData( countryShapes, preloadeddata.countries[i].data[DATA_INDEX] / preloadeddata.maximums[DATA_INDEX] )


		scene.add(country.mesh);


		countries.push(country);

	}



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


});





function updatecountryheights(){

	for(i = 0; i < countries.length; ++i){

		var data = countries[i].data;

		countries[i].setHeightData(data);

	}

}



function setHeightDataSource(which){ //'which' should be chosen from PRELOADED_DATA_INDICIES
	
	DATA_INDEX = which;

	for(i = 0; i < countries.length; ++i){

		countries[i].setHeightData( preloadeddata.countries.filter( function(datacountry){ return datacountry.name === countries[i].name } )[0].data[DATA_INDEX] / preloadeddata.maximums[DATA_INDEX] ); //TODO: make this more efficient
		//console.log(countries[i].name, preloadeddata.countries[i].name)
	}

}





//scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000 } ))); //debug






/*
var spotlight = new THREE.SpotLight(0xFFFFD0, 1);

spotlight.position.set( -100, 100, 100 );

scene.add(spotlight);
*/




scene.add(new THREE.HemisphereLight( 0x444444, 0x444444 ));





//scene.fog = new THREE.FogExp2( CLEAR_COLOR, 0.0035 );





function render(time){

	requestAnimationFrame(render);

	
	//camera 조작


	//zooming

	camera.zoom += (intendedcamera.zoom - camera.zoom) * 0.1;


	
	//rotating the camera with euler angles
	//pitch and yaw

	intendedcamera.rotation.x += (window.innerHeight/2 - MOUSE.y) * 0.00005; //mouse's up-down y axis motion maps to the camera's x rotation
	intendedcamera.rotation.z += (window.innerWidth/2 - MOUSE.x) * 0.00005; //mouse's left-right x axis motion maps to the camera's z rotation

	//limit the camera pitch

	if(0 > intendedcamera.rotation.x) intendedcamera.rotation.x = 0;
	if(intendedcamera.rotation.x > Math.PI) intendedcamera.rotation.x = Math.PI;
	
	
	camera.rotation.x += (intendedcamera.rotation.x - camera.rotation.x) * 0.1;
	camera.rotation.z += (intendedcamera.rotation.z - camera.rotation.z) * 0.1;



	//moving
	
	//console.log(pressedkeys);


	if(keyPressed(87) || keyPressed(38)){ //w and up 
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z + Math.PI/2); //WHY do i have to add 90 degrees someone email me
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z + Math.PI/2);
	}

	if(keyPressed(83) || keyPressed(40)){ //s and down
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z - Math.PI/2);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z - Math.PI/2);
	}

	if(keyPressed(65) || keyPressed(37)){ //a and left
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z + Math.PI);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z + Math.PI);
	}

	if(keyPressed(68) || keyPressed(40)){ //d and right
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z);
	}

	//z-axis motion
	if(keyPressed(16)){
		intendedcamera.position.z -= CAMERA_MOVEMENT_SPEED;
	}

	if(keyPressed(32)){
		intendedcamera.position.z += CAMERA_MOVEMENT_SPEED;
	}


	camera.position.x += (intendedcamera.position.x - camera.position.x) * 0.05;
	camera.position.y += (intendedcamera.position.y - camera.position.y) * 0.05;
	camera.position.z += (intendedcamera.position.z - camera.position.z) * 0.05;



	//spotlight.position.copy(camera.position);



	camera.updateProjectionMatrix();




	raycaster.setFromCamera( NORMALIZED_MOUSE, camera );



	//the code that follows might, in a worst case, execute two for loops - it needs optimization

	var intersections = raycaster.intersectObjects(scene.children);


	if(intersections.length > 0){

		//console.log(intersections[0]);


		var pointedCountry;
	
		for(i = 0; i < countries.length; ++i){
	
			if(countries[i].mesh === intersections[0].object){
	
				pointedCountry = countries[i];
	
				break;
			}
		}
	
		console.log(pointedCountry);


		//TODO: show country information, the stat data in numbers, make it clear that youre pointing at that country by coloring it in, etc

	}




	TWEEN.update(time);


	renderer.render(scene, camera);

}

render();





window.addEventListener("resize", function(e){


	if(menuvisible) stopcameramotion(); //stop any motion


	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});





window.addEventListener("mousewheel", function(e){ //zooming

	intendedcamera.zoom += (e.wheelDelta || e.detail) * 0.005;
	if(intendedcamera.zoom < CAMERA_MINIMUM_ZOOM) intendedcamera.zoom = CAMERA_MINIMUM_ZOOM;
	else if(intendedcamera.zoom > CAMERA_MAXIMUM_ZOOM) intendedcamera.zoom = CAMERA_MAXIMUM_ZOOM;

	return false;

}, false);




window.addEventListener("mousemove", function(e){

	if(menuvisible //ignore when you have something better to do with the mouse than moving it around without a visible cursor on the monitor
	)
		return;

	
	MOUSE.x = e.clientX;
	MOUSE.y = e.clientY;


	//make NORMALIZED_MOUSE feel cartesian (ugh what does that even mean)

	NORMALIZED_MOUSE.x =  (e.clientX/window.innerWidth)*2 - 1;
	NORMALIZED_MOUSE.y = -(e.clientY/window.innerHeight)*2 + 1;


	return false;

}, false);




function keyPressed(key){

	if(pressedkeys.indexOf(key) != -1) return true;

	return false;

}


window.addEventListener("keydown", function(e){

	//console.log(e.which);


	if(e.which == 9 //ignore the tab key
	)
		return;


	if(e.which == 27){ //escape key

		togglemenu();

		return;
	}


	if(menuvisible) //note that this must be after the escape key detection or else we're "locked out"
		return;


	if(!keyPressed(e.which))
		pressedkeys.push(e.which);

}, false);



window.addEventListener("keyup", function(e){

	if(keyPressed(e.which))
		pressedkeys.splice( pressedkeys.indexOf(e.which), 1 );

}, false);






function stopcameramotion(){
	MOUSE.set(window.innerWidth/2, window.innerHeight/2);
	pressedkeys = [];
}





//DOM interaction
var menuvisible = true;

var menuopacity = 1;


function togglemenu(){

	document.getElementById("source").blur();


	if(menuvisible){

		new TWEEN.Tween( { opacity: 1 } )
			.to( { opacity: 0 }, 100 )
			.onUpdate( function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();

	} else {

		stopcameramotion(); //stop any motion


		new TWEEN.Tween( { opacity: 0 } )
			.to( { opacity: 1 }, 100 )
			.onUpdate( function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();

	}

	menuvisible = !menuvisible;

}





//misc. functions

//a modified version of http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
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