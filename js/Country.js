
var Country = function( name, iso1366, shapes, exteriorRing /* boundingBox, center, boundingBoxes, centers */){

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

	} else this.centers = centers;

	*/

	


	var boundingBox = new THREE.Box2();


	boundingBox.setFromPoints( exteriorRing );


	this.boundingBoxdimensions = new THREE.Vector2( boundingBox.max.x - boundingBox.min.x, boundingBox.max.y - boundingBox.min.y);

	this.boundingBoxaspectratio = this.boundingBoxdimensions.x/this.boundingBoxdimensions.y;




	this.flagcenter = boundingBox.center();





	this.data = 1;




	this.mesh;



	this.hovermesh;




	this.tween;

}



Country.prototype.setTexture = function( flagTextureObject ){

	this.flagtexture = flagTextureObject.texture;


	this.flagtexture.offset.set(0.5, 0.5);

	this.flagaspectratio = flagTextureObject.aspectratio;



	this.adjustuvs();

}



Country.prototype.adjustuvs = function(){

	if(!this.mesh) return;


	if(this.flagaspectratio >= this.boundingBoxaspectratio){ // match heights

		//console.log(this.mesh.geometry.faces, this.mesh.geometry.faceVertexUvs);

		for(j = 0; j < this.mesh.geometry.faceVertexUvs[0].length; ++j){ // i presume the indicies are the same for this.hovermesh

			for(k = 0; k < this.mesh.geometry.faceVertexUvs[0][j].length; ++k){

				if(this.mesh.geometry.faces[j].normal.x + this.mesh.geometry.faces[j].normal.y === 0
				|| this.mesh.geometry.faces[j].normal.x + this.mesh.geometry.faces[j].normal.y === -0){ // the faces

					this.mesh.geometry.faceVertexUvs[0][j][k].sub( this.flagcenter );


					this.mesh.geometry.faceVertexUvs[0][j][k].divideScalar( this.boundingBoxdimensions.y );

					this.mesh.geometry.faceVertexUvs[0][j][k].x *= 1/this.flagaspectratio;



					this.hovermesh.geometry.faceVertexUvs[0][j][k].multiplyScalar( HOVER_TEXTURE_CRT_DENSITY );




					/* 

					//alternative method, using transformations (doesn't work)

					var vector3 = new THREE.Vector3( countryGeometry.faceVertexUvs[j][k][l].x, countryGeometry.faceVertexUvs[j][k][l].y, 0 );
					

					var matrix = new THREE.Matrix4();


					matrix.makeScale( 1/2, 1/2, 1/2 );

					matrix.makeTranslation( -this.flagcenter.x, -this.flagcenter.y, -this.flagcenter.z )



					vector3.applyMatrix4( matrix );



					countryGeometry.faceVertexUvs[j][k][l].set( vector3.x, vector3.y );
					
					*/

				} else { //the sides

					this.mesh.geometry.faceVertexUvs[0][j][k].set(0, 0);

					this.hovermesh.geometry.faceVertexUvs[0][j][k].set(0, 0);
					
				}

			}
		}

	} else { // match widths

		for(j = 0; j < this.mesh.geometry.faceVertexUvs[0].length; ++j){

			for(k = 0; k < this.mesh.geometry.faceVertexUvs[0][j].length; ++k){

				this.mesh.geometry.faceVertexUvs[0][j][k].sub( this.flagcenter );


				this.mesh.geometry.faceVertexUvs[0][j][k].divideScalar( this.boundingBoxdimensions.x );

				this.mesh.geometry.faceVertexUvs[0][j][k].y *= this.flagaspectratio;



				this.hovermesh.geometry.faceVertexUvs[0][j][k].multiplyScalar( HOVER_TEXTURE_CRT_DENSITY );

			}

		}

	}

}



Country.prototype.setHeightData = function( data, applyContrast ){

	if(applyContrast === undefined) applyContrast = true;



	if(!data || data === "no data") this.data = "no data";
	
	else {

		this.data = data;
	
		if(applyContrast){ //process data for more contrast

			if(data >= 0) data = Math.pow(data, 1/CONTRAST);
			else data = -Math.pow(-data, 1/CONTRAST);

		}

	}



	if( !this.mesh ){ //if 'this.mesh' is null, 즉 first time loading

		var countryGeometry, countryMaterial;

		var countryhoverGeometry;



		if( this.data === "no data" ){

			countryGeometry = new THREE.ShapeGeometry( this.shapes );

			countryhoverGeometry = new THREE.ShapeGeometry( this.shapes );

		} else {

			countryGeometry = new THREE.ExtrudeGeometry( this.shapes, { amount: 1, bevelEnabled: false } );

			countryhoverGeometry = new THREE.ExtrudeGeometry( this.shapes, { amount: 1, bevelEnabled: false } );

		}



		var matrix = new THREE.Matrix4();

		matrix.makeTranslation(this.flagcenter.x, this.flagcenter.y, 0);
		matrix.makeScale(1.0001, 1.0001, 1.0001);

		countryhoverGeometry.applyMatrix( matrix );




	
		if( !this.flagtexture ) countryMaterial = new THREE.MeshLambertMaterial();
		else countryMaterial = new THREE.MeshLambertMaterial( { map: this.flagtexture, transparent: true } );




		this.mesh = new THREE.Mesh(countryGeometry, countryMaterial);



		this.hovermesh = new THREE.Mesh(countryhoverGeometry, crtMaterial);

		this.hovermesh.visible = false;



		this.adjustuvs();

	} else {

		if( this.data === "no data" && this.mesh.geometry instanceof THREE.ExtrudeGeometry )
			countryGeometry = new THREE.ShapeGeometry( this.shapes );

		else if( this.data !== "no data" && this.mesh.geometry instanceof THREE.ShapeGeometry ){

			countryGeometry = new THREE.ExtrudeGeometry( this.shapes, { amount: 1, bevelEnabled: false } );
		
		}
	}



	if( this.data !== "no data" ){

		//this.mesh.scale.set( 1, 1, data * MAXIMUM_COUNTRY_HEIGHT );

		this.tween = new TWEEN.Tween( this.mesh.scale )
			.to( { z: data * MAXIMUM_COUNTRY_HEIGHT }, 700 )
			.easing( TWEEN.Easing.Quadratic.Out )
			.start();

		this.tween = new TWEEN.Tween( this.hovermesh.scale )
			.to( { z: data * (MAXIMUM_COUNTRY_HEIGHT + 0.1) }, 700 )
			.easing( TWEEN.Easing.Quadratic.Out )
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