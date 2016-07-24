
//DOM-related


//

var SLIDER_RESOLUTION = 10;




var DEFAULT_MATERIAL = 1;







//set min, max, value attributes for the sliders

var maximumheight = document.getElementById("maximumheight");


maximumheight.min = MAXIMUM_COUNTRY_HEIGHT_MINIMUM * SLIDER_RESOLUTION;
maximumheight.max = MAXIMUM_COUNTRY_HEIGHT_MAXIMUM * SLIDER_RESOLUTION;

maximumheight.value = DEFAULT_MAXIMUM_COUNTRY_HEIGHT * SLIDER_RESOLUTION;



var contrast = document.getElementById("contrast");


contrast.min = CONTRAST_MINIMUM * SLIDER_RESOLUTION;
contrast.max = CONTRAST_MAXIMUM * SLIDER_RESOLUTION;

contrast.value = DEFAULT_CONTRAST * SLIDER_RESOLUTION;





var sourceselect = document.getElementById("source");


sourceselect.innerHTML = "";


var counter = 0; //count the available datasets

for(i = 0; i < LOADABLE_DATASETS.length; ++i){

	sourceselect.innerHTML +=
		"<optgroup label = '"+LOADABLE_DATASETS[i].name+"'>\n"
	;

	for(j = 0; j < LOADABLE_DATASETS[i].datasets.length; ++j){

		sourceselect.innerHTML +=
			"<option value = '"+i+","+j+"'>"+LOADABLE_DATASETS[i].datasets[j].name+"</option>\n"
		;

		++counter;

	}

	sourceselect.innerHTML +="</optgroup>";

}






var materialselect = document.getElementById("material");


materialselect.innerHTML = "";

/*

materialselect.innerHTML +=
	"<optgroup label = ''>\n"
;

*/

for(i = 0; i < MATERIAL_INDICIES.length; ++i){
	materialselect.innerHTML +=
		"<option value = '"+i+"'>"+MATERIAL_INDICIES[i]+"</option>\n"
	;
}

/*

materialselect.innerHTML +=
	"</optgroup>"
;

*/



materialselect.value = DEFAULT_MATERIAL;







//events – WARNING: SPAGHETTI CODE AHEAD

function maximumheightinput(){

	MAXIMUM_COUNTRY_HEIGHT = maximumheight.value / SLIDER_RESOLUTION;


	updatecountryheights();

}



function contrastinput(){

	CONTRAST = contrast.value / SLIDER_RESOLUTION;


	updatecountryheights();

}




function countryinfocheckboxclicked(){

	SHOW_INFO = document.getElementById("countryinfocheckbox").checked;


	revalidateinfo();

}




function lockcameracheckboxclicked(){

	LOCK_CAMERA = document.getElementById("cameralockcheckbox").checked;

}





function materialchange(){

	setMaterial( materialselect.value );

}




function defaultsettings(){

	maximumheight.value = DEFAULT_MAXIMUM_COUNTRY_HEIGHT * SLIDER_RESOLUTION;


	maximumheightinput();



	contrast.value = DEFAULT_CONTRAST * SLIDER_RESOLUTION;


	contrastinput();

}




var datasetloading = document.getElementById("datasetloading");
var datasetloadingbar = document.getElementById("datasetloadingbar");
var datasetloadingtext = document.getElementById("datasetloadingtext");


function sourcechange(){

	var selection = sourceselect.value.split(",");

	var selectedDataset = LOADABLE_DATASETS[selection[0]].datasets[selection[1]];


	//console.log(selection, selectedDataset.index);

	if(selectedDataset.index === undefined){ //if first time loading; must call API

		document.getElementById("loaded").style.display = "none";
		datasetloading.style.display = "block";



		selectedDataset.index = datasets.length;


		var dataset = new Dataset(selectedDataset.name);

		datasets.push(dataset);


		//API call ...

		switch(LOADABLE_DATASETS[selection[0]].name){

			case "The World Bank":

				var loadedcount = 0;


				for(i = 0; i < countries.length; ++i){

					loadJSON(

						"http://cors.io/?u=http://api.worldbank.org/countries/"+countries[i].iso1366+"/indicators/"+selectedDataset.indicatorid+"?format=json&date="+selectedDataset.date,

						//later when we support time series data we should want to call the whole time series (ex. http://api.worldbank.org/countries/KR/indicators/NY.GDP.MKTP.CD?format=json; without the ?date parameter


						function(datum, url){

							var country = countries.filter(
								function(country){ return country.iso1366 === url.split("/")[7]; }
							)[0];


							if(datum[1]){

								/*
								
								//the proper way

								var country = countries.filter(
									function(country){ return datum[1][0].country.id === country.iso1366; }
								)[0];

								*/


								dataset.feeddata( country, datum[1][0].value );

							} else {

								dataset.feeddata( country, "no data" );

							}




							loadedcount++;


							datasetloadingbar.style.width = (loadedcount/countries.length) * 200 + "px";
							datasetloadingtext.innerHTML = country.name;



							if(loadedcount === countries.length){ //finalize

								dataset.calculatemaximum();



								datasetloadingbar.style.width = "0px";
								datasetloadingtext.innerHTML = "loading...";


								datasetloading.style.display = "none";
								document.getElementById("loaded").style.display = "block";



								setheightdatasource( selectedDataset.index );

							}
		
						}

					);

				}

				break;

		}

	} else { //if we've already loaded the dataset and it's cached or it's preloaded

		setheightdatasource( selectedDataset.index );

	}

}



defaultsettings();