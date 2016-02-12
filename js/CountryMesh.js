//create an extension of THREE.Mesh to store statistics data efficiently

var CountryMesh = function(geometry, material){

	THREE.Mesh.apply(this, arguments);

	this.data = 1;

}

CountryMesh.prototype = THREE.Mesh.prototype;




CountryMesh.prototype.setFromShapesAndData = function(shapes, data){

	var countryGeometry, countryMaterial;


	if(data == 0){
		countryGeometry = new THREE.ShapeGeometry( shapes );
	} else {
		countryGeometry = new THREE.ExtrudeGeometry( shapes, { amount: 1, bevelEnabled: false } );
	}

	countryMaterial = new THREE.MeshLambertMaterial();
	countryMaterial = new THREE.MeshNormalMaterial();


	THREE.Mesh.apply( countryGeometry, countryMaterial);



	this.setHeightData(data, false);

	this.data = data;

}



CountryMesh.prototype.setHeightData = function(data, applyContrast){

	if(applyContrast === undefined) applyContrast = true;


	if(applyContrast) data = Math.pow(data, 1/CONTRAST); //process data for more contrast


	if(!this.geometry instanceof THREE.ShapeGeometry){
		this.scale.set( 1, 1, data * MAXIMUM_COUNTRY_HEIGHT );
	}

	if(this.material instanceof THREE.MeshLambertMaterial || this.material instanceof THREE.MeshPhongMaterial){
		countryMesh.material.color.copy( colorfromdata(data) );
	}
}