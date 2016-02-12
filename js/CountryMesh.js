//create an extension of THREE.Mesh to store statistics data efficiently

var Country = function(name, geometry, material){

	this.mesh = new THREE.Mesh(geometry, material);

	this.name = name;
	this.data = 1;

}




Country.prototype.setFromShapesAndData = function(shapes, data){

	data = Math.pow(data, 1/CONTRAST);


	var countryGeometry, countryMaterial;


	//TODO: fix the geometry problem
	//if(!data){
	//	countryGeometry = new THREE.ShapeGeometry( shapes );
	//} else {
		countryGeometry = new THREE.ExtrudeGeometry( shapes, { amount: 1, bevelEnabled: false } );
	//}

	//countryMaterial = new THREE.MeshLambertMaterial();
	countryMaterial = new THREE.MeshNormalMaterial();


	this.mesh = new THREE.Mesh(countryGeometry, countryMaterial);

	this.setHeightData(data, false);


	this.data = data;

	//console.log(data);

}



Country.prototype.setHeightData = function(data, applyContrast){

	if(applyContrast === undefined) applyContrast = true;


	this.data = data;

	if(applyContrast) data = Math.pow(data, 1/CONTRAST); //process data for more contrast


	if(!(this.mesh.geometry instanceof THREE.ShapeGeometry)){
		this.mesh.scale.set( 1, 1, data * MAXIMUM_COUNTRY_HEIGHT );
	}
	//console.log(data);

	if(this.mesh.material instanceof THREE.MeshLambertMaterial || this.mesh.material instanceof THREE.MeshPhongMaterial){
		this.mesh.material.color.copy( colorfromdata(data) );
	}
}