
var diary = JSON.parse(data);

function getDayOfWeek(date) {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  	var dayOfWeek = new Date(date).getDay();    
  	return isNaN(dayOfWeek) ? null : days[dayOfWeek];
}

var MONTHES = ["January", "February", "March", "April", "May", "June", "July", 
			   "August", "September", "October", "November", "December"];

var DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var COLORS = {
	TEXT_COLOR: {
		BEGIN_COLOR: "#995b3a",
		END_COLOR: "#993a8c"
	},
	BORDER_COLOR: {
		BEGIN_COLOR: "#e8957a",
		END_COLOR: "#e87ad0"
	},
	WRAPPER_BORDER_COLOR: {
		BEGIN_COLOR: "#efc0b1",
		END_COLOR: "#efb1d6"
	},
	CONTENT_BACKGROUND_COLOR: {
		BEGIN_COLOR: "#f1cec0",
		END_COLOR: "#f0c0e9"
	},
	CONTENT_BOX_SHADOW_COLOR: {
		BEGIN_COLOR: "#d1b0a7",
		END_COLOR: "#d1a7c7"
	},
	BACKGROUND_COLOR: {
		// BEGIN_COLOR: "#efd5d0",
		// END_COLOR: "#efd0e8"
		BEGIN_COLOR: "#d0efd8",
		END_COLOR: "#efd5d0"
	}
};

// available weather icons: cloud, sun, rays, lightning, snow, bolt
var WEATHER_ICONS = {
	CLOUDY: ['cloud'],
	SUN_SHOWER: ['cloud', 'sun', ['rays'], 'rain'],
	THUNDER_STORM: ['cloud', 'lightning', ['bolt', 'bolt']],
	FLURRIES: ['cloud', 'snow', ['flake', 'flake']],
	SUNNY: ['sun', ['rays']],
	RAINY: ['cloud', 'rain']
}
var WEATHER = {
	'cloudy': WEATHER_ICONS.CLOUDY,
	'Cloudy': WEATHER_ICONS.CLOUDY,
	'sunny': WEATHER_ICONS.SUNNY,
	'晴': WEATHER_ICONS.SUNNY,
	'Sunny': WEATHER_ICONS.SUNNY,
	'rain': WEATHER_ICONS.RAINY,
	'tinyrain': WEATHER_ICONS.RAINY,
	'lilrain-Cloudy': WEATHER_ICONS.CLOUDY,
	'lilrain－sunny': WEATHER_ICONS.SUN_SHOWER
}

function hex(c) {
	var s = "0123456789abcdef";
	var i = parseInt(c);
	if (i == 0 || isNaN(c)) {
    	return "00";	
	}
	i = Math.round(Math.min(Math.max(0, i), 255));
	return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
}

function convertToHex(rgb) {
	return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

function convertToRGB(hex) {
	var color = [0, 0, 0];
	color[0] = parseInt((trim(hex)).substring(0, 2), 16);
	color[1] = parseInt((trim(hex)).substring(2, 4), 16);
	color[2] = parseInt((trim(hex)).substring(4, 6), 16);
	return color;
}

/* Remove '#' in color hex string */
function trim(s) {
	return (s.charAt(0) == '#') ? s.substring(1, 7) : s;
}

function generateColor(colorStart, colorEnd, colorCount) {
	var start = convertToRGB(colorStart);
	var end = convertToRGB(colorEnd);
	var len = colorCount;

	//Alpha blending amount
	var alpha = 0.0;
	var saida = [];
	
	for (i = 0; i < len; i++) {
		var c = [];
		alpha += (1.0/len);
		
		c[0] = start[0] * alpha + (1 - alpha) * end[0];
		c[1] = start[1] * alpha + (1 - alpha) * end[1];
		c[2] = start[2] * alpha + (1 - alpha) * end[2];

		saida.push(convertToHex(c));	
	}
	return saida;
}

function getColor(beginColor, endColor, month, day) {
	var colors = generateColor(beginColor, endColor, 13);
	colors = generateColor(colors[month-1], colors[parseInt(month)], DAYS[month-1]+1);
	return colors[parseInt(day)];
}

function updateColorGradient(month, day) {
	var textColor = getColor(COLORS.TEXT_COLOR.BEGIN_COLOR, COLORS.TEXT_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--text-color', '#'+textColor);
	var borderColor = getColor(COLORS.BORDER_COLOR.BEGIN_COLOR, COLORS.BORDER_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--border-color', '#'+borderColor);
	var wrapperBorderColor = getColor(COLORS.WRAPPER_BORDER_COLOR.BEGIN_COLOR, COLORS.WRAPPER_BORDER_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--wrapper-border-color', '#'+wrapperBorderColor);
	var contentBackgroundColor = getColor(COLORS.CONTENT_BACKGROUND_COLOR.BEGIN_COLOR, COLORS.CONTENT_BACKGROUND_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--content-background-color', '#'+contentBackgroundColor);
	var contentBoxShadowColor = getColor(COLORS.CONTENT_BOX_SHADOW_COLOR.BEGIN_COLOR, COLORS.CONTENT_BOX_SHADOW_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--content-box-shadow-color', '#'+contentBoxShadowColor);
	var backgroundColor = getColor(COLORS.BACKGROUND_COLOR.BEGIN_COLOR, COLORS.BACKGROUND_COLOR.END_COLOR, month, day);
	document.documentElement.style.setProperty('--background-color', '#'+backgroundColor);
}

function createNestedDivs(weather, index, container) {
	if (weather.length > index) {
		if (weather[index].constructor === Array) {
			createNestedDivs(weather[index], 0, container);
		} else {
			var subDiv = document.createElement('div');
			subDiv.classList.add(weather[index]);
			container.appendChild(subDiv);
			if (weather.length > (index + 1) && weather[index+1].constructor === Array) {
				createNestedDivs(weather, index+1, subDiv);
			}
			createNestedDivs(weather, index+2, container);	
		}
	}
}

function addContentToContainer(year, month, day, diary, container) {
	var div = document.createElement('div');
    div.classList.add('sub-content');

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');

	var dateSpan = document.createElement('span');
	var dayOfWeek = getDayOfWeek(year + '/' + month + '/' + day);
	var formatedDate = dayOfWeek + ', ' + MONTHES[parseInt(month)-1] + ' ' + parseInt(day) + ', ' + year;
    dateSpan.appendChild(document.createTextNode(formatedDate));
	dateSpan.classList.add('block');

	var span = document.createElement('span');
    span.appendChild(document.createTextNode(diary.content));

    contentDiv.appendChild(dateSpan);
    contentDiv.appendChild(span);
    
    if (diary.weather in WEATHER) {
    	var weatherDiv = document.createElement('div');
    	weatherDiv.classList.add('weather-div');
    	var weatherIcon = document.createElement('div');
    	weatherIcon.classList.add('icon');
    	createNestedDivs(WEATHER[diary.weather], 0, weatherIcon);

    	weatherDiv.appendChild(weatherIcon);
    	div.appendChild(weatherDiv);
    } else {
    	console.log("No weather icon for: ", diary.weather);
    }

    div.appendChild(contentDiv);
    container.appendChild(div);
}

function adjustWeatherIconSize() {
	var contents = document.querySelectorAll('.sub-content');
	if (contents.length) {
		contents.forEach(function(content) {
			var scale = content.clientHeight / 120;
			if (scale < 1) {
				content.querySelectorAll('.icon')[0].style.zoom = scale;
				if (scale < 0.7) {
					content.querySelectorAll('.icon')[0].style.top = "-5px";
					content.querySelectorAll('.icon')[0].style.right = "55px";
				} else if (scale >= 0.7 && scale < 0.8) {
					content.querySelectorAll('.icon')[0].style.top = "0px";
					content.querySelectorAll('.icon')[0].style.right = "50px";
				} else if (scale >= 0.8 && scale < 1) {
					content.querySelectorAll('.icon')[0].style.top = "5px";
					content.querySelectorAll('.icon')[0].style.right = "50px";
				}
			}
		});
	} else {
		setTimeout(adjustWeatherIconSize, 15);
	}
}

var year, month, day;
function showContent() {
	var listItem = this.parentNode;
	day = listItem.id;
	var dayNav = document.getElementById("day-nav").querySelectorAll("ul")[0];
	dayNav.childNodes.forEach(function(item) {
		item.classList.remove('active');
	});
	listItem.classList.add('active');
	updateColorGradient(month, listItem.id);

	var contentDiv = document.getElementById('content');
	contentDiv.innerHTML = "";
	if (year == '0') {
		if (!(month in diaryByDay) || !(listItem.id in diaryByDay[month])) {
			return;
		}
		for (year in diaryByDay[month][listItem.id]) {
		    addContentToContainer(year, month, day, diaryByDay[month][listItem.id][year], contentDiv);
		}
		adjustWeatherIconSize();
	} else if (year in diaryByYear && month in diaryByYear[year] && listItem.id in diaryByYear[year][month]) {
		addContentToContainer(year, month, day, diaryByYear[year][month][listItem.id], contentDiv);
		adjustWeatherIconSize();
	}
}

function loadLastDay() {
	var mostRecentDay = document.getElementById('day-nav').lastChild.lastChild.lastChild;
	eventFire(mostRecentDay, 'click');
}

function loadLastMonth() {
	var selectedYear = document.querySelectorAll('#year-nav > ul')[0].querySelectorAll('ul')[0];
	var mostRecentMonth = selectedYear.parentNode.lastChild.lastChild.lastChild;
	eventFire(mostRecentMonth, 'click');
	loadLastDay();
}

// listener when a month is clicked
function addDaysToMonth() {
	var listItem = this.parentNode;
	month = listItem.id;
	var monthNav = document.querySelectorAll("li.active.month-populated")[0].querySelectorAll("ul")[0];
	monthNav.childNodes.forEach(function(item) {
		item.classList.remove('active');
	});
	listItem.classList.add('active');

	var days = diaryByYear[listItem.parentNode.parentNode.id][listItem.id];
	var dayNav = document.getElementById('day-nav');
	dayNav.innerHTML = "";
	parseObjectToNavItems(days, dayNav, showContent);
	loadLastDay();
}

// listener when a year is clicked
function addMonthesToYear() {
	var listItem = this.parentNode;
	year = listItem.id;
	var yearNav = document.getElementById('year-nav').querySelectorAll("ul")[0];
	yearNav.childNodes.forEach(function(item) {
		item.classList.remove('active');
	});
	listItem.classList.add('active');
	if (listItem.className.indexOf('month-populated') > -1) {
		return;
	}
	var monthes = diaryByYear[listItem.id];
	parseObjectToNavItems(monthes, listItem, addDaysToMonth);
	listItem.classList.add('month-populated');
	loadLastMonth();
}

function sortObjKeys(keys) {
	keys.sort(function(a, b) {
		return parseInt(a) - parseInt(b);
	});
	return keys;
}

function parseObjectToNavItems(obj, container, listener) {
    var listGroup = document.createElement('ul');
    listGroup.className = "list-group";
    sortObjKeys(Object.keys(obj)).forEach(function(key) {
        var listItem = document.createElement('li');
        listItem.id = key;
        listItem.className = "list-group-item";

        var span = document.createElement('span');
        var spanValue = parseInt(key);
        if (key == '0') {
        	spanValue = 'Any';
        }
        span.appendChild(document.createTextNode(spanValue));
        span.addEventListener('click', listener);

        listItem.appendChild(span);
        listGroup.appendChild(listItem);
    });
    for (var key in obj) {
    };
    container.appendChild(listGroup);
}

function eventFire(el, etype){
	if (el.fireEvent) {
		el.fireEvent('on' + etype);
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(etype, true, false);
		el.dispatchEvent(evObj);
	}
}

function generateObj(num) {
	var rv = {};
	for (var i = 1; i <= num; ++i) {
		var key = i.toString();
		if (key.length == 1) {
			key = '0' + key;
		}
		rv[key] = i;
	}
	return rv;
}

// build diary by year
/*
{
	year: {
		month: {
			day: {
				weather, day, content
			}
		}
	}
}
*/
var diaryByYear = {};
diaryByYear['0'] = generateObj(12);
for (var key in diaryByYear['0']) {
	var num = DAYS[parseInt(diaryByYear['0'][key])-1];
	diaryByYear['0'][key] = generateObj(num);
}
for (date in diary) {
	var year = date.substring(0, 4);
	var month = date.substring(4, 6);
	var day = date.substring(6, 8);
	if (!(year in diaryByYear)) {
		diaryByYear[year] = {};
	}
	if (!(month in diaryByYear[year])) {
		diaryByYear[year][month] = {};
	}
	diaryByYear[year][month][day] = diary[date];
}

// build diary by day
var diaryByDay = {};
for (date in diary) {
	var year = date.substring(0, 4);
	var month = date.substring(4, 6);
	var day = date.substring(6, 8);
	if (!(month in diaryByDay)) {
		diaryByDay[month] = {};
	}
	if (!(day in diaryByDay[month])) {
		diaryByDay[month][day] = {};
	}
	diaryByDay[month][day][year] = diary[date];
}

document.addEventListener('DOMContentLoaded', function(){ 
    var yearNav = document.getElementById('year-nav');
	parseObjectToNavItems(diaryByYear, yearNav, addMonthesToYear);
	
	// load most recent diary
	var mostRecentYear = yearNav.lastChild.lastChild.lastChild;
	eventFire(mostRecentYear, 'click');
	loadLastMonth();
}, false);

























