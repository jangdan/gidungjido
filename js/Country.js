//create an extension of THREE.Mesh to store statistics data efficiently

var Country = function( name, iso1366, shapes, flagurl){

	this.name = name;

	this.iso1366 = iso1366;



	this.shapes = shapes;


	this.flagurl = flagurl;

	this.flagtexture = textureloader.load( this.flagurl ); //"assets/flags-ultra/" + countrydata.ISO_A2 + ".png"




	this.data = 1;




	this.mesh;



	this.tween;

}





Country.prototype.setHeightData = function( data, applyContrast ){

	if(applyContrast === undefined) applyContrast = true;



	this.data = data;


	if(applyContrast) data = Math.pow(data, 1/CONTRAST); //process data for more contrast



	if( !this.mesh ){ //if 'this.mesh' is null

		var countryGeometry, countryMaterial;


		if(!this.data)
			countryGeometry = new THREE.ShapeGeometry( this.shapes );

		else
			countryGeometry = new THREE.ExtrudeGeometry( this.shapes, { amount: 1, bevelEnabled: false } );


		countryMaterial = new THREE.MeshLambertMaterial( { map: this.flagtexture } );
		//countryMaterial = new THREE.MeshNormalMaterial();


		this.mesh = new THREE.Mesh( countryGeometry, countryMaterial );

	}



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




Country.prototype.setMaterial = function(which){

	switch(which){

		case 0: // "MeshNormalMaterial"

			this.mesh.material = new THREE.MeshNormalMaterial();

			break;

		case 1: // "flags"

			this.mesh.material = new THREE.MeshLambertMaterial( { map: this.flagtexture } );

			break;

	}

}






//WIP static color functions

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