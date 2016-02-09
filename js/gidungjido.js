//CONSTANTS
var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;

var CAMERA_MOVEMENT_SPEED = 0.5;


var MOUSE = new THREE.Vector2();




var PRELOADED_DATA_INDICIES = [
	"Gross Domestic Product",
	"Population",
	"Gross Domestic Product per Capita"
];


var preloadeddata = { countries: [], maximums: [] }; //the data that will be shown




//varibales that can be changed with user interaction through the GUI

var MAXIMUM_COUNTRY_HEIGHT = 8;

var CONTRAST = 3;





//variables
var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

var intendedcamerarotation = camera.rotation;
var intendedcamerazoom = camera.zoom;



var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );

renderer.setClearColor(0xDDDDDD, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);




var countryMeshes = [];


var pressedkeys = [];





loadJSON("data/simplified.json", function(JSONObject){ //JSONObject is a very large GeoJSON-formatted object

	var data = JSONObject;

	//console.log(data.features.length);



	var maximums = [];

	maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ] = 0;
	maximums[ PRELOADED_DATA_INDICIES.indexOf("Population") ] = 0;
	maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product per Capita") ] = 0;


	for(i = 0; i < data.features.length; ++i){ //first, load the data


		//if(data.features[i].properties.SOVEREIGNT == "Antarctica") continue; //no. no antarctica.


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

		
		var countryGeometry = new THREE.ExtrudeGeometry(countryShapes, { amount: 1, bevelEnabled: false } );

		var countryMaterial = new THREE.MeshLambertMaterial();
		//var countryMaterial = new THREE.MeshNormalMaterial();


		var countryMesh = new THREE.Mesh(countryGeometry, countryMaterial);


		setheightdataforcountry(

			countryMesh,

			Math.pow(
				preloadeddata.countries[i].data[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ]/
				preloadeddata.maximums[ PRELOADED_DATA_INDICIES.indexOf("Gross Domestic Product") ], 1/CONTRAST
			)

		);



		scene.add(countryMesh);


		countryMeshes.push(countryMesh);

	}

});





function setheightdataforcountry(countryMesh, data){

	if(countryMesh.material instanceof THREE.MeshLambertMaterial || countryMesh.material instanceof THREE.MeshPhongMaterial)
		countryMesh.material.color.copy( colorfromdata(data) );
	
	countryMesh.scale.set( 1, 1, data * MAXIMUM_COUNTRY_HEIGHT );

}


/*
function setheightdata(which){ //'which' should be chosen from PRELOADED_DATA_INDICIES

	for(i = 0; i < countryMeshes.length; ++i){

		setheightdataforcountry( preloadeddata.countries[i][which] );

	}

}
*/



function colorfromdata(data){ //change this all the time!
	return new THREE.Color(data,data,data);
}





scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000 } ))); //debug





var spotlight = new THREE.SpotLight(0xFFFFD0, 1);

spotlight.position.set( -100, 100, 100 );

scene.add(spotlight);



scene.add(new THREE.HemisphereLight( 0x444444, 0x444444 ));



camera.position.z = 40;

//camera.rotation.order = "YXZ";

//camera.rotation.x = Math.PI/2;




function render(){

	requestAnimationFrame(render);

	
	//camera 조작


	//zooming

	camera.zoom += (intendedcamerazoom - camera.zoom) * 0.1;


	
	//rotating the camera with euler angles
	//pitch and yaw

	intendedcamerarotation.x += (window.innerHeight/2 - MOUSE.y) * 0.00005;
	intendedcamerarotation.y += (window.innerWidth/2 - MOUSE.x) * 0.00005;

	//limit the camera pitch

	if(0 > intendedcamerarotation.x) intendedcamerarotation.x = 0;
	if(intendedcamerarotation.x > Math.PI) intendedcamerarotation.x = Math.PI;
	
	
	camera.rotation.x += (intendedcamerarotation.x - camera.rotation.x) * 0.1;
	camera.rotation.y += (intendedcamerarotation.y - camera.rotation.y) * 0.1;



	/*
	//rotating the camera with quaternions
	var pitchQuaternion = new THREE.Quaternion();
	pitchQuaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/3 );

	var yawQuaternion = new THREE.Quaternion();
	yawQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI/3 )


	var rotationQuaternion = pitchQuaternion.multiply(yawQuaternion);

	camera.rotation.setFromQuaternion(rotationQuaternion);
	*/



	//moving
	
	//console.log(pressedkeys);


	if(keyPressed(87) || keyPressed(38)) //up
		camera.position.y += CAMERA_MOVEMENT_SPEED;

	if(keyPressed(83) || keyPressed(40)) //down
		camera.position.y -= CAMERA_MOVEMENT_SPEED;

	if(keyPressed(65) || keyPressed(37)) //left
		camera.position.x -= CAMERA_MOVEMENT_SPEED;

	if(keyPressed(68) || keyPressed(40)) //right
		camera.position.x += CAMERA_MOVEMENT_SPEED;


	camera.updateProjectionMatrix();



	renderer.render(scene, camera);

}

render();





window.addEventListener("resize", function(e){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});



window.addEventListener("mousemove", function(e){ //yaw

	MOUSE.x = e.clientX;
	MOUSE.y = e.clientY;

	return false;

}, false);



window.addEventListener("mousewheel", function(e){ //zooming

	intendedcamerazoom += (e.wheelDelta || e.detail) * 0.005;
	if(intendedcamerazoom < CAMERA_MINIMUM_ZOOM) intendedcamerazoom = CAMERA_MINIMUM_ZOOM;
	else if(intendedcamerazoom > CAMERA_MAXIMUM_ZOOM) intendedcamerazoom = CAMERA_MAXIMUM_ZOOM;

	return false;

}, false);





function keyPressed(key){

	if(pressedkeys.indexOf(key) != -1) return true;

	return false;

}
window.addEventListener("keydown", function(e){

	if(e.which == 9) //ignore the tab key
		return;


	if(!keyPressed(e.which))
		pressedkeys.push(e.which);

}, false);



window.addEventListener("keyup", function(e){

	if(keyPressed(e.which))
		pressedkeys.splice( pressedkeys.indexOf(e.which), 1 );

}, false);