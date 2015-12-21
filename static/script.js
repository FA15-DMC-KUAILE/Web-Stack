//TEAM KUAILE JAVASCRIPT

var eventOutputContainer = document.getElementById("message");
var eventSrc = new EventSource("/eventSource");

eventSrc.onmessage = function(e) {
	console.log(e);
	eventOutputContainer.innerHTML = e.data;
};

// DON'T FORGET TO CHANGE THIS CODE DEPENDING ON THE DATA YOU'RE DISPLAYING IN YOUR TOOLTIP
var tooltip = d3.select("div.tooltip");
var tooltip_category = d3.select("#cat");

var map = L.map('map').setView([22.539029, 114.062076], 16);


		//Creating variable for slider


		//this is the OpenStreetMap tile implementation
		//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    		//attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		//}).addTo(map);
		//uncomment for Mapbox implementation, and supply your own access token
		L.tileLayer('https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		mapid: 'mapbox.dark',
		accessToken: "pk.eyJ1IjoiYWszNzkzIiwiYSI6ImNpZjdmZ3V5eTBpOXpzaGx6a3hvbjVoemQifQ.Fflvuzl9_moN4a8H_k4m0w"
		}).addTo(map);


		//create variables to store a reference to svg and g elements
		var svg_overlay = d3.select(map.getPanes().overlayPane).append("svg");
		var g_overlay = svg_overlay.append("g").attr("class", "leaflet-zoom-hide");

		var svg = d3.select(map.getPanes().overlayPane).append("svg");
		var g = svg.append("g").attr("class", "leaflet-zoom-hide");


		function projectPoint(lat, lng) {
			return map.latLngToLayerPoint(new L.LatLng(lat, lng));
		}

		function projectStream(lat, lng) {
			var point = projectPoint(lat,lng);
			this.stream.point(point.x, point.y);
		}

		var transform = d3.geo.transform({point: projectStream});
		var path = d3.geo.path().projection(transform);

		function timeChange(){
			var slidervalue = document.getElementById("time").value;
			console.log(slidervalue);
			return slidervalue;

			update();}

		function sliderConvert(dayscore) {
				dayscore = JSON.parse(dayscore)

				if (dayscore == document.getElementById("time").value){
					return 1;}
				else{
				return .1;
				}
			}

		function updateData(){

			alert("Running");

			//var mapBounds = map.getBounds();
			//var lat1 = mapBounds["_southWest"]["lat"];
			//var lat2 = mapBounds["_northEast"]["lat"];
			//var lng1 = mapBounds["_southWest"]["lng"];
			//var lng2 = mapBounds["_northEast"]["lng"];

			// CAPTURE USER INPUT FOR CELL SIZE FROM HTML ELEMENTS
			//var cell_size = 25;
		//	var w = window.innerWidth;
			//var h = window.innerHeight;

			// SEND USER CHOICES FOR ANALYSIS TYPE, CELL SIZE, HEAT MAP SPREAD, ETC. TO SERVER
			request = "/getData"
			//lat1=" + lat1 + "&lat2=" + lat2 + "&lng1=" + lng1 + "&lng2=" + lng2
			//request2 = "/getData2?lat1=" + lat1 + "&lat2=" + lat2 + "&lng1=" + lng1 + "&lng2=" + lng2

			console.log(request);

			g.selectAll("circle").remove()


		  	d3.json(request, function(data) {

		  		//console.log(data);
		  		//var dataLength = data.features.length;
		  	//	console.log(dataLength);
		  		//var dataInsideFunction = data;

				//	var time= timeChange();
				//	var oneDay = 24 * 60 * 60 * 1000;
		  	//		console.log(dataInsideFunction);
		  	//		var dataLength = dataInsideFunction.features.length;
		  	//		var currentData = [];
		  	//		for(i=0;i<dataLength-1;i++){

		//  				var date1 = new Date('2014/01/15 00:00:00');
		//				var date1Time = date1.getTime();
				//		console.log(date1Time);
					//	var date2 = new Date(data.features[i].properties.time);
						//var date2Time = date2.getTime();

					//	var diff = Math.ceil((Math.abs(date2 - date1))/oneDay);
					//	console.log(diff);

		  			//	if(diff == time){
		  				//	console.log(time);
		  					//currentData.push(dataInsideFunction.features[i]);
		  		//		}
		  		//	}
				//create placeholder circle geometry and bind it to data
				var circles = g.selectAll("circle").data(data.features);
					circles.enter()
						.append("circle")
						.on("mouseover", function(d){
							tooltip.style("visibility", "visible");
							tooltip_category.text("Category: " + d.properties.type);
						})
						.on("mousemove", function(){
							tooltip.style("top", (d3.event.pageY-10)+"px")
							tooltip.style("left",(d3.event.pageX+10)+"px");
						})
						.on("mouseout", function(){
							tooltip.style("visibility", "hidden");
						})
						.attr("r",7);

						update();
						map.on("viewreset", update);
					//.style("fill","white");

				function update() {
					// get bounding box of data
				    var bounds = path.bounds(data),
				        topLeft = bounds[0],
				        bottomRight = bounds[1];
				    var buffer = 50;
				    // reposition the SVG to cover the features.
				    svg .attr("width", bottomRight[0] - topLeft[0] + (buffer * 2))
				        .attr("height", bottomRight[1] - topLeft[1] + (buffer * 2))
				        .style("left", (topLeft[0] - buffer) + "px")
				        .style("top", (topLeft[1] - buffer) + "px");
				    g   .attr("transform", "translate(" + (-topLeft[0] + buffer) + "," + (-topLeft[1] + buffer) + ")");
				    // update circle position and size
				    circles
				    	.attr("cx", function(d) { return projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).x; })
				    	.attr("cy", function(d) { return projectPoint(d.geometry.coordinates	[0], d.geometry.coordinates[1]).y; })
							.attr("fill-opacity", function(d) { return sliderConvert(d.properties.time); });

				};
// call function to update geometry


	});
};
		updateData();
