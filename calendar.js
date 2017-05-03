/**
 * Created by ryarborough on 4/30/17.
 */

var CALENDAR = function () {
	var wrap, label, months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];

	function init(newWrap) {
			var btnFnNext,
				btnFnPrev,
				previousConstructor = new PreviousDispatcher(),
				nextConstructor = new NextDispatcher();

			wrap =	document.querySelector("#cal") || newWrap;
			label = wrap.querySelector("#label");

			//assign event handler on wrap object
			btnFnPrev = wrap.querySelector('span#prev');
			btnFnNext = wrap.querySelector('span#next');

			//register event listeners
			previousConstructor.addEventListener('previous', function (event) {
				console.log(event.method);
				return event.method;
			});
			nextConstructor.addEventListener('next', function (event) {
				console.log(event.method);
				return event.method;
			});

			//register event handlers
			btnFnPrev.onclick = function () {
				console.log('onclick event for previous');
				previousConstructor.previous();
			};

			btnFnNext.onclick = function () {
				console.log('onclick event for next');
				nextConstructor.next();
				updateFeatured();
			};

			label.onclick = function () {
				switchMonth(null, new Date().getMonth(), new Date().getFullYear());
			};
		}

	function PreviousDispatcher() {
		this.previous = function () {
			this.dispatchEvent({ type: 'previous', method: switchMonth(false)});
		};
	}

	function NextDispatcher() {
		this.next = function () {
			this.dispatchEvent({ type: 'next', method: switchMonth(true)});
		};
	}

	function updateFeatured(currDayName, currDayInteger){
		var element = document.querySelector('#featured_day');
		var dayName = element.querySelector('.featured_header');
		var dayInteger = element.querySelector('.featured_date');
		this.currDayName = new Date().getDay();
		this.currDayInteger = new Date().getDay();
		dayName.innerHTML = this.currDayName;
		dayInteger.innerHTML = this.currDayInteger;

	}

	function switchMonth(next, month, year) {
			var curr = label.innerHTML.trim().split(" "), calendar, tempYear = parseInt(curr[1], 10);

			month = month || ((next) ? ((curr[0] === "December") ? 0 : months.indexOf(curr[0]) + 1) : ( (curr[0] === "January") ? 11 : months.indexOf(curr[0]) - 1) );
			year  = year  || ((next && month === 0) ? tempYear + 1 : (!next && month === 11) ? tempYear -1 : tempYear);
				
			console.profile("createCal");
			calendar = createCal(year, month);
			console.profileEnd("createCal");

			$("#cal-frame", wrap)
				.find(".curr")
					.removeClass("curr")
					.addClass("temp")
				.end()
				.prepend(calendar.calendar())
				.find(".temp")
					.fadeOut("slow", function () { $(this).remove(); });
			label.innerText = calendar.label;
		}
		
	function createCal(year, month) {
		var day = 1, i, j, haveDays = true, 
				startDay = new Date(year, month, day).getDay(),
				daysInMonth = [31, (((year%4===0)&&(year%100!==0))||(year%400===0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
				calendar = [];
		if (createCal.cache[year]) {
			if (createCal.cache[year][month]) {
				return createCal.cache[year][month];
			}
		} else {
			createCal.cache[year] = {};
		}
		i = 0;
		while(haveDays) {
			calendar[i] = [];
			for (j = 0; j < 7; j++) {
				if (i === 0) {
					if (j === startDay) {
						calendar[i][j] = day++;
						startDay++;
					}
				} else if ( day <= daysInMonth[month]) {
					calendar[i][j] = day++;
				} else {
					calendar[i][j] = "";
					haveDays = false;
				}
				if (day > daysInMonth[month]) {
					haveDays = false;
				}
			}
			i++;
		}	
		
		if (calendar[5]) {
			for (i = 0; i < calendar[5].length; i++) {
				if (calendar[5][i] !== "") {
					calendar[4][i] = "<span>" + calendar[4][i] + "</span><span>" + calendar[5][i] + "</span>";
				}
			}
			calendar = calendar.slice(0, 5);
		}
		
		for (i = 0; i < calendar.length; i++) {
			calendar[i] = "<tr><td>" + calendar[i].join("</td><td>") + "</td></tr>";
		}

		calendar = $("<table>" + calendar.join("") + "</table>").addClass("curr");

		$("td:empty", calendar).addClass("nil");
		if (month === new Date().getMonth()) {
			$('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString();}).addClass("today");
		}
		
		createCal.cache[year][month] = { calendar : function () { return calendar.clone(); }, label : months[month] + " " + year };

		return createCal.cache[year][month];
	}

	//assign calendar values to cache object
	createCal.cache = {};

	//assign Event Dispatchers to each prototype
	Object.assign(PreviousDispatcher.prototype, EventDispatcher.prototype);
	Object.assign(NextDispatcher.prototype, EventDispatcher.prototype);

	//return methods and values to global scope
	return {
		init : init,
		switchMonth : switchMonth,
		createCal : createCal,
		updateFeatured: updateFeatured,
		PreviousDispatcher: PreviousDispatcher,
		NextDispatcher: NextDispatcher
	};

};


