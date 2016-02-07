var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;



var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

var cameraactualrotation = camera.rotation;
var cameraactualzoom = camera.zoom;



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setClearColor(0xDDDDDD, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);





loadJSON("data/simplified.json", function(JSONObject){

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

	
		var countryGeometry = new THREE.ExtrudeGeometry(countryShapes, { amount: 2, bevelEnabled: false } );
		
		var countryMaterial = new THREE.MeshLambertMaterial( { color: 0x3F6536 } );


		var countryMesh = new THREE.Mesh(countryGeometry, countryMaterial);

		scene.add(countryMesh);

	}

});



scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000} ))); //debug





var spotlight = new THREE.SpotLight(0xFFFFD0, 1);

spotlight.position.set( -100, 100, 100 );

scene.add(spotlight);



scene.add(new THREE.HemisphereLight( 0x444444, 0x444444 ));



camera.position.z = 10;
camera.rotation.x = Math.PI/2;




function render(){

	requestAnimationFrame(render);



	camera.zoom += (cameraactualzoom - camera.zoom) * 0.1;

	camera.rotation.x += (cameraactualrotation.x - camera.rotation.x) * 0.01;
	camera.rotation.y += (cameraactualrotation.y - camera.rotation.y) * 0.01;


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

	cameraactualrotation.y = -((e.clientX)/window.innerWidth - 0.5)*2*Math.PI;
	cameraactualrotation.x = -((e.clientY)/window.innerHeight - 0.5)*Math.PI;

	return false;

}, false);



window.addEventListener("mousewheel", function(e){ //zooming

	cameraactualzoom += (e.wheelDelta || e.detail) * 0.005;
	if(cameraactualzoom < CAMERA_MINIMUM_ZOOM) cameraactualzoom = CAMERA_MINIMUM_ZOOM;
	else if(cameraactualzoom > CAMERA_MAXIMUM_ZOOM) cameraactualzoom = CAMERA_MAXIMUM_ZOOM;

	return false;

}, false);