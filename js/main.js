var classTable = 
"<table class='table table-hover'>\
	<thead>\
		<tr>\
			<td>Class name</td>\
			<td>Days <br> (MTWTFSS)</td>\
			<td>Time <br> (start - end)</td>\
			<td>Location</td>\
			<td></td>\
		</tr>\
	</thead>\
	<tbody id='classtable'></tbody>\
</table>";

var classnameColStr = "<td class='classname'><input type='text'></input></td>";
var checkboxColStr = "<td class='classdays'><input type='checkbox' class='mon'/><input type='checkbox' class='tue'/><input type='checkbox' class='wed'/><input type='checkbox' class='thu'/><input type='checkbox' class='fri'/><input type='checkbox' class='sat'/><input type='checkbox' class='sun'/></td>";
var timeSelect = "<select><option></option><option>8:00 AM</option><option>8:30 AM</option><option>9:00 AM</option><option>9:30 AM</option><option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option><option>12:00 PM</option><option>12:30 PM</option><option>1:00 PM</option><option>1:30 PM</option><option>2:00 PM</option><option>2:30 PM</option><option>3:00 PM</option><option>3:30 PM</option><option>4:00 PM</option><option>4:30 PM</option><option>5:00 PM</option><option>5:30 PM</option><option>6:00 PM</option><option>6:30 PM</option><option>7:00 PM</option><option>7:30 PM</option><option>8:00 PM</option><option>8:30 PM</option><option>9:00 PM</option><option>9:30 PM</option><option>10:00 PM</option><option>10:30 PM</option><option>11:00 PM</option><option>11:30 PM</option></select>";
var classtimeColStr = "<td class='classtime'>" + timeSelect + " - " + timeSelect + "</td>";
var classlocColStr = "<td class='classloc'><input type='text'></input></td>";

function makeCheckboxes(dayStr) {
	boxes = $(checkboxColStr);
	if (!dayStr || dayStr.length != 7)
		return boxes;
		
	for (i = 0; i < 7; i++) {
		if (dayStr.charAt(i) != '-')
			boxes.children()[i].checked = true;
	}
	
	return boxes;
}

function makeTimeSelect(timeStr) {
	col = $('<td></td>')
	start = $(timeSelect);
	end = $(timeSelect);
	col.append(start);
	col.append(' - ');
	col.append(end);
	if (!timeStr)
		return col;
		
	split = timeStr.split('-'); // Parse time
	startTxt = split[0].match(/\d\d?:\d\d[ap]/);
	endTxt = split[1].match(/\d\d?:\d\d[ap]/);
	if (split.length != 2 || !startTxt || !endTxt)
		return col;
	
	if (split[0].charAt(split[0].length - 1) == 'a') // Set start
		ampm = ' AM';
	else
		ampm = ' PM';
	start.val(split[0].slice(0, split[0].length - 1) + ampm);
	
	if (split[1].charAt(split[1].length) == 'a') // Set end
		ampm = ' AM';
	else
		ampm = ' PM';
	end.val(split[1].slice(0, split[1].length - 1) + ampm);
	
	return col;
}

function logClasses() {
	$('table').remove();

	input = document.getElementById('inputbox').value;
	classText = input.match(/[A-Z]\d\d.+/g);
	if (classText != null)
		$('.container').append(classTable);
	
	var classNum = 0;
	for (index in classText) {
		cols = classText[index].split('\t');
		if (cols.length < 5)
			continue;
		name = cols[1];
		
		time = cols[4].split(' ');
		if (time.length < 2)
			time.push(null);

		if (cols.length >= 6)
			loc = cols[5];
		else
			loc = null;

		newrow = $("<tr></tr>");
		newrow.attr('id', 'class'+classNum.toString());
		
		classname = $(classnameColStr);
		classname.children()[0].value = name;
		newrow.append(classname);
		
		checkboxes = makeCheckboxes(time[0]);
		newrow.append(checkboxes);
		
		classtime = makeTimeSelect(time[1]);
		newrow.append(classtime);
		
		classloc = $(classlocColStr);
		classloc.children()[0].value = loc;
		newrow.append(classloc);
		
		btn = $("<td class='btncol'><button class='btn btn-primary'>Button!</button>");
		newrow.append(btn);
		
		$('#classtable').append(newrow);
		
		classNum++;
	}
}