/**
 * Created by ryarborough on 5/1/17.
 */

//function responsible for parsing the template arguments
// 1) tId : 'ID of the template div'
// 2) row : json object containing values
function templateParser(tId,row) {
	var p = $('#'+tId).html();
	p = p.toString();
	var tempVars = getTemplateVars(p);
	for(a in tempVars) {
		var temp = tempVars[a];
		temp = temp.split('.');
		var val = row[temp[0]];
		if(val){
			for(k in temp)
			{
				if(k==0)
					continue;
				if(val[temp[k]])
					val = val[temp[k]];
			}
			p = p.replace('{'+tempVars[a]+'}',val);
		}
	}
	return p.toString();
}
// fetches the variable names from templates used in templateParser
function getTemplateVars(str) {
	var results = [], re = /{([^}]+)}/g, text;
	while(text = re.exec(str)) {
		results.push(text[1]);
	}
	return results;
}
// this function is perticularly made to display list of records. One can modify it according to needs
function getParsedHtml(mainTId,data,replaceSlug) {
	var rows = '';
	var flipflop = true;
	for(a in data) {
		if(flipflop) data[a].grey = 'white'; else data[a].grey = 'grey'; // for alternate colors in rows
		rows+=templateParser(mainTId+'Row',data[a]);
		flipflop = !flipflop;
	}
	var html = $('#'+mainTId).html();
	html = html.toString();
	html = html.replace(replaceSlug,rows);
	return html;
}

function showRecords() {
	// this variable may be loaded by ajax
	var Data = [ {name : 'Rupesh Patel' , details : { age : 25 , birthdate : '22 oct 1987' , others : {nickname : 'none'},}},
		{name : 'Rakesh Patel' , details : { age : 22 , birthdate : '14 Apr 1990',others : {nickname : 'rako'},},},
		{name : 'Nishith Patel' , details : { age : 23 , birthdate : '25 aug 1991',others : {nickname : 'nishu'},}},
		{name : 'Rajesh Patel' , details : { age : 30 , birthdate : '26 oct 1982',others : {nickname : 'raju'},}},
	];
	$('#container').html(getParsedHtml('users',Data,'__SLUG__'));
}
