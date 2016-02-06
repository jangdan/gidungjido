var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setClearColor(0x111111, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);





loadJSON("data/ne_10m_admin_0_sovereignty.json", function(JSONObject){

	var data = JSONObject;


	for(i = 0; i < data.features.length; ++i){ //each feature (country)


		if(data.features[i].geometry.type != "Polygon") continue;


		var countryShapes = [];

		for(j = 0; j < data.features[i].geometry.coordinates.length; ++j){ //each seperate 'part' of a country (islands, exclaves, etc)


			var points = [];

			for(k = 0; k < data.features[i].geometry.coordinates[j].length; ++k){ //the points of that 'part'
				
				points.push(new THREE.Vector2( data.features[i].geometry.coordinates[j][k][0], data.features[i].geometry.coordinates[j][k][1] ));

			}

			console.log(data.features[i].properties.SOVEREIGNT, points);

			var path = new THREE.Path(points);

			Array.prototype.push.apply(countryShapes, path.toShapes())

		}

		console.log(data.features[i].properties.SOVEREIGNT, countryShapes);


		//var countryGeometry = new THREE.ShapeGeometry(countryShapes);
	
		var countryGeometry = new THREE.ExtrudeGeometry(countryShapes, { amount: 2, bevelEnabled: false } );

		//countryGeometry.translate( 0, 0, -1 );
		

		var countryMaterial = new THREE.MeshLambertMaterial( { color: 0x3F6536 } );


		var countryMesh = new THREE.Mesh(countryGeometry, countryMaterial);

		scene.add(countryMesh);

	}

	console.log(data);

});



scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000} ))); //debug





var spotlight = new THREE.SpotLight(0xFFFFD0, 1);

spotlight.position.set( 100, 100, 100 );

scene.add(spotlight);



scene.add(new THREE.HemisphereLight( 0x444444, 0x444444 ));



camera.position.z = 100;





function render(){

	requestAnimationFrame(render);


	scene.rotation.x += 0.005;
	scene.rotation.y += 0.002;


	renderer.render(scene, camera);

}

render();



window.addEventListener("resize", function(){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});
