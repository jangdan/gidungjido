
var Dataset = function( name, data, maximum ){

	this.name = name;



	if(!data) this.data = [];
	else this.data = data; //an Array; each element takes the form of { country}

	if(!maximum) this.maximum = -Infinity;
	else this.maximum = maximum;

}





Dataset.prototype.feeddata = function( country, value ){ //we just hope everything comes in in alphabetical order

	this.data.push( { country: country, value: value } );

}



Dataset.prototype.calculatemaximum = function(){

	var maximum = this.maximum;

	for(i = 0; i < this.data.length; ++i){

		if(this.data[i].value === "no data") continue;

		maximum = Math.max( this.data[i].value , maximum );

	}


	this.maximum = maximum;


	return maximum; //optional

}





Dataset.prototype.apply = function(){ //apply this dataset to the graph/map

	for(i = 0; i < this.data.length; ++i) this.data[i].country.setHeightData( this.data[i].value / this.maximum );

}