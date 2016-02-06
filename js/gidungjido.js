var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setClearColor(0xDDDDDD, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);





loadJSON("data/ne_10m_admin_0_sovereignty.json", function(JSONObject){

	var data = JSONObject;


	for(i = 0; i < data.features.length; ++i){ //each feature (country)


		var countryShapes; //will be a THREE.Shape or an Array of THREE.Shape


		switch(data.features[i].geometry.type){

			case "Polygon": //http://geojson.org/geojson-spec.html#id4


				var paths = [];

				for(j = 0; j < data.features[i].geometry.coordinates.length; ++j){ //each seperate 'part' of a country (islands, exclaves, etc)


					var points = [];

					for(k = 0; k < data.features[i].geometry.coordinates[j].length; ++k){ //the points of that 'part'
						
						points.push(new THREE.Vector2( data.features[i].geometry.coordinates[j][k][0], data.features[i].geometry.coordinates[j][k][1] ));

					}

					var path = new THREE.Path(points);

					paths.push(path);

				}


				countryShapes = paths[0].toShapes(); //initialize the shape (toShapes() will only return ONE THREE.Shape)


				paths.splice(0, 1); //remove the first path (check GeoJSON specs for more information)

				Array.prototype.push.apply(countryShapes[0].holes, paths); //add the holes


				break;


			case "MultiPolygon": //



				break;

			default: continue;

		}

	
		var countryGeometry = new THREE.ExtrudeGeometry(countryShapes, { amount: 2, bevelEnabled: false } );
		
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


	//scene.rotation.x += 0.005;
	//scene.rotation.y += 0.002;


	renderer.render(scene, camera);

}

render();



window.addEventListener("resize", function(){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});
