
var Scrubber = function() {
	this.scrubTitle = function(title) {
		title = scrubber.lessFeatures(title);
		return title;
	}
	
	this.searchTitle = function(title, artists, mixname) {
		if (mixname.indexOf("Original") > -1) {
			return (scrubber.lessCountries(artists[0].name) + " " + scrubber.lessFeatures(title)).toLowerCase(); 
		
		} else {
			var artistquery = artists[0].name;
			if (mixname.indexOf(artists[0].name) > -1 && mixname.indexOf("Remix") > -1) {
				artistquery = artists[artists.length - 1].name;
			}
			
			return (scrubber.lessCountries(artistquery) + " " + scrubber.lessFeatures(scrubber.lessDashes(title)) + " " + mixname).toLowerCase();
		}
	}
	
	this.artists = function(artists) {
		
	}
	
	this.scrubMix = function(mixname) {
		if (mixname.indexOf("Original") > -1) {
			return "";
		} else {
			return scrubber.lessCountries(mixname);
		}
	}
	
	this.lessCountries = function(artist) {
		if (artist.indexOf("(USA)") > -1) {
			return artist.replace(" \(USA\)", "")
		} else if (artist.indexOf("(UK)") > -1) {
			return artist.replace(" \(UK\)", "")
		} else {
			return artist;
		}
	}
	
	this.lessDashes = function(title) {
		return title.replace(" - ", " ");
	}
	
	this.lessFeatures = function(title) {
		title = title.replace(/\([Ff]eat.*\)/g, "");
		var featloc = title.toLowerCase().indexOf(" feat.");
		featloc = (featloc == -1) ? title.toLowerCase().indexOf("ft.") : featloc;
		
		if (featloc > -1) {
			return title.substring(0, featloc);
		} 
		return title;
	}
}


scrubber = new Scrubber();