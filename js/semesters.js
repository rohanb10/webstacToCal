/***
 * semesters.js
 * Data for WUSTL's various semesters and helper methods to access them.
 * Author: Silas Hsu, December 2014
 * PLEASE give acknowledgement if you copy this code.
 ***/
 
/**
 * Returns a new date that is the specified number of days after this one.
 * Thank you StackOverflow!  http://stackoverflow.com/questions/563406/add-days-to-datetime
 */
Date.prototype.offsetDateBy = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

/* Returns the date portion of this date's ISO string, plus the 'T' */
Date.prototype.toISODateStr = function() {
	return this.toISOString().substring(0, 11);
}

/*
 * 'startDate' must be a Javascript Date.
 * 'endDate' must be a string formatted as YYYYMMDD
 * Warning: if startDate is not a Monday, it could has issues.  See warning in tableParse.js
 */
semesters = {
	'SP15': {
		'startDate': new Date(2015,0,12), // 0 = January
		'endDate': '20150425'
	},
	'FL15': {
		'startDate': new Date(2015, 07, 24),
		'endDate': '20151205'
	},
	'SP16': {
		'startDate': new Date(2016,0,19),
		'endDate': '20160430'
	},
	'FL16': {
		'startDate': new Date(2016,07,29),
		'endDate': '20161210'
	},
	'SP17': {
		'startDate': new Date(2017,0,17),
		'endDate':'20170429'
	}
}
