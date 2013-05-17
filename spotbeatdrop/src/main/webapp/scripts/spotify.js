
var Spotify = function() {
	this.lookup = function (query) {
		$.ajax({
			url: "http://ws.spotify.com/lookup/1/.json",
			data: { uri: query },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				formatter.applySpotifyResponse(json);
			},
			
			error: function () {
				alert("oops");
			}
		});
	}
	
	this.id = function(element, id) {
		var value = "";
		$(element["external-ids"]).each(function() {
			if (this.type == id) {
				value = this.id;
			} 
		});
		return value;
	}
	
	this.findAlbum = function(catalogNumber, name, artists, callback) {
		var query = name;
		if (artists.length == 1) {
			query = artists[0] + " " + query;
		}
		
		var json = spotify.searchAlbums(query, function(json) {
			if (json.info["num_results"] > 0) {
				$(json.albums).each(function(){
					var upc = spotify.id(this, "upc");
					if (catalogNumber == upc) {
						callback(this);
					} else if (this.artists[0].name.toLowerCase() == artists[0].toLowerCase()) {
						callback(this);
					} else if (this.artists[0].name == "Various Artists" && this.name == name) {
						callback(this);
					}
				});
			}
		});
	}
	
	this.searchAlbums = function (query, callback) {
		$.ajax({
			url: "http://ws.spotify.com/search/1/album.json",
			data: { q: query },
			type: "GET",
			dataType: "json",
			
			success: function (json) {
				callback(json);
			}
		});
	}

	this.searchTrack = function (query, isrc, exclusive, callback) {
		$.ajax({
			url: "http://ws.spotify.com/search/1/track.json",
			data: { q: query },
			type: "GET",
			dataType: "json",
			
			success: function (json) {
				var nresults = json.info["num_results"];
				if (nresults > 0) {
					var nada = "";
					var found = false;
					var potential = null;
					
					$(json.tracks).each(function(){
						if (!found) {
							var querymatch = scrubber.lessDashes(this.artists[0].name + " " + this.name).toLowerCase();
							var spisrc = spotify.id(this, "isrc");

							if (spisrc == isrc) { 
								nada = null;
								found = true;
								callback(this);
							
							} else if (querymatch == query && potential == null) {
								console.log ("Potential Match: " + query + "/" + querymatch);
								potential = this;
								nada = null;
							
							} else {
								nada += ("\nNo Match: " + query + "/" + querymatch + ", isrc: " + spisrc + "/" + isrc);
							}
						}
					});	
					
					if (potential != null) {
						callback(potential);
						
					} else if (nada != null) {
						console.log(nada);
					}
				} else {
					if (!exclusive) {
						console.log("Zero Results: " + query);
					}
				}
			}
		});
	}
	
	this.translateLink = function(link) {
		link = link.replace("http://open.spotify.com", "spotify");
		while (link.indexOf("/") > -1) {
			link = link.replace("/", ":");
		}
		return link;
	}
}

var spotify = new Spotify();