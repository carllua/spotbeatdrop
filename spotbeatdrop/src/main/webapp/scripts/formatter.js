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
		var tablesorted = false;

		function sort() {
			if (!tablesorted) {
				$("#results").tablesorter();
				tablesorted = true;
			} else {
				$("#results").trigger("update");
			}
		}
		
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
		
		this.applySpotifyResponse = function(results, index) {
			if (results.info.type == "track") {
				spotifyTrack(results.track, index)
			}
		}
		
		function spotifyTrack(track, index) {		
			var isrc = spotify.id(track, "isrc");		
			var row = addRow();
			
			row.attr("id", isrc);
			row.find(".index").html(index);
			row.find(".title").html(linkFormat.format(track.href, track.name));
			row.find(".album").html(linkFormat.format(track.album.href, track.album.name));
			formatter.applyPopularity(track.popularity, row);
			formatter.applySpotifyArtistLinks(track.artists, row);
			
			beatport.search(scrubber.searchTitle(track.name, track.artists), isrc);
		}	
		
		this.applyBeatportResponse = function(track, isrc) {	
			var row = $("#" + isrc);

			row.find(".title a").html(scrubber.scrubTitle(track.name));
			row.find(".released").html(track.releaseDate);
			row.find(".mix").html(scrubber.scrubMix(track.mixName));
			row.find(".image").html("<img src=\"" + track.images.small.url + "\" />")
			row.find(".bpm").html(track.bpm);
			row.find(".length").html(track.length);

			row.addClass("matched");
			
			formatter.applyGenres(track.genres, row);

			sort();
		}
		
		this.applySpotifyArtists = function(cell, artists) {
			cell.empty();
			$(artists).each(function(index){
				if (index > 0) {
					cell.append(", ");
				}
				if (this.name != "Various Artists" && this.href) {
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
					formatter.applyPopularity(response.popularity, row);
					formatter.applySpotifyArtistLinks(response.artists, row);
					row.addClass("matched");
				});
			});
		}
		
		this.applySpotifyArtistLinks = function(artists, row) {
			var artistcell = row.find(".artists");
			artistcell.empty();
			
			$(artists).each(function(){
				if (this.href && this.name != "Various Artists") {
					var aslink = "<a href=\"{0}\">{1}</a>".format(this.href, this.name);
					if (artistcell.html() != "") {
						artistcell.append(", ");
					}
					artistcell.append(aslink);
				}
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
		
		this.createPlaylist = function() {
			var href = "";
			$(".title a").each(function(){
				if (href.length > 0) href += "\n";
				href += this.href;
			});
			$("#playlist").attr("href", href);
		}
		
		this.applyPopularity = function(value, row) {
			var intval = Math.floor(value * 100);
			var cell = row.find(".popularity");
			cell.find(".hidden").html(value);
			cell.find(".meter").css({ 
				"width": intval + "%", 
				"background-color": "#{0}FF{0}".format(100 - intval) 
			});
		}
		
	}
	
	formatter = new Formatter();
});