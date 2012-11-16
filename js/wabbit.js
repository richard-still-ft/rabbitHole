var rabbit = {};

rabbit.ip = '172.16.119.136';

rabbit.init = function () {
	rabbit.bindEventListeners();
	rabbit.doPopular();
}

rabbit.showResults = function () {
	$('#doingStuff').hide();
	$('#popular').hide();
	$('#sb').hide();
	$('#itemContent').hide();
	$('#resultsList').fadeIn('slow');
	rabbit.toggleNav('resultsNav');
};

rabbit.showItem =  function () {
	$('#doingStuff').hide();
	$('#resultsList').hide();
	$('#popular').hide();
	$('#sb').hide();
	$('#itemContent').fadeIn('slow');
	rabbit.toggleNav('itemNav');
}

rabbit.showSearch =  function () {
	$('#doingStuff').hide();
	$('#resultsList').hide();
	$('#itemContent').hide();
	$('#sb').fadeIn('slow');
	setTimeout(function () {
		$('#popular').fadeIn('slow');
	}, 500);
	
	rabbit.toggleNav('searchNav');
}

rabbit.bindEventListeners = function () {
	$('#resultsNav a').on('click', function () {
		rabbit.showResults();
	});
	$('#searchNav a').on('click', function () {
		rabbit.showSearch();
	});
	$('#itemNav a').on('click', function () {
		rabbit.showItem();
	});		
	$('#doIt').on('click', function () {
		var q = $('#appendedInputButtons').val();
		rabbit.doSearch(q);
	});
	$('#goRandom').on('click', function () {
		rabbit.doRandom();
	});
};

rabbit.doRandom = function () {
	$('#doingStuff').show();
	$.ajax({url:	'http://' + rabbit.ip + ':8080/content/rabbithole/random?callback=rabbit.searchResponse',
		dataType:	'script',
		cache:		false
	});
};

rabbit.doPopular = function () {
	$.ajax({url:	'http://' + rabbit.ip + ':8080/content/rabbithole/toparticles?callback=rabbit.popularResponse',
		dataType:	'script',
		cache:		false
	});	
}

rabbit.doSearch = function (q) {
	$('#doingStuff').show();
	$.ajax({url:	'http://' + rabbit.ip + ':8080/content/rabbithole?callback=rabbit.searchResponse&query=' + q,
		dataType:	'script',
		cache:		false
	});
}

rabbit.bindSearchResults = function () {
	$('#searchResults li a').on('click', function (e) {
		e.preventDefault();
		var id = $(this).attr('href');
		rabbit.getItem(id);
	});
};

rabbit.getItem = function (id) {
	$('#doingStuff').show();
	$.ajax({url:	'http://' + rabbit.ip + ':8080/content/rabbithole/' + id + '?callback=rabbit.itemResponse',
		dataType:	'script',
		cache:		false
	});	
};

rabbit.toggleNav = function (navId) {
	$('#nav li').removeClass('active');
	$('#' + navId).addClass('active');
};

rabbit.itemResponse = function (json) {
	//l(json);
	$('#leftColMeta').html('');
	$('#rightColMeta').html('');
	rabbit.showItem();
	$('#title').html(json.item.title.title);
	$('#story').html(json.item.body.body);
	rabbit.renderMetaData(json.item.metadata.companies, 'Companies', 'companies', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.people, 'Peeps', 'people', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.regions, 'Regions', 'regions', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.topics, 'Topics', 'topics', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.specialReports, 'Special Reports', 'specialReports', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.sections, 'Sections', 'sections', '#leftColMeta');
	rabbit.renderMetaData(json.item.metadata.subjects, 'Subjects', 'subjects', '#leftColMeta');
	rabbit.renderChartBeatCount(json.item.chartBeatCount);		
};

rabbit.renderChartBeatCount = function (chartBeatCount) {
	var response = '';
	response += '<div class="itemChartBeatCount"><img src="img/icon.png" class="chartBeatIcon"/>' + '<span class="chartBeatCount">' +  chartBeatCount + ' current readers</span></div>';
	$('#rightColMeta').append(response);
};

rabbit.popularResponse = function (json) {
	$('#doingStuff').hide();
	var response = rabbit.getPopularResultsHTML(json);
	$('#popularList').html(response);
}

rabbit.renderMetaData = function (sectionsList, title, filterType, location) {
	if (sectionsList && sectionsList.length !== 0) {
		var i = 0, text = '';
		text += '<div class="itemMeta" id="meta_' + filterType + '">';
		text += '<h5>' + title + '</h5>';
		text += '<ul>';

		for (i; i < sectionsList.length; i++) {
			text += '<li><a data-content="Stuff" rel="popover" data-filterType="' + filterType + '" data-sectionname="' + sectionsList[i].term.name + '">' + sectionsList[i].term.name + '</a></li>';
		}
		text += '<ul></div>';
		$(location).append(text);
		$('.itemMeta a').on('click', function () {
			rabbit.doMetaSearch($(this));
		});	
	}
};

rabbit.doMetaSearch = function (jobj) {
	//l('do meta search');
	var q = jobj.attr('data-filterType') + ':' + jobj.attr('data-sectionname');
	rabbit.doSearch(q);
};

rabbit.searchResponse = function (json) {
	//l(json);
	rabbit.showResults();
	var resultsHtml = rabbit.getSearchResultsHTML(json);
	//l(resultsHtml);
	$('#searchResults').html(resultsHtml);
	rabbit.bindSearchResults();
}

$(document).ready(function () {
	rabbit.init();
});

rabbit.getSearchResultsHTML = function (searchResults) {
	var resultsList = searchResults.results[0].results;
	var i = 0, response = '';
	//l(resultsList);
	response += '<div id="summary">You searched for: <strong>';
	response += searchResults.query.queryString;
	response += '</strong></div>';

	response += '<div class="resultsColumns"><ul>'
	for (i; i < resultsList.length; i++) {
		response += '<li class="responseItem">';
		response += '<div class="resultCount">' + prefixZeroToDigit(i+1) + '</div>';
		response += '<div class="itemTitle">';
		response += '<a href="' + resultsList[i].id + '">';
		response += resultsList[i].title.title;
		response += '</a>';
		response += '</div>';
		response += '<div class="excerpt">';
		response += resultsList[i].summary.excerpt;;
		response += '</div>';
		response += '<div class="chartBeatWrapper">';
		response += '<img src="img/icon.png" class="chartBeatIcon"/>' + '<span class="chartBeatCount">' + resultsList[i].chartBeatCount + ' current readers</span>';
		response += '</div>';
		response += '</li>';
	}
	response += "</ul></div>";
	return response;
};

rabbit.getPopularResultsHTML = function (searchResults) {
	var resultsList = searchResults.items;
	var i = 0, response = '';
	//l(resultsList);

	response += '<div class="resultsColumns"><ul>'
	for (i; i < resultsList.length; i++) {
		response += '<li class="responseItem">';
		response += '<div class="resultCount">' + prefixZeroToDigit(i+1) + '</div>';
		response += '<div class="itemTitle">';
		response += '<a href="' + resultsList[i].id + '">';
		response += resultsList[i].title.title;
		response += '</a>';
		response += '</div>';
		response += '<div class="excerpt">';
		response += resultsList[i].summary.excerpt;
		response += '</div>';
		response += '<div class="chartBeatWrapper">';
		response += '<img src="img/icon.png" class="chartBeatIcon"/>' + '<span class="chartBeatCount">' + resultsList[i].chartBeatCount + ' current readers</span>';
		response += '</div>';
		response += '</li>';
	}
	response += "</ul></div>";
	return response;
};

function prefixZeroToDigit (digit) {
	digit = digit.toString();
	if(digit.length === 1) {
		digit = '0' + digit;
	}
	return digit;
}

function l (s) {
	console.log(s);
}