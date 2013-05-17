
var Beatport = function() {
	this.search = function (query) {
		$.ajax({
			url: "http://api.beatport.com/catalog/3/search",
			data: { query: query },
			type: "GET",
			dataType: "json",
				
			success: function (json) {
				if (json.metadata.count > 0) {
					formatter.applyBeatportResponse(json.results);
				}
			}//,
			
//			error: function () {
//				alert("oops");
//			}
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