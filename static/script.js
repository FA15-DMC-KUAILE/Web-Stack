var map = L.map('map').setView([22.97664, 114.71134], 16);
		//this is the OpenStreetMap tile implementation
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		//uncomment for Mapbox implementation, and supply your own access token
		// L.tileLayer('https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={accessToken}', {
		// 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		// 	mapid: 'mapbox.light',
		// 	accessToken: [INSERT YOUR TOKEN HERE!]
		// }).addTo(map);
		//create variables to store a reference to svg and g elements
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
	  	d3.json("/getData/", function(data) {
			//create placeholder circle geometry and bind it to data
			var circles = g.selectAll("circle").data(data.features);
			circles.enter()
				.append("circle")
			    .attr("r", 10);
			// function to update the data
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
			    // update circle position
			    circles
			    	// [IMPLEMENT CODE TO CHANGE THE RADIUS OF EACH CIRCLE ACCORDING TO THE PRICE OF EACH PROPERTY]
			    	// hint: the price of each data point can be accessed in d.properites.price
			    	// you can use an anonymous function to access this data for every point, just like we have done for the geographic coordinates
			    	// for an extra challenge, see if you can change the color of the circles to correspond to some data as well!
			    	.attr("cx", function(d) { return projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).x; })
			    	.attr("cy", function(d) { return projectPoint(d.geometry.coordinates[0], d.geometry.coordinates[1]).y; });
			};
			// call function to
			update();
			map.on("viewreset", update);
		});
