
var Beatport = function() {
	this.search = function (query, isrc) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/search",
			data: { query: query },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				if (json.metadata.count > 0) {
					var found = false;
					var result = null;
					var nada = "";
					
					$(json.results).each(function(index){					
						if (this.type == "track" && !found) {
							var querymatch = scrubber.searchTitle(this.name, this.artists, this.mixName);

							if (this.isrc == isrc) {
								found = true;
								result = this;
								
							} else if (query == querymatch && result == null) {
								console.log ("Potential Match: {0}/{1}".format(query, querymatch));
								result = this;
								
							} else {
								console.log("No Match: {0}/{1} [isrc {2}{3}]\n".format(query, querymatch, this.isrc, isrc));
							}
						}
					});
					
					if (result != null) {
						formatter.applyBeatportResponse(result, isrc);
					}
					
				} else {
					console.log("Zero Results [ISRC {0}]: {1}".format(isrc, query));
				}
			}
		});
	}

	this.popularSongsGenre = function(callback, query) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/most-popular/genre",
			data: { perPage: 100, id: query },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				callback(json);
			}
		});
	}

	this.popularSongs = function(callback) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/most-popular",
			data: { perPage: 100 },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				callback(json);
			}
		});
	}
	
	this.popularAlbumsGenre = function(callback, query) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/most-popular-releases/genre",
			data: { perPage: 150, id: query },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				callback(json);
			}
		});
	}

	this.popularAlbums = function(callback) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/most-popular-releases",
			data: { perPage: 150 },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				callback(json);
			}
		});
	}
	
	this.genres = function(callback) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/genres",
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				callback(json);
			} //,
				
//				error: function () {
//					
//				}
		});
	}
}

var beatport = new Beatport();