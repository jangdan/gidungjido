var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;


var MOUSE = new THREE.Vector2();



var MAX_COUNTRY_HEIGHT = 8;


//hardcoded constants extracted from the .json files in /data
var MAXIMUM_GDP_MD_EST = 15169683.3;
var MAXIMUM_POP_EST = 1346234014;



var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

var intendedcamerarotation = camera.rotation;
var intendedcamerazoom = camera.zoom;



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setClearColor(0xDDDDDD, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);





loadJSON("data/simplified.json", function(JSONObject){ //GeoJSON

	var data = JSONObject;


	for(i = 0; i < data.features.length; ++i){ //each feature (country)


		if(data.features[i].properties.SOVEREIGNT == "Antarctica") continue;


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

	
		var countryGeometry = new THREE.ExtrudeGeometry(countryShapes, { amount: Math.pow(data.features[i].properties.GDP_MD_EST/MAXIMUM_GDP_MD_EST, 1/3) * MAX_COUNTRY_HEIGHT, bevelEnabled: false } );
		
		var countryMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF*Math.random() } );


		var countryMesh = new THREE.Mesh(countryGeometry, countryMaterial);

		scene.add(countryMesh);

	}

});



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




