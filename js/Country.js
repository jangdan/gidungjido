//create an extension of THREE.Mesh to store statistics data efficiently

var Country = function( name, iso1366, flagurl, shapes, exteriorRing /* boundingBox, center, boundingBoxes, centers */){

	this.name = name;

	this.iso1366 = iso1366;



	this.shapes = shapes;




	/*

	//TODO: calculate distance between centers, then group them, then draw the textures relative to the centers so the 무늬 turns out correctly

	this.centers = [];


	if(!centers){

		for(j = 0; j < shapes.length; ++j){

			/*
			//center of mass

			this.centers.push( new THREE.Vector2(0, 0) );


			for( k = 0; k < shapes[j].actions.length; ++k ){

				this.centers[j].x += shapes[j].actions[k].args[0];
				this.centers[j].y += shapes[j].actions[k].args[1];

			}

			this.centers[j].divideScalar( shapes[j].actions.length );

			*



			var boundingBox = new THREE.Box2();


			var shapepoints = [];

			for( k = 0; k < shapes[j].actions.length; ++k ){

				shapepoints.push( ( new THREE.Vector2() ).fromArray( shapes[j].actions[k].args ) );

			}

			boundingBox.setFromPoints( shapepoints );


			/*
			if(!boundingBox) this.boundingBoxes.push( boundingBox );
			else this.boundingBoxes = boundingBoxes;
			*


			this.centers.push( boundingBox.center() );

		}

	} else this.centers = centers; */

	


	var boundingBox = new THREE.Box2();

	/*
	var centerofgravity = new THREE.Vector2(0, 0);


	for( j = 0; j < exteriorRing.length; ++j ){

		centerofgravity.add( exteriorRing[j] );

	}
	*/


	boundingBox.setFromPoints( exteriorRing );

	/*
	centerofgravity.divideScalar( exteriorRing.length );
	*/


	this.flagcenter = boundingBox.center();




	this.flagurl = flagurl;

	if( !( !this.flagurl ) && ( this.iso1366 !== "-99" && this.iso1366 !== "SS" && this.iso1366 !== "XK" ) ){ //excude South Sudan & Kosovo because I can't find a flag that fits the dimensions (sorry! really really sorry!), but wait–I might be able to do something

		console.log(this.iso1366 === "-99");

		this.flagtexture = textureloader.load(
	
			flagurl, //"assets/flags-ultra/" + countrydata.ISO_A2 + ".png"
	
			function(texture){
	
				this.textureaspectratio = texture.image.width/texture.image.height;
	
			}
	
		); 
	
		
		//this.flagtexture.offset = new THREE.Vector2(0.5, 0.5);
	
		//this.flagtexture.anisotropy = MAX_ANISOTROPY;
	
	}




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



		if(!this.data || this.data === 0)
			countryGeometry = new THREE.ShapeGeometry( this.shapes );

		else
			countryGeometry = new THREE.ExtrudeGeometry( this.shapes, { amount: 1, bevelEnabled: false } );


		console.log(this.textureaspectratio);

		for( j = 0; j < countryGeometry.faceVertexUvs.length; ++j ){

			for( k = 0; k < countryGeometry.faceVertexUvs[j].length; ++k ){

				for( l = 0; l < countryGeometry.faceVertexUvs[j][k].length; ++l){

					/*

					var vector3 = new THREE.Vector3( countryGeometry.faceVertexUvs[j][k][l].x, countryGeometry.faceVertexUvs[j][k][l].y, 0 );
					

					var matrix = new THREE.Matrix4();


					matrix.makeScale( 1/2, 1/2, 1/2 );

					matrix.makeTranslation( -this.flagcenter.x, -this.flagcenter.y, -this.flagcenter.z )


					vector3.applyMatrix4( matrix );


					countryGeometry.faceVertexUvs[j][k][l].set( vector3.x, vector3.y );
					
					*/



					//alt

					countryGeometry.faceVertexUvs[j][k][l].sub( this.flagcenter );

					//flag scaling (WIP; TODO)
					//countryGeometry.faceVertexUvs[j][k][l].multiplyScalar(1/2);
					//countryGeometry.faceVertexUvs[j][k][l].add( new THREE.Vector2( this.flagaspectratio * countryGeometry.faceVertexUvs[j][k][l].x, 0 ) );

				}

			}

		}



		if(!this.flagtexture) countryMaterial = new THREE.MeshLambertMaterial();
		else countryMaterial = new THREE.MeshLambertMaterial( { map: this.flagtexture } );


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

	//console.log( this.mesh.geometry.faceVertexUvs );

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