
//CONSTANTS

//

/*
var FLOOR_WIDTH = 500;
var FLOOR_HEIGHT = 300;
*/





var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 15;

var CAMERA_MOVEMENT_SPEED = 0.5;





var MOUSE = new THREE.Vector2();

//stopcameramotion(); //keep the imaginary mouse at the center so nothing moves... yet


var NORMALIZED_MOUSE = new THREE.Vector2(); //for use with the raycaster



var PRESSED_KEYS = []; //keys that are currently pressed





//settings

var SHOW_INFO = true;




//var MAXIMUM_COUNTRY_HEIGHT = DEFAULT_MAXIMUM_COUNTRY_HEIGHT;

//var CONTRAST = DEFAULT_CONTRAST;


var DATA_INDEX = 0; //choose from PRELOADED_DATA_INDICIES


var MATERIAL = 1; //themes


var THEME_BACKGROUND_COLORS = [
	
	0xDDDDDD, //"MeshNormalMaterial"
	0x99CCFF  //"flags"

];

var CLEAR_COLOR = THEME_BACKGROUND_COLORS[MATERIAL];





var SHADOWS = false;





var HOVER_TEXTURE_CRT_DENSITY = 30;







//initialization

var scene = new THREE.Scene();




var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

camera.rotation.order = "ZXY";



var intendedcamera = {
	zoom: camera.zoom,
	rotation: new THREE.Euler(),
	position: new THREE.Vector3()
}

intendedcamera.position.copy(camera.position);
intendedcamera.rotation.copy(camera.rotation);


//TODO: random starting position

intendedcamera.position.z = camera.position.z = 30;


//random starting rotations

camera.rotation.x = intendedcamera.rotation.x = Math.random() * Math.PI/2;
camera.rotation.z = intendedcamera.rotation.z = Math.random() * Math.PI*2;





var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false, preserveDrawingBuffer: true } );

renderer.setClearColor( CLEAR_COLOR, 1 );
renderer.setSize( window.innerWidth, window.innerHeight );


//var MAX_ANISOTROPY = renderer.getMaxAnisotropy();


document.body.appendChild( renderer.domElement );





var raycaster = new THREE.Raycaster();






//frequently accessed DOM elements

var countryinfo = document.getElementById("countryinfo");


//var loadingbar = document.getElementById("loadingbar");






//disable the floor code until shadows work

/*

var floorGeometry = new THREE.BoxGeometry( FLOOR_WIDTH, FLOOR_HEIGHT, DEFAULT_MAXIMUM_COUNTRY_HEIGHT );

var floorMaterial = new THREE.MeshLambertMaterial( { color: CLEAR_COLOR } );
//var floorMaterial = new THREE.MeshPhongMaterial( { color: CLEAR_COLOR, shininess: 100 } );


var floor = new THREE.Mesh( floorGeometry, floorMaterial );


floor.position.set( 0, 0, -DEFAULT_MAXIMUM_COUNTRY_HEIGHT/2 );


if(SHADOWS) floor.recieveShadow = true;



scene.add( floor );

*/







//data

var LOADABLE_DATASETS = [

	{ name: "preloaded",

		datasets: [
			{ name: "Gross Domestic Product", index: 0 },
			{ name: "Population", index: 1 }
		]

	},

	{ name: "The World Bank",

		datasets: [ //from http://data.worldbank.org/indicator

			{ name: "GDP (current US$)", indicatorid: "NY.GDP.MKTP.CD", date: "2015" },
			{ name: "GDP per capita (current US$)", indicatorid: "NY.GDP.PCAP.CD", date: "2015" },
			{ name: "GDP growth (annual %)", indicatorid: "NY.GDP.MKTP.KD.ZG", date: "2015" },
			{ name: "GDP per capita growth (annual %)", indicatorid: "NY.GDP.PCAP.KD.ZG", date: "2015" },
			{ name: "Expense (% of GDP)", indicatorid: "GC.XPN.TOTL.GD.ZS", date: "2013" },

			/*

			//copy and fill in below for new World Bank datasets:
			
			{ name: "GDP", indicatorid: "asdf", date: "2015" },

			*/

		]

	}

];


var datasets = []; //preloaded data + cached external API data



var flagTextures = [];



var countries = [];







var loadingmanager = new THREE.LoadingManager();


loadingmanager.onProgress = function( item, loaded, total ) {

	console.log( item, loaded, total );

	//loadingmenu.innerHTML = item;

	//loadingbar.style.width = (loaded/total)*200 + "px";

};



var textureloader = new THREE.TextureLoader(loadingmanager);



var crtMaterial;

textureloader.load( document.getElementById("assets").href + "crt.png", function(texture){

	texture.generateMipmaps = false;

	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearFilter;



	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;


	crtMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

} );








//add the countries

loadJSON( document.getElementById("country shapes").href, function(data){ //'JSONObject' is a very large GeoJSON-formatted object




	loadingmanager.onLoad = function(){

		mamuri();


		document.getElementById("initialization").style.display = "none";
		document.getElementById("loaded").style.display = "block";


		render();

	}





	//var data = JSONObject;

	//console.log(data.features.length);




	var preloadeddatasets = [ new Dataset("Gross Domestic Product"), new Dataset("Population") ];



	for(i = 0; i < data.features.length; ++i){

		//skipping

		if(data.features[i].properties.TYPE === "Indeterminate") continue; //ignore 'Indeterminate' countries


		if(data.features[i].properties.ISO_A2 === "-99") continue; // delete this later





		//textures

		var flagTexture = {

			"name": data.features[i].properties.SOVEREIGNT,

			"ISO_3166-1": data.features[i].properties.ISO_A2, // ISO 3166-1: the default identification method for countries in this project


			"texture": undefined,
			"aspectratio": undefined

		}

		flagTextures.push(flagTexture);



		var textureurl;


		if(data.features[i].properties.ISO_A2 === "SS")
			textureurl = document.getElementById("assets").href + "flags/other flags/SS.png";

		else if(data.features[i].properties.ISO_A2 === "XK")
			textureurl = document.getElementById("assets").href + "flags/other flags/XK.png";

		/*
		else if(data.features[i].properties.ISO_A2 === "EH")
			textureurl = document.getElementById("flags").href + "other flags/EH.png";
		*/

		else
			textureurl = document.getElementById("assets").href + "flags/flags-normal/" + data.features[i].properties.ISO_A2.toLowerCase() + ".png";


		textureloader.load(

			textureurl,

			function(texture){

				texture.generateMipmaps = false;

				texture.magFilter = THREE.LinearFilter;
				texture.minFilter = THREE.LinearFilter;


				//TODO: optimize

				var flagTexture = flagTextures.filter( function(aflagTexture){

					var splitpath = texture.image.src.split("/");
					var filename = splitpath[ splitpath.length - 1 ];

					return aflagTexture["ISO_3166-1"].toLowerCase() === filename.split(".")[0].toLowerCase();

				} )[0];

				flagTexture.texture = texture;
				flagTexture.aspectratio = texture.image.width/texture.image.height;	

			}

		);





		//shapes

		var countryShapes = []; //this will be a THREE.Shape or an Array of THREE.Shape


		var exteriorRing = []; //an array of Vector2s



		if(!data.features[i].geometry) continue; //skip if there is no geometry



		switch(data.features[i].geometry.type){

			case "Polygon": //http://geojson.org/geojson-spec.html#id4

				var parseddata = parsePolygon(data.features[i].geometry.coordinates);

				Array.prototype.push.apply( countryShapes, parseddata.countryShapes );
				Array.prototype.push.apply( exteriorRing, parseddata.exteriorRing );

				break;


			case "MultiPolygon": //an array of 'Polygon's

				for(l = 0; l < data.features[i].geometry.coordinates.length; ++l){
				
					var parseddata = parsePolygon( data.features[i].geometry.coordinates[l] );

					Array.prototype.push.apply( countryShapes, parseddata.countryShapes );
					Array.prototype.push.apply( exteriorRing, parseddata.exteriorRing );

				}

				break;

		}




		//creating 'Country' objects

		var country = new Country( data.features[i].properties.SOVEREIGNT, data.features[i].properties.ISO_A2, countryShapes, exteriorRing );


		if(SHADOWS){

			country.mesh.castShadow = true;
			country.mesh.recieveShadow = true;

		}



		countries.push(country);


		


		//stats

		preloadeddatasets[0].feeddata( country, data.features[i].properties.GDP_MD_EST ); //preloaded "Gross Domestic Product"
		preloadeddatasets[1].feeddata( country, data.features[i].properties.POP_EST ); //preloaded "Population"

	}



	preloadeddatasets[0].calculatemaximum();
	preloadeddatasets[1].calculatemaximum();


	Array.prototype.push.apply( datasets, preloadeddatasets );






	function parsePolygon(coordinates){

		var countryShapes;

		var exteriorRing = [];


		var paths = [];


		for(j = 0; j < coordinates.length; ++j){ //the lines that define the country (or a part of a country)

			var points = [];


			for(k = 0; k < coordinates[j].length; ++k){ //the points of that line
				
				points.push( new THREE.Vector2( coordinates[j][k][0], coordinates[j][k][1] ) );


				if(j === 0){

					exteriorRing.push( new THREE.Vector2( coordinates[j][k][0], coordinates[j][k][1] ) );

				}

			}



			var path = new THREE.Path(points);


			paths.push(path);

		}



		countryShapes = paths[0].toShapes(); //initialize the shape (toShapes() will only return ONE THREE.Shape; it won't be an array)


		paths.splice(0, 1); //remove the first path to add holes (check GeoJSON specs for more information)

		Array.prototype.push.apply(countryShapes[0].holes, paths); //add the holes



		return { countryShapes, exteriorRing }; //returns a THREE.Shape array

	}






	//마무리

	function mamuri(){

		for(i = 0; i < countries.length; ++i){

			countries[i].setTexture(flagTextures[i]);


			countries[i].setHeightData( datasets[DATA_INDEX].data[i].value / datasets[DATA_INDEX].maximum );



			scene.add(countries[i].mesh);

			scene.add(countries[i].hovermesh);

		}

	}

});







//add misc stuff to the scene

var directionallight = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );


directionallight.position.set( 1, 1, Math.sqrt(3) );


//TODO: shadows

if(SHADOWS){

	directionallight.castShadow = true;

	directionallight.shadow.camera.position.set( 1, 1, Math.sqrt(3) );

}



scene.add(directionallight);




scene.add(new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.7 ));







//global functions that apply on all countries & their data

function updatecountryheights(){ //TODO: find a better name for this

	for(i = 0; i < countries.length; ++i){

		var data = countries[i].data;

		countries[i].setHeightData(data);

	}

}





function setheightdatasource(which){ //'which' should be chosen from PRELOADED_DATA_INDICIES
	
	DATA_INDEX = which;

	datasets[which].apply();

}





function setMaterial(which){

	MATERIAL = parseInt(which);


	/*

	switch(MATERIAL){

		case 0: // "MeshNormalMaterial"

			for( i = 0; i < countries.length; ++i )
				countries[i].setMaterial(MATERIAL);

			break;

		case 1: // "flags"

			for( i = 0; i < countries.length; ++i )
				countries[i].setMaterial(MATERIAL);

			break;

	}

	*/


	renderer.setClearColor(THEME_BACKGROUND_COLORS[MATERIAL]);


	for( i = 0; i < countries.length; ++i ) countries[i].setMaterial(MATERIAL);

}








var pointedCountry;


function render(time){

	requestAnimationFrame(render);

	



	MOUSE_MOVING = false;

	//camera 조작

	//zooming

	camera.zoom += (intendedcamera.zoom - camera.zoom) * 0.1;


	

	if(!LOCK_CAMERA){

		//rotating the camera with euler angles

		//pitch and yaw

		if(!menuvisible){

			intendedcamera.rotation.x += (window.innerHeight/2 - MOUSE.y) * 0.00005; //mouse's up-down y axis motion maps to the camera's x rotation
			intendedcamera.rotation.z += (window.innerWidth/2 - MOUSE.x) * 0.00005; //mouse's left-right x axis motion maps to the camera's z rotation

		}

	}



	//limit the camera pitch

	if(0 > intendedcamera.rotation.x) intendedcamera.rotation.x = 0;
	if(intendedcamera.rotation.x > Math.PI) intendedcamera.rotation.x = Math.PI;
	


	camera.rotation.x += (intendedcamera.rotation.x - camera.rotation.x) * 0.1;
	camera.rotation.z += (intendedcamera.rotation.z - camera.rotation.z) * 0.1;




	//moving

	if(keyPressed(87) || keyPressed(38)){ //w and up
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z + Math.PI/2); //WHY do i have to add 90 degrees someone email me
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z + Math.PI/2);
	}

	if(keyPressed(83) || keyPressed(40)){ //s and down
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z - Math.PI/2);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z - Math.PI/2);
	}

	if(keyPressed(65) || keyPressed(37)){ //a and left
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z + Math.PI);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z + Math.PI);
	}

	if(keyPressed(68) || keyPressed(40)){ //d and right
		intendedcamera.position.x += CAMERA_MOVEMENT_SPEED * Math.cos(camera.rotation.z);
		intendedcamera.position.y += CAMERA_MOVEMENT_SPEED * Math.sin(camera.rotation.z);
	}

	//z-axis motion

	if(keyPressed(16)){
		intendedcamera.position.z -= CAMERA_MOVEMENT_SPEED;
	}

	if(keyPressed(32)){
		intendedcamera.position.z += CAMERA_MOVEMENT_SPEED;
	}



	camera.position.x += (intendedcamera.position.x - camera.position.x) * 0.05;
	camera.position.y += (intendedcamera.position.y - camera.position.y) * 0.05;
	camera.position.z += (intendedcamera.position.z - camera.position.z) * 0.05;



	camera.updateProjectionMatrix();





	if(!menuvisible && SHOW_INFO){ //dont show the info pane if the main menu is visible, or if the user doesn't want to see it

		raycaster.setFromCamera( NORMALIZED_MOUSE, camera );
	

	
		//the code that follows might, in a worst case, execute two for loops - it needs optimization
	
		var intersections = raycaster.intersectObjects( countries.map( function(country){ return country.mesh; } ) );
	


		if(intersections.length > 0){
		
			for(i = 0; i < countries.length; ++i){

				if(countries[i].mesh === intersections[0].object){

					if(pointedCountry){

						if(pointedCountry !== intersections[0].object){

							pointedCountry.hovermesh.visible = false;

						}

					}

					pointedCountry = countries[i];

					break;
		
				}

			}



			pointedCountry.hovermesh.visible = true;
	
		

			showinfo();
	

			countryinfo.style.left = MOUSE.x+"px";
			countryinfo.style.top = MOUSE.y+"px";
	
	
			if(pointedCountry.data === "no data") countryinfo.innerHTML =
				"<h3>"+pointedCountry.name+"</h3>"
			+	""+datasets[DATA_INDEX].name+":<br>"
			+	"no data";

			else countryinfo.innerHTML =
				"<h3>"+pointedCountry.name+"</h3>"
			+	""+datasets[DATA_INDEX].name+":<br>"
			+	""+/*Math.round*/(pointedCountry.data * datasets[DATA_INDEX].maximum).toLocaleString()+"";
	
		} else {
	
			hideinfo();


			if(pointedCountry) pointedCountry.hovermesh.visible = false;
	
		}

	}





	TWEEN.update(time);





	renderer.render(scene, camera);

}







//events

window.addEventListener("resize", function(e){

	if(menuvisible) stopcameramotion(); //stop any motion if the menu is visible



	camera.aspect = window.innerWidth/window.innerHeight;

	camera.updateProjectionMatrix();



	renderer.setSize(window.innerWidth, window.innerHeight);

});





window.addEventListener("mousewheel", function(e){ //zooming

	/*
	//don't uncomment

	if(menuvisible)
		return;

	*/



	intendedcamera.zoom += (e.wheelDelta || e.detail) * 0.005;


	//clip value

	if(intendedcamera.zoom < CAMERA_MINIMUM_ZOOM) intendedcamera.zoom = CAMERA_MINIMUM_ZOOM;
	else if(intendedcamera.zoom > CAMERA_MAXIMUM_ZOOM) intendedcamera.zoom = CAMERA_MAXIMUM_ZOOM;



	return false;

}, false);




var PREVIOUS_MOUSE = new THREE.Vector2();

window.addEventListener("mousemove", function(e){

	if(menuvisible) //ignore when you have something better to do with the mouse than moving it around without a visible cursor on the monitor
		return;




	MOUSE.x = e.clientX;
	MOUSE.y = e.clientY;




	//from a three.js example
	//for the raycaster

	NORMALIZED_MOUSE.x =  (e.clientX/window.innerWidth)*2 - 1;
	NORMALIZED_MOUSE.y = -(e.clientY/window.innerHeight)*2 + 1;



	if(LOCK_CAMERA){

		if(MOUSE_DOWN){

			var deltamouse = new THREE.Vector2().subVectors(MOUSE, PREVIOUS_MOUSE);


			console.log( e.clientX, e.clientY, PREVIOUS_MOUSE, MOUSE )

			intendedcamera.rotation.z += deltamouse.x / window.innerWidth * (camera.fov * camera.aspect) / 180 * Math.PI;
			intendedcamera.rotation.x += deltamouse.y / window.innerHeight * camera.fov / 180 * Math.PI;

		}

	}


	PREVIOUS_MOUSE.copy(MOUSE);


	return false;


}, false);




var MOUSE_DOWN = false;

//var MOUSE_DOWN_POINT = new THREE.Vector2();


window.addEventListener("mousedown", function(e){

	MOUSE_DOWN = true;

	//MOUSE_DOWN_POINT.set(e.clientX, e.clientY);

});



window.addEventListener("mouseup", function(e){

	MOUSE_DOWN = false;

});





//specifically key events

function keyPressed(key){ //check if the key is currently pressed

	if(PRESSED_KEYS.indexOf(key) != -1) return true;

	return false;

}




window.addEventListener("keydown", function(e){

	//console.log(e.which);


	if(e.which == 9) //ignore the tab key
		return;




	if(e.which == 27){ //escape key

		togglemenu();

		return;

	}



	if(e.which == 73){ //'i'

		toggleinfo();

		return;

	}



	if(e.which == 80){ //'p'

		screenshot();

		return;

	}



	if(e.which == 76){

		togglecameralock();

		return;

	}




	if(menuvisible) //note that this must be after the escape key detection or else we're "locked out"
		return;




	if(!keyPressed(e.which))
		PRESSED_KEYS.push(e.which);


}, false);



window.addEventListener("keyup", function(e){

	if(keyPressed(e.which))
		PRESSED_KEYS.splice( PRESSED_KEYS.indexOf(e.which), 1 );


}, false);





function stopcameramotion(){

	//MOUSE.set(window.innerWidth/2, window.innerHeight/2);

	PRESSED_KEYS = [];

}







//DOM interaction

var menuvisible = true;


function togglemenu(){

	if(menuvisible){

		new TWEEN.Tween( { opacity: 1 } )

			.to( { opacity: 0 }, 100 )


			.onUpdate( function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})

			.onComplete( function(){
				document.getElementById("menu").style.display = "none";
			})


			.easing(TWEEN.Easing.Quadratic.Out)



			.start();


	} else {

		stopcameramotion(); //stop any motion


		document.getElementById("menu").style.display = "block";

		new TWEEN.Tween( { opacity: 0 } )

			.to( { opacity: 1 }, 100 )



			.onUpdate(function(){
				document.getElementById("menu").style.opacity = ""+this.opacity+"";
			})



			.easing(TWEEN.Easing.Quadratic.Out)



			.start();


	}



	menuvisible = !menuvisible;



	document.getElementById("source").blur();



	revalidateinfo();

}





function toggleinfo(){

	SHOW_INFO = !SHOW_INFO;	



	document.getElementById("countryinfocheckbox").checked = SHOW_INFO;


	/*

	if(countryinfo.style.display === "none" && SHOW_INFO) showinfo();
	else if(countryinfo.style.display === "block" || !SHOW_INFO) hideinfo();

	*/



	revalidateinfo();

}





function revalidateinfo(){

	if(SHOW_INFO && !menuvisible) showinfo();
	else if(!SHOW_INFO || menuvisible) hideinfo();

}


function hideinfo(){

	countryinfo.style.display = "none";

}

function showinfo(){

	countryinfo.style.display = "block";

}





function screenshot(){

	window.open(renderer.domElement.toDataURL("image/png"), "Final");

	togglemenu();

}





var LOCK_CAMERA = true;


function togglecameralock(){

	LOCK_CAMERA = !LOCK_CAMERA;

	document.getElementById("cameralockcheckbox").checked = LOCK_CAMERA;

}







//other functions

//a modified version of http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

function loadJSON(url, callback){   

	var xobj = new XMLHttpRequest();

	xobj.overrideMimeType("application/json");


	xobj.open('GET', url, true);


	xobj.onreadystatechange = function(){

		if(xobj.readyState == 4 && xobj.status == "200"){

			//Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			
			callback(JSON.parse(xobj.responseText), url);

		}

	};


	xobj.send(null);  

}