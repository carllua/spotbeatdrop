var formatter;

String.prototype.format = function() {
	var s = this,
	i = arguments.length;

	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};

$(function() {
	var linkFormat = "<a href=\"{0}\">{1}</a>";
	
	function Formatter() {
		var resultTemplate;
		
		function readTemplate(id, newClass) {
			var template = $(id).detach();
			template.removeClass("template");
			template.addClass(newClass);
			template.removeAttr("id");
			return template;
		}
		
		function initialize() {
			resultTemplate = readTemplate("#resultTemplate", "result");
		}
		
		initialize();
		
		this.clearTable = function() {
			$("#results tbody").empty();
		}
		
		function addRow() {
			var row = resultTemplate.clone();
			$("#results").append(row)
			return row;
		}
		
		this.applySpotifyResponse = function(results) {
			clearTable();
			if (results.info.type == "track") {
				spotifyTrack(results.track)
			}
		}
		
		function spotifyTrack(track) {
			var artists = ""; 
			var artistquery = "";

			$(track.artists).each(function(index) {
				if (index > 0) {
					artists += ", ";
				}
				if (this.href) {
					artists += linkTemplate.format(this.href, this.name);
				} else {
					artists += this.name;
				}
				artistquery += this.name + " ";
			});
			
			var isrc = spotify.id(track, "isrc");
			
			album = linkTemplate.format(track.album.href, track.album.name);
	
			var row = addRow();
			row.find(".title").html(track.title);
			row.find(".artists").html(artists);
			row.find(".album").html(album);
			
			beatport.search(artistquery + track.name);
		}
		
		this.applySpotifyArtists = function(cell, artists) {
			cell.empty();
			$(artists).each(function(index){
				if (index > 0) {
					cell.append(", ");
				}
				if (this.href) {
					cell.append("<a href=\"{0}\">{1}</a>".format(this.href, this.name));
				} else {
					cell.append(this.name);
				}
			});
		}

		this.applyBeatportArtists = function(artists, cell) {
			cell.empty();
			$(artists).each(function(index){
				if (index > 0) {
					cell.append(", ");
				}
				cell.append(scrubber.lessCountries(this.name));
			});
		}
		
		this.applyBeatport = function(results) {
			$(results).each(function(index){
				var row = addRow();
				var title = scrubber.scrubTitle(this.name);

				var mix = scrubber.scrubMix(this.mixName);
				
				row.attr("id", this.isrc);
				row.find(".index").html(index + 1);
				row.find(".title").html(title);
				row.find(".album").html(this.release.name);
				row.find(".released").html(this.releaseDate);
				row.find(".mix").html(mix);
				row.find(".image").html("<img src=\"" + this.images.small.url + "\" />")
				row.find(".bpm").html(this.bpm);
				row.find(".length").html(this.length);
				
				formatter.applyGenres(this.genres, row);			
				formatter.applyBeatportArtists(this.artists, row.find(".artists"));

				if (this.exclusive) {
					row.addClass("exclusive");
				}
				
				spotify.searchTrack(scrubber.searchTitle(this.name, this.artists, this.mixName), this.isrc, this.exclusive, function(response) {
					row.find(".title").html(linkFormat.format(response.href, title));
					row.find(".album").html(linkFormat.format(response.album.href, response.album.name));
					row.find(".popularity").html(response.popularity);
					formatter.applySpotifyArtistLinks(response.artists, row);
					row.addClass("matched");
				});
			});
		}	
		
		this.applyBeatportResponse = function(results, create) {
			$(results).each(function(index){
				if (this.type == "track") {
					var row = $("#isrc-" + this.isrc);
					if (row) {
						formatter.applyBeatportTrack(this, row);
					}
				}
			});
		}
		
		this.applySpotifyArtistLinks = function(artists, row) {
			var mixcell = row.find(".mix"); 
			var artistcell = row.find(".artists");
			artistcell.empty();
			
			$(artists).each(function(){
				var aslink = "<a href=\"{0}\">{1}</a>".format(this.href, this.name);
				if (artistcell.html() != "") {
					artistcell.append(", ");
				}
				artistcell.append(aslink);
			});
		}
		
		this.applyGenres = function(genres, row, callback) {
			$(genres).each(function(index){
				var gcell = row.find(".genre");
				if (index > 0) gcell.append(", ");
				if (callback) {
					var href = $("<a>");
					href.click(callback(id));
					href.html(this.name);
					gcell.append(href);
				} else {
					gcell.append(this.name);
				}
			});
		}
		
	}
	
	formatter = new Formatter();
});