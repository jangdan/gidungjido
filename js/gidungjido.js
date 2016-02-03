var projection = d3.geo.equirectangular()
.translate([window.innerWidth/2, window.innerHeight/2]);

/*
var path = d3.geo.path()
.projection(projection);
*/



var svg = d3.select("body").append("svg")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);



d3.json("data/ne_50m_admin_0_sovereignty.json", function(json){

	var paths = svg.selectAll("path")
	.data(json.features);

	paths.enter()
	.append("path")
	.attr("fill", function(d, i){

		/*
		console.log("rgb("+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+")");
		*/

		return "rgb("+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+", "+populationTo255(d.properties.pop_est)
				+")"}
	)
	.attr("d", d3.geo.path().projection(projection) );

	console.log(paths);
});



function populationTo255(n){
	return Math.pow(n/1346234010, 0.3)*255;
}