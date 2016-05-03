//create an extension of THREE.Mesh to store statistics data efficiently

var Country = function( name, flagurl, geometry, material ){

	this.mesh = new THREE.Mesh( geometry, material );


	this.tween;


	this.name = name;
	this.data = 1;

	this.flagtexture = textureloader.load( flagurl ); //"assets/flags-ultra/" + countrydata.ISO_A2 + ".png"

	//console.log(this.flagtexture);

}



Country.prototype.setFromShapesAndData = function( shapes, data ){

	data = Math.pow( data, 1/CONTRAST );



	var countryGeometry, countryMaterial;

	if(!data)
		countryGeometry = new THREE.ShapeGeometry( shapes );

	else
		countryGeometry = new THREE.ExtrudeGeometry( shapes, { amount: 1, bevelEnabled: false } );


	countryMaterial = new THREE.MeshPhongMaterial( { map: this.flagtexture } );
	//countryMaterial = new THREE.MeshNormalMaterial();


	this.mesh = new THREE.Mesh( countryGeometry, countryMaterial );



	this.setHeightData(data, false);


	this.data = data;

	//console.log(data);

	this.setMaterial(1);

}



Country.prototype.setHeightData = function( data, applyContrast ){

	if(applyContrast === undefined) applyContrast = true;


	this.data = data;


	if(applyContrast) data = Math.pow(data, 1/CONTRAST); //process data for more contrast



	if( !(this.mesh.geometry instanceof THREE.ShapeGeometry) ){

		//this.mesh.scale.set( 1, 1, data * MAXIMUM_COUNTRY_HEIGHT );

		this.tween = new TWEEN.Tween( this.mesh.scale )
			.to( { z: data * MAXIMUM_COUNTRY_HEIGHT }, 700 )
			.easing(TWEEN.Easing.Quadratic.Out)
			.start();

	}

	//console.log(data);



	/*
	if(this.mesh.material instanceof THREE.MeshLambertMaterial || this.mesh.material instanceof THREE.MeshPhongMaterial){

		this.mesh.material.color.copy( colorfromdata(data) );

	}
	*/

}



//WIP color code

function colorfromdata(data){

	var from = new THREE.Color(0xFFFFFF);
	var to = new THREE.Color(0xFFFFFF);

	var lerp = advancedLerp( from, to, data, function(r){ return r }, function(g){ return g }, function(b){ return b } );

	return lerp;

}



function advancedLerp( from, to, alpha, r, g, b ){

	var result = new THREE.Color(
		from.r + (to.r - from.r)*alpha,
		from.g + (to.g - from.g)*alpha,
		from.b + (to.b - from.b)*alpha
	);

	result.r = r(result.r);
	result.g = g(result.g);
	result.b = b(result.b);


	return result;

}





Country.prototype.setMaterial = function(which){

	switch(which){

		case 0: // "MeshNormalMaterial"

			this.mesh.material = new THREE.MeshNormalMaterial();

			break;

		case 1: // "flags"

			this.mesh.material = new THREE.MeshPhongMaterial( { map: this.flagtexture } );

			break;

	}

}