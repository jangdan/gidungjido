var scene = new THREE.Scene();



var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setClearColor(0x111111, 1);

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);



var countryShape = new THREE.Shape(); //a placeholder right triangle
countryShape.moveTo( 1,  1);
countryShape.lineTo( 1, -1);
countryShape.lineTo(-1,  1);
countryShape.lineTo( 1,  1);


var countryGeometry = new THREE.ExtrudeGeometry(countryShape, { amount: 2, bevelEnabled: false } );


var countryMaterial = new THREE.MeshPhongMaterial( { color: 0x3F6536 } );


var countryMesh = new THREE.Mesh(countryGeometry, countryMaterial);

scene.add(countryMesh);



//scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial( { color: 0xFF0000} ))); //debug



//scene.add(new THREE.AmbientLight(0xFFFFFF));



camera.position.z = 10;



function render(){

	requestAnimationFrame(render);


	renderer.render(scene, camera);

}

render();



window.addEventListener("resize", function(){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});
