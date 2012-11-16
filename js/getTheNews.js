/*

	To embed this on an HTML add the following where you like the feed to appear. Inside the <div class="storyContent"></div element>

	<div id='theRiver'>
	</div>
	<script>
	$.ajax({url:'[PATH_TO_FILE]/getTheNews.js',
		dataType: 'script',
		cache: true
	});
	</script>

*/
/*global FT:true */
// The namesapce for this widget
var riverOfNews = {};

// Application config, override dataSource at build time
riverOfNews.config = (function () {
	"use strict";
	var dataSource		= 'http://www.ft-static.com/contentapi/live/latestNewsJSONP.js',
		refreshDelay	= 60 * 1000; // Seconds times milliseconds

	function getDataSource () {
		return dataSource;
	}

	return {
		getDataSource:	getDataSource,
		dataSource:		dataSource,
		refreshDelay:	refreshDelay
	};
}());


riverOfNews.data = (function () {
	"use strict";
	var jsonResponse	= null,
		timerReference	= null,
		refreshCount	= 0;

	// Fetch the JSONP, this will call generateList in the callback
	function getData () {
		var dataUrl = riverOfNews.config.getDataSource();
		$.ajax({url:		dataUrl,
				dataType:	'script',
				cache:		false
		});
	}

	return {
		getData:		getData,
		jsonResponse:	jsonResponse,
		timerReference: timerReference,
		refreshCount:	refreshCount
	};
}());


riverOfNews.render =  (function () {
	"use strict";
	var currentFlyOut	= false,
		currentItemId	= false,
		r				= riverOfNews,
		currentItem;

	// Generate the HTML list of news items
	function generateList (jsonResponse) {
		// Stop the load timer and start the render timer
		if (r.data.refreshCount === 0) {
			FT.$doc.trigger("pgObjStop", {key: "riverOfNews.getData"});
			FT.$doc.trigger("pgObjStart", {key: "riverOfNews.render"});
		}
		r.data.refreshCount += 1;

		r.data.jsonResponse = jsonResponse;

		var articles = jsonResponse.articles,
			util = riverOfNews.utility,
			content = '',
			date,
			i,
			article,
			localTime;

		// Build up the response string. We are not using a template lib here because even a micro framework
		// will double the size of the code and we only have a single template anyway
		for (i = 0; i < articles.length; i++) {
			article = articles[i];
			date = article.publishTime;
			localTime = util.parseDateInt(date);

			content += '<div class="item">';
			content += '<div class="title" id="riverTitle_' + i + '">';
			content += '<span class="time">' + localTime + '</span>';
			content += '<a data-flyoutId="#flyout_' + i + '" id="tooltip_' + i + '" rel="tooltip" data-title="' + article.summary + '" href="' + article.url + '">' + article.title + '</a>';
			content += '</div>';
			content += '<div id="flyout_' + i + '" class="flyout">';
			content += '<p>';
			content += '<a href="' + article.url + '">' + article.summary + '</a>';
			content += '</p>';
			content += '</div>';
			content += '</div>';
		}

		content += '<div class="title spacer"></div>';
		// Populate the DOM, but only at the right time
		util.handleDomReadyAbility(renderList, content);
	}

	function renderFrame () {
		var content;
		content = '<div class="comp-header">';
		content += '<h3 class="comp-header-title">LATEST HEADLINES</h3>';
		content += '<span id="riverLastModified"></span>';
		content += '</div>';
		content += '<div id="riverList">';
		content += '</div>';
		FT.$('#theRiver').html(content);
	}


	function addJsonLastModified () {
		var jsonLastModifiedTime = riverOfNews.data.jsonResponse.lastModifiedTime;
		jsonLastModifiedTime = "Last updated " + riverOfNews.utility.parseDateInt(jsonLastModifiedTime);
		FT.$('#riverLastModified').html(jsonLastModifiedTime);
	}

	// Add the content to the DOM and bind the events
	function renderList (content) {
		// The time the JSON was last updated to the UI
		addJsonLastModified();

		// Add the list content to the UI
		FT.$('#riverList').html(content);
		
		// Bind events. The flyout will persist until another item has been moused-over
		FT.$('#theRiver .title a').on('mouseover', function () {
			var flyoutId = FT.$(this).attr('data-flyoutId');
			
			// Hide the existing flyout. This seem a bit brute-force to me
			// but sometimes the browser got confused with toggle so...
			$('#riverList .flyout').hide();
			$('#riverList .title').removeClass('titleHighlight');

			// Now deal with the new item
			currentItemId	= FT.$(this).parent().addClass('titleHighlight');

			FT.$(flyoutId).fadeIn('fast');
		});

		// Stop the render timer
		if (r.data.refreshCount === 0) {
			FT.$doc.trigger("pgObjStop", {key: "riverOfNews.render"});
		}
	}

	return {
		renderList: renderList,
		generateList: generateList,
		renderFrame: renderFrame
	};

}());


// CSS and methods to insert them into the DOM
riverOfNews.css = (function () {
	"use strict";
    /*jshint white: true */
    var _styles = {
        allBrowsers: [
			'#theRiver {',
			'	font-family: Arial,Helvetica,sans-serif;',
			'}',

			'#theRiver .comp-header {',
			'	background-color: #FFF1E0;',
			'}',

			'#theRiver h3 {',
			'	line-height: 18px;',
			'}',

			'#riverList {',
			'	margin: 15px 0 -44px 0;',
			'	background-color: #F6E9D8;',
			'	font-size: 13px;',
			'	line-height: 16px;',
			'}',

			'#theRiver .title {',
			'	border-top: #E9DECF solid 1px;',
			'	width:66%;',
			'	background-color: #FFF1E0;',
			'	clear:left;',
			'	padding: 11px 0;',
			'}',

			'#theRiver #riverList div.titleHighlight {',
			'	background-color: #F6E9D8;',
			'}',

			'#riverList .item {',
			'	clear:left;',
			'	position: relative;',
			'}',

			'#theRiver div.title a {',
			'	display: inline-block;',
			'	width: 72%;',
			'}',

			'#theRiver .time {',
			'	font-size: 12px;',
			'	color: #74736C;',
			'	float:left;',
			'	width: 25%;',
			'	padding-left: 2%',
			'}',

			'#theRiver div.flyout {',
			'	border-top: #E9DECF solid 1px;',
			'	width: 34%;',
			'	position: absolute;',
			'	right:0; top:0;',
			'	background-color: #F6E9D8;',
			'	display: none;',
			'	line-height: 18px;',
			'	z-index:10;',
			'}',

			'#theRiver div.spacer {',
			'	height: 50px;',
			'}',

			'#riverLastModified{',
			'	font-weight: normal;',
			'	color: #74736C;',
			'	float: right;',
			'	padding: 7px 0 0 0;',
			'	font-size: 12px;',
			'}',

			'#theRiver .flyout p {',
			'	padding: 9px 10px;',
			'	font-size: 12px;',
			'}'
        ],
        ie6: [
			'#theRiver .time {',
			'	width: 24%;',
			'}'
        ]
    };
    /*jslint white: false */

    function getStyles(styleSet) {
        return _styles[styleSet].join('');
    }

    // Used to insert CSS into the head of the document, we do this so there is not
    // another http request or a "flash of unstyled content"
    function insertStyles(styleSet) {
        var styleTag = document.createElement('style'),
            styles = getStyles(styleSet),
            head = document.getElementsByTagName('head')[0];

        styleTag.setAttribute('type', 'text/css');

        // Detect for IE
        if (styleTag.styleSheet) {
            styleTag.styleSheet.cssText = styles;
        } else {
            styleTag.textContent = styles;
        }

        head.appendChild(styleTag);
    }

    // Return public methods
    return {
        getStyles: getStyles,
        insertStyles: insertStyles
    };
}());


riverOfNews.utility = (function () {
	"use strict";
	function getInternetExplorerVersion () {
        var ua, re, rv;
        // Returns the version of Internet Explorer or a -1
        // (indicating the use of another browser).
        rv = -1; // Return value assumes failure.
        if (navigator.appName === 'Microsoft Internet Explorer') {
            ua = navigator.userAgent;
            re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
            if (re.exec(ua) !== null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    }

	function prefixZeroToDigit (digit) {
		digit = digit.toString();
		if(digit.length === 1) {
			digit = '0' + digit;
		}
		return digit;
	}

    // Turn the returned date string is a human friendly format
	function parseDateInt (dateInt) {
		var today,
			todaysTime,
			itemDate,
			itemTime,
			dayInMs,
			elapsedTime,
			dayStr,
			time,
			elapsedDays,
			timeSinceMidnight,
			midnight;

		// A day in ms, used to calculate how many days ago an item was published
		dayInMs				= 1000 * 60 * 60 * 24;
		today				= new Date();
		todaysTime			= today.getTime();

		itemDate			= new Date(dateInt);
		itemTime			= itemDate.getTime();

		// The time in a human readable format
		time				= prefixZeroToDigit(itemDate.getHours()) + ':' + prefixZeroToDigit(itemDate.getMinutes());

		// How many ms have elapsed since midnight, we need to calculate form midnight to accurately calculate
		// how many days ago an item was published
		timeSinceMidnight	= (today.getHours() * 1000 * 60 * 60) + (today.getMinutes() * 1000 * 60);

		// When midnight was
		midnight			= todaysTime - timeSinceMidnight;

		// How long in ms has elapsed between publication and midnight
		elapsedTime			= midnight - itemTime;

		// How many days have elapsed since publication and midnight
		elapsedDays			= elapsedTime / dayInMs;

		if (itemTime > midnight) {
			dayStr = time + ' today';
		} else if ((itemTime < midnight) && (itemTime > midnight - dayInMs)) {
			dayStr = time + ' yesterday';
		} else {
			dayStr = time + ' ' + Math.ceil(elapsedDays) + ' days ago';
		}

		return dayStr;
	}

	function handleDomReadyAbility (callback, options) {
		var r = riverOfNews;
		// We need to wait for DOM ready ie we are on IE7 or below other pain will happen
		if (r.utility.getInternetExplorerVersion <= 7) {
			FT.$(function () {
				callback(options);
			});
		} else {
			// If not a really flaky browser then start interacting with the DOM immediately
			callback(options);
		}
	}

    return {
		getInternetExplorerVersion: getInternetExplorerVersion,
		parseDateInt: parseDateInt,
		handleDomReadyAbility: handleDomReadyAbility
    };
}());


riverOfNews.init = function () {
	"use strict";
	var r = riverOfNews;
	// Insert the CSS
	r.css.insertStyles('allBrowsers');

	// We need to do a liitle extra for IE6
	if (r.utility.getInternetExplorerVersion() === 6) {
		r.css.insertStyles('ie6');
	}

	// Render the frame for the list
	r.utility.handleDomReadyAbility(r.render.renderFrame, '');

	// Start the timer for data retrieval
	FT.$doc.trigger("pgObjStart", {key: "riverOfNews.getData"});
		
	// Fetch the JSONP
	r.data.getData();
	
	// And setup a recurring fecth of the data
	r.timerReference = setInterval(function () {
		r.data.getData();
	}, r.config.refreshDelay);
};

riverOfNews.init();