
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
	1: {

	},
};

function hex (c) {
  var s = "0123456789abcdef";
  var i = parseInt (c);
  if (i == 0 || isNaN (c))
    return "00";
  i = Math.round (Math.min (Math.max (0, i), 255));
  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex (rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

function generateColor(colorStart,colorEnd,colorCount){

	// The beginning of your gradient
	var start = convertToRGB (colorStart);    

	// The end of your gradient
	var end   = convertToRGB (colorEnd);    

	// The number of colors to compute
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

		saida.push(convertToHex (c));
		
	}
	
	return saida;
	
}

var tmp = generateColor('#000000','#ff0ff0',10);

for (cor in tmp) {
  $('#result_show').append("<div style='padding:8px;color:#FFF;background-color:#"+tmp[cor]+"'>COLOR "+cor+"° - #"+tmp[cor]+"</div>")
 
}

function generateColorGraident(fromColor, toColor) {
	var h= Math.floor((toColor - fromColor) * 120 / 100);
    var s = Math.abs(toColor - 50)/50;
    var v = 1;
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
		case 0:
			rgb = [v, data[2], data[0]];
			break;
		case 1:
		rgb = [data[1], v, data[0]];
		break;
		case 2:
		rgb = [data[0], v, data[2]];
		break;
		case 3:
		rgb = [data[0], data[1], v];
		break;
		case 4:
		rgb = [data[2], data[0], v];
		break;
		default:
		rgb = [v, data[0], data[1]];
		break;
    }
}

function updateColorGradient() {
	document.documentElement.style.setProperty('--text-color', '#32ff99');
	document.documentElement.style.setProperty('--border-color', '#32ff99');
	document.documentElement.style.setProperty('--wrapper-border-color', '#32ff99');
	document.documentElement.style.setProperty('--content-background-color', '#32ff99');
	document.documentElement.style.setProperty('--content-box-shadow-color', '#32ff99');
}

function addContentToContainer(content, container) {
	var div = document.createElement('div');
	var span = document.createElement('span');
    span.appendChild(document.createTextNode(content));
    div.classList.add('sub-content');
    div.appendChild(span);
    container.appendChild(div);
}

var year, month, day;
function showContent() {
	var listItem = this.parentNode;
	var dayNav = document.getElementById("day-nav").querySelectorAll("ul")[0];
	dayNav.childNodes.forEach(function(item) {
		item.classList.remove('active');
	});
	listItem.classList.add('active');

	var content = diaryByYear[year][month][listItem.id].content;
	var contentDiv = document.getElementById('content');
	contentDiv.innerHTML = "";
	if (year == '0') {
		if (!(month in diaryByDay) || !(listItem.id in diaryByDay[month])) {
			return;
		}
		for (year in diaryByDay[month][listItem.id]) {
			content = diaryByDay[month][listItem.id][year].content;
		    addContentToContainer(content, contentDiv);
		}
	} else {
		addContentToContainer(content, contentDiv);
	}
}

function addDaysToMonth() {
	var listItem = this.parentNode;
	month = listItem.id;
	var monthNav = document.querySelectorAll("li.active")[0].querySelectorAll("ul")[0];
	monthNav.childNodes.forEach(function(item) {
		item.classList.remove('active');
	});
	listItem.classList.add('active');
	var days = diaryByYear[listItem.parentNode.parentNode.id][listItem.id];
	var dayNav = document.getElementById('day-nav');
	dayNav.innerHTML = "";
	parseObjectToNavItems(days, dayNav, showContent);
}

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
	diaryByYear[year][month][day].day = getDayOfWeek(year + '/' + month + '/' + day);
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
	diaryByDay[month][day][year].day = getDayOfWeek(year + '/' + month + '/' + day);
}

document.addEventListener('DOMContentLoaded', function(){ 
    var yearNav = document.getElementById('year-nav');
	parseObjectToNavItems(diaryByYear, yearNav, addMonthesToYear);
	
	// load most recent diary
	var mostRecentYear = yearNav.lastChild.lastChild.lastChild;
	eventFire(mostRecentYear, 'click');
	var mostRecentMonth = mostRecentYear.parentNode.lastChild.lastChild.lastChild;
	eventFire(mostRecentMonth, 'click');
	var mostRecentDay = document.getElementById('day-nav').lastChild.lastChild.lastChild;
	eventFire(mostRecentDay, 'click');
}, false);

























