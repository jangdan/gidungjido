//CONSTANTS

var CLEAR_COLOR = 0xDDDDDD;



var FLOOR_WIDTH = 500;
var FLOOR_HEIGHT = 300;



var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;

var CAMERA_MOVEMENT_SPEED = 0.5;




var MOUSE = new THREE.Vector2();

//stopcameramotion(); //keep the imaginary mouse at the center so nothing moves... yet


var NORMALIZED_MOUSE = new THREE.Vector2(); //for use with the raycaster



var PRESSED_KEYS = []; //keys that are currently pressed




var MATERIAL_INDICIES = [
	"MeshNormalMaterial",
	"flags"
];


var PRELOADED_DATA_INDICIES = [
	"Gross Domestic Product",
	"Population"/*,
	"Gross Domestic Product per Capita"*/
];





//DOM CONSTANTS

var SLIDER_RESOLUTION = 10;



var MAXIMUM_COUNTRY_HEIGHT_MINIMUM = 1;
var MAXIMUM_COUNTRY_HEIGHT_MAXIMUM = 10;

var CONTRAST_MINIMUM = 1;
var CONTRAST_MAXIMUM = 5;




//DEFAULT VALUES

var DEFAULT_MAXIMUM_COUNTRY_HEIGHT = 4;

var DEFAULT_CONTRAST = 3;



var DEFAULT_MATERIAL = 1;





//varibales that can be changed with user interaction through the GUI

var SHOW_INFO = true;


var MAXIMUM_COUNTRY_HEIGHT = DEFAULT_MAXIMUM_COUNTRY_HEIGHT;

var CONTRAST = DEFAULT_CONTRAST;


var DATA_INDEX = 0; //choose from PRELOADED_DATA_INDICIES



var MATERIAL = 1;



var SHADOWS = false;






//data

var preloadeddata = { countries: [], maximums: [] }; //the data that will be shown

function DATA_MAXIMUM(){ //a function that pretends to be a variable

	return preloadeddata.maximums[DATA_INDEX];

}







//initialization

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


//TODO: random starting position

intendedcamera.position.z = camera.position.z = 30;


//random starting rotations

camera.rotation.x = intendedcamera.rotation.x = Math.random() * Math.PI/2;
camera.rotation.z = intendedcamera.rotation.z = Math.random() * Math.PI*2;




var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false, preserveDrawingBuffer: true } );

renderer.setClearColor(CLEAR_COLOR, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


var MAX_ANISOTROPY = renderer.getMaxAnisotropy();


document.body.appendChild(renderer.domElement);





var raycaster = new THREE.Raycaster();






//frequently accessed DOM elements

var countryinfo = document.getElementById("countryinfo");






//disable the floor code until shadows work

/*

var floorGeometry = new THREE.BoxGeometry( FLOOR_WIDTH, FLOOR_HEIGHT, DEFAULT_MAXIMUM_COUNTRY_HEIGHT );

var floorMaterial = new THREE.MeshLambertMaterial( { color: CLEAR_COLOR } );
//var floorMaterial = new THREE.MeshPhongMaterial( { color: CLEAR_COLOR, shininess: 100 } );


var floor = new THREE.Mesh( floorGeometry, floorMaterial );

floor.position.set( 0, 0, -DEFAULT_MAXIMUM_COUNTRY_HEIGHT/2 );


if(SHADOWS) floor.recieveShadow = true;



scene.add( floor );

*/







//data

var countries = [];





var loadingmanager = new THREE.LoadingManager();


loadingmanager.onProgress = function ( item, loaded, total ) {

	console.log( item, loaded, total );

};




var textureloader = new THREE.TextureLoader( loadingmanager );




loadingmanager.onLoad = function(){

	document.getElementById("loading").style.display = "none";
	document.getElementById("loaded").style.display = "block";

};




loadJSON("data/ne_10m_admin_0_sovereignty_moderate.json", function(JSONObject){ //'JSONObject' is a very large GeoJSON-formatted object

	var data = JSONObject;

	//console.log(data.features.length);




	var maximums = [];

	maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] = 0;
	maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] = 0;
	//maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] = 0;




	for( i = 0; i < data.features.length; ++i ){


		if(data.features[i].properties.TYPE === "Indeterminate") continue; //ignore 'Indeterminate' countries



		//data

		var countrydata = {

			"name": data.features[i].properties.SOVEREIGNT,

			"ISO_3166-1": data.features[i].properties.ISO_A2, // ISO 3166-1: the default identification method for countries in this project

			"data": [
				data.features[i].properties.GDP_MD_EST,
				data.features[i].properties.POP_EST,
				//data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST,
			]

		};



		preloadeddata.countries.push(countrydata);



		//validate & update maximum values (for later use)

		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] < data.features[i].properties.GDP_MD_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] = data.features[i].properties.GDP_MD_EST;

		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] < data.features[i].properties.POP_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] = data.features[i].properties.POP_EST;

		/*
		if( maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] < data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST )
			maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] = data.features[i].properties.GDP_MD_EST/data.features[i].properties.POP_EST;
		*/





		//shapes

		var countryShapes = []; //this will be a THREE.Shape or an Array of THREE.Shape

		var exteriorRing = []; //an array of Vector2s



		if(!data.features[i].geometry) continue; //skip if there is no geometry


		switch(data.features[i].geometry.type){

			case "Polygon": //http://geojson.org/geojson-spec.html#id4

				var parseddata = parsePolygon(data.features[i].geometry.coordinates);

				Array.prototype.push.apply( countryShapes, parseddata.countryShapes );
				Array.prototype.push.apply( exteriorRing, parseddata.exteriorRing );

				break;


			case "MultiPolygon": //an array of 'Polygon's

				for( l = 0; l < data.features[i].geometry.coordinates.length; ++l ){
				
					var parseddata = parsePolygon(data.features[i].geometry.coordinates[l]);

					Array.prototype.push.apply( countryShapes, parseddata.countryShapes );
					Array.prototype.push.apply( exteriorRing, parseddata.exteriorRing );

				}

				break;

		}





		//creating 'Country' objects

		var country = new Country( data.features[i].properties.SOVEREIGNT, data.features[i].properties.ISO_A2, "assets/flags-normal/" + data.features[i].properties.ISO_A2 + ".png", countryShapes, exteriorRing );


		if(SHADOWS){

			country.mesh.castShadow = true;
			country.mesh.recieveShadow = true;

		}


		countries.push(country);

	}



	preloadeddata.maximums = maximums; //save the maximum data


	//console.log(preloadeddata);




	function parsePolygon(coordinates){

		var countryShapes;

		var exteriorRing = [];


		var paths = [];


		for( j = 0; j < coordinates.length; ++j ){ //the lines that define the country (or a part of a country)

			var points = [];

			for( k = 0; k < coordinates[j].length; ++k ){ //the points of that line
				
				points.push( new THREE.Vector2( coordinates[j][k][0], coordinates[j][k][1] ) );


				if( j === 0 ){

					exteriorRing.push( new THREE.Vector2( coordinates[j][k][0], coordinates[j][k][1] ) );

				}

			}

			var path = new THREE.Path(points);

			paths.push(path);

		}



		countryShapes = paths[0].toShapes(); //initialize the shape (toShapes() will only return ONE THREE.Shape; it won't be an array)


		paths.splice(0, 1); //remove the first path to add holes (check GeoJSON specs for more information)

		Array.prototype.push.apply(countryShapes[0].holes, paths); //add the holes


		return { countryShapes, exteriorRing }; //returns a THREE.Shape array

	}






	//mamuri

	for( i = 0; i < countries.length; ++i ){

		countries[i].setHeightData( preloadeddata.countries[i].data[DATA_INDEX] / preloadeddata.maximums[DATA_INDEX] );

		scene.add(countries[i].mesh);

	}

});





//add misc stuff to the scene

//scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000 } ))); //debug





var directionallight = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );

directionallight.position.set( 1, 1, Math.sqrt(3) );


//TODO: shadows

if(SHADOWS){

	directionallight.castShadow = true;

	directionallight.shadow.camera.position.set( 1, 1, Math.sqrt(3) );

}


scene.add(directionallight);





scene.add(new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.7 ));






//global functions that apply on all countries & their data

function updatecountryheights(){

	for(i = 0; i < countries.length; ++i){

		var data = countries[i].data;

		countries[i].setHeightData(data);

	}

}



function setheightdatasource(which){ //'which' should be chosen from PRELOADED_DATA_INDICIES
	
	DATA_INDEX = which;


	for( i = 0; i < countries.length; ++i ){

		countries[i].setHeightData(

			preloadeddata.countries.filter(
				function(datacountry){ return datacountry.name === countries[i].name } //select the country by name
			)[0].data[DATA_INDEX] / preloadeddata.maximums[DATA_INDEX]

		); //TODO: make this more efficient

		//console.log(countries[i].name, preloadeddata.countries[i].name)

	}

}




function setMaterial(which){

	MATERIAL = parseInt(which);


	switch(MATERIAL){

		case 0: // "MeshNormalMaterial"

			for( i = 0; i < countries.length; ++i )
				countries[i].setMaterial(MATERIAL);

			break;

		case 1: // "flags"

			for( i = 0; i < countries.length; ++i )
				countries[i].setMaterial(MATERIAL);

			break;

	}

}






function render(time){

	requestAnimationFrame(render);

	



	//camera 조작

	//zooming

	camera.zoom += (intendedcamera.zoom - camera.zoom) * 0.1;


	
	//rotating the camera with euler angles

	//pitch and yaw

	if(!menuvisible){
		intendedcamera.rotation.x += (window.innerHeight/2 - MOUSE.y) * 0.00005; //mouse's up-down y axis motion maps to the camera's x rotation
		intendedcamera.rotation.z += (window.innerWidth/2 - MOUSE.x) * 0.00005; //mouse's left-right x axis motion maps to the camera's z rotation
	}


	//limit the camera pitch

	if(0 > intendedcamera.rotation.x) intendedcamera.rotation.x = 0;
	if(intendedcamera.rotation.x > Math.PI) intendedcamera.rotation.x = Math.PI;
	
	
	camera.rotation.x += (intendedcamera.rotation.x - camera.rotation.x) * 0.1;
	camera.rotation.z += (intendedcamera.rotation.z - camera.rotation.z) * 0.1;



	//moving

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



	camera.updateProjectionMatrix();





	if(!menuvisible && SHOW_INFO){ //dont show the info pane if the main menu is visible, or if the user doesn't want to see it

		raycaster.setFromCamera( NORMALIZED_MOUSE, camera );
	
	
		//the code that follows might, in a worst case, execute two for loops - it needs optimization
	
		var intersections = raycaster.intersectObjects( countries.map( function(country){ return country.mesh; } ) );
	

		if(intersections.length > 0){
	
			//console.log(intersections[0]);
	
			var pointedCountry;
		
			for( i = 0; i < countries.length; ++i ){
		
				if(countries[i].mesh === intersections[0].object){
		
					pointedCountry = countries[i];
		
					break;

				}
			}
		
			//console.log(pointedCountry);
	
	
			
			showinfo();
	

			countryinfo.style.left = MOUSE.x+"px";
			countryinfo.style.top = MOUSE.y+"px";
	

			countryinfo.innerHTML =
				"<h3>"+pointedCountry.name+"</h3>"
			+	""+PRELOADED_DATA_INDICIES[DATA_INDEX]+":<br>"
			+	""+Math.round(pointedCountry.data * DATA_MAXIMUM()).toLocaleString()+""
			;
	
		} else {
	
			hideinfo();
	
		}

	}





	TWEEN.update(time);



	renderer.render(scene, camera);

}



render();






//events

window.addEventListener( "resize", function(e){

	if(menuvisible) stopcameramotion(); //stop any motion if the menu is visible



	camera.aspect = window.innerWidth/window.innerHeight;

	camera.updateProjectionMatrix();


	renderer.setSize(window.innerWidth, window.innerHeight);

});





window.addEventListener( "mousewheel", function(e){ //zooming

	/* //don't uncomment
	if(menuvisible
	)
		return;
	*/



	intendedcamera.zoom += (e.wheelDelta || e.detail) * 0.005;

	//clip value
	if(intendedcamera.zoom < CAMERA_MINIMUM_ZOOM) intendedcamera.zoom = CAMERA_MINIMUM_ZOOM;
	else if(intendedcamera.zoom > CAMERA_MAXIMUM_ZOOM) intendedcamera.zoom = CAMERA_MAXIMUM_ZOOM;


	return false;

}, false);




window.addEventListener( "mousemove", function(e){

	if(menuvisible //ignore when you have something better to do with the mouse than moving it around without a visible cursor on the monitor
	)
		return;


	
	MOUSE.x = e.clientX;
	MOUSE.y = e.clientY;



	//from a three.js example
	//for the raycaster

	NORMALIZED_MOUSE.x =  (e.clientX/window.innerWidth)*2 - 1;
	NORMALIZED_MOUSE.y = -(e.clientY/window.innerHeight)*2 + 1;


	return false;

}, false);




//specifically key events

function keyPressed(key){ //check if the key is currently pressed

	if(PRESSED_KEYS.indexOf(key) != -1) return true;

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


	if(e.which == 73){ //'i'

		toggleinfo();

		return;

	}


	if(e.which == 80){ //'p'

		screenshot();

		return;

	}



	if(menuvisible) //note that this must be after the escape key detection or else we're "locked out"
		return;





	if(!keyPressed(e.which))
		PRESSED_KEYS.push(e.which);


}, false);



window.addEventListener("keyup", function(e){

	if(keyPressed(e.which))
		PRESSED_KEYS.splice( PRESSED_KEYS.indexOf(e.which), 1 );


}, false);





function stopcameramotion(){

	//MOUSE.set(window.innerWidth/2, window.innerHeight/2);

	PRESSED_KEYS = [];

}






//DOM interaction

var menuvisible = true;


function togglemenu(){

	if(menuvisible){

		new TWEEN.Tween( { opacity: 1 } )
			.to( { opacity: 0 }, 100 )
			.onUpdate( function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})
			.onComplete( function(){
				document.getElementById("menu").style.display = "none";
			})
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();

	} else {

		stopcameramotion(); //stop any motion


		document.getElementById("menu").style.display = "block";

		new TWEEN.Tween( { opacity: 0 } )
			.to( { opacity: 1 }, 100 )
			.onUpdate( function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();

	}



	menuvisible = !menuvisible;



	document.getElementById("source").blur();



	revalidateinfo();

}





function toggleinfo(){

	SHOW_INFO = !SHOW_INFO;	


	document.getElementById("countryinfocheckbox").checked = SHOW_INFO;


	/*
	if(countryinfo.style.display === "none" && SHOW_INFO) showinfo();
	else if(countryinfo.style.display === "block" || !SHOW_INFO) hideinfo();
	*/


	revalidateinfo();

}





function revalidateinfo(){

	if(SHOW_INFO && !menuvisible) showinfo();
	else if(!SHOW_INFO || menuvisible) hideinfo();

}


function hideinfo(){

	countryinfo.style.display = "none";

}

function showinfo(){

	countryinfo.style.display = "block";

}





function screenshot(){

	window.open( renderer.domElement.toDataURL("image/png"), "Final");

	togglemenu();

}






//other functions


//a modified version of http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

function loadJSON(url, callback){   

	var xobj = new XMLHttpRequest();

	xobj.overrideMimeType("application/json");


	xobj.open('GET', url, true);


	xobj.onreadystatechange = function(){


		if(xobj.readyState == 4 && xobj.status == "200"){

			//Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(JSON.parse(xobj.responseText));

		}

	};

	xobj.send(null);  

}