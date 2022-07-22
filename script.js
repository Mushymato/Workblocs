var order = ['0'];
var blocs = { '0': ['', ''] };
var focused = undefined;
var night = true;

function initBloc(key) {
	var bloc = document.getElementById(key);

	var blocTitle = bloc.getElementsByClassName('title')[0];
	blocTitle.addEventListener('input', saveTitle, false);
	blocTitle.addEventListener('focus', changeFocus, false);
	blocTitle.value = blocs[key][0];

	var blocTxt = bloc.getElementsByClassName('txt')[0];
	blocTxt.addEventListener('input', saveTxt, false);
	blocTxt.addEventListener('focus', changeFocus, false);
	blocTxt.value = blocs[key][1];

	var blocX = bloc.getElementsByClassName('closeBloc')[0];
	blocX.addEventListener('click', deleteBloc, false)
}

function newBloc() {
	var count = 0;
	while (order.includes(count.toString())) {
		count += 1;
	}

	var newId = count.toString();
	blocs[newId] = ['', ''];

	if (this.id == "right") {
		order.push(newId);
	} else {
		order.unshift(newId);
	}

	addBloc(newId, this.id);
	if (document.getElementsByClassName('focus').length == 0) {
		focused = document.getElementById(newId);
		focused.classList.add('focus')
	}
	chrome.storage.sync.set({ 'order': order, 'blocs': blocs, 'focus': focused.id });
	return false;
}
function addBloc(newId, direction = 'right') {
	if (document.getElementById(newId) == undefined) {
		var newTitle = document.createElement('input');
		newTitle.classList.add('title');
		newTitle.setAttribute('placeholder', 'Title');
		newTitle.setAttribute('spellcheck', 'false');

		var newTxt = document.createElement('textarea');
		newTxt.classList.add('txt');
		newTxt.setAttribute('placeholder', 'Write here');
		newTxt.setAttribute('spellcheck', 'false');

		var newX = document.createElement('a');
		newX.classList.add('closeBloc');
		newX.setAttribute('href', '#');
		newX.innerHTML = '&#10005;';

		var newDiv = document.createElement('div');
		newDiv.classList.add('bloc');
		newDiv.setAttribute('id', newId);
		newDiv.appendChild(newX);
		newDiv.appendChild(newTitle);
		newDiv.appendChild(newTxt);

		var blocWrapper = document.getElementById('blocWrapper');

		if (direction == "right") {
			blocWrapper.appendChild(newDiv);
		} else {
			blocWrapper.insertBefore(newDiv, blocWrapper.firstChild);
		}
	}
	initBloc(newId);
	return false;
};

function deleteBloc() {
	var blocWrapper = document.getElementById('blocWrapper');
	var blocList = blocWrapper.getElementsByClassName('bloc');
	var delBloc;
	for (i = 0; i < blocList.length; i++) {
		if (blocList[i].id == this.parentNode.id) {
			delBloc = blocList[i];
			break;
		};
	};

	delete blocs[delBloc.id];
	for (i = 0; i < order.length; i++) {
		if (order[i] == delBloc.id) {
			order.splice(i, 1);
		}
	}
	chrome.storage.sync.set({ 'blocs': blocs, 'order': order })

	blocWrapper.removeChild(delBloc);
	if (delBloc.className.match(/(?:^|\s)focus(?!\S)/g, '')) {
		try {
			focused = blocWrapper.getElementsByClassName('bloc')[0]
			focused.classList.add('focus');
			chrome.storage.sync.set({ 'focus': focused.id });
		} catch (err) {
			newBloc();
		}
	}
}

function saveTitle() {
	blocs[this.parentElement.id][0] = this.value;
	chrome.storage.sync.set({ 'blocs': blocs });
};

function saveTxt() {
	blocs[this.parentElement.id][1] = this.value;
	chrome.storage.sync.set({ 'blocs': blocs });
};

function changeFocus() {
	if (this.parentElement == focused) {
		return false;
	}
	var blocList = document.getElementsByClassName('bloc');

	for (i = 0; i < blocList.length; i++) {
		// if (blocList[i].className.match(/(?:^|\s)focus(?!\S)/g, '')) {
		// 	blocList[i].className = blocList[i].className.replace(/(?:^|\s)focus(?!\S)/g, '');
		// };
		if (blocList[i].classList.contains('focus')) {
			blocList[i].classList.remove('focus')
		}
	};

	this.parentElement.classList.add('focus')
	focused = this.parentElement;
	chrome.storage.sync.set({ 'focus': focused.id });
	return false;
};
function clearStorage() {
	chrome.storage.sync.clear();
}

function writeBlocs() {
	//put bloc data into a file and return the Blob
	var textToSave = "";
	for (i = 0; i < order.length; i++) {
		textToSave += "[";
		textToSave += blocs[order[i]][0].replace(/\n\r?/g, '\r\n');
		textToSave += "]\n";
		textToSave += blocs[order[i]][1].replace(/\n\r?/g, '\r\n');
		textToSave += "\n";
	}
	return new Blob([textToSave], { type: "text/plain" });
}

function downloadBlocs() {
	//credit to thiscouldbebetter.wordpress.com

	var textToSaveAsBlob = writeBlocs();
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	// alert(textToSaveAsURL);

	var fileName = "Workblocs-" + (new Date()).toISOString() + ".txt";

	var downloadLink = document.createElement("a");
	downloadLink.download = fileName;
	downloadLink.innerHTML = "Download File";
	downloadLink.href = textToSaveAsURL;
	downloadLink.onclick = (e) => { document.body.removeChild(e.target); };
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);

	downloadLink.click();
}

function saveToDrive() {
	/*var gdrive = document.getElementsByID("gdrive");
	gdrive.data-src=textToSaveAsURL;
	data-filename=*/
}
//clock
function startTime() {
	var today = new Date();
	var ye = today.getFullYear();
	var mo = today.getMonth() + 1;
	var da = today.getDate();
	mo = adjTime(mo);
	da = adjTime(da);
	document.getElementById('ymd').innerHTML = ye + "-" + mo + "-" + da;
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	h = adjTime(h)
	m = adjTime(m);
	s = adjTime(s);
	document.getElementById('hms').innerHTML = h + ":" + m + ":" + s;
	var t = setTimeout(startTime, 500);
}
function adjTime(i) {
	// add zero in front of numbers < 10
	if (i < 10) { i = "0" + i };
	return i;
}

//settings
function settings() {
	var sett = document.getElementById('settings');
	if (sett.style.display == "none") {
		sett.style.display = "block";
	} else {
		sett.style.display = "none";
	}
}
function nightly() { //night/day mode
	if (!night) {
		document.styleSheets[1].disabled = true;
		night = true;
	} else {
		document.styleSheets[1].disabled = false;
		night = false;
	}
	chrome.storage.sync.set({ 'night': night });
}

((window, document, undefined) => {
	//chrome.storage.sync.clear();

	window.onload = init;

	function init() {
		startTime();

		// Capture Ctrl+S
		var isCtrl = false;
		document.onkeyup = (e) => {
			isCtrl = false;
		};
		document.onkeydown = (e) => {
			console.log(e.key)
			if (e.key == "Control") isCtrl = true;
			if (e.key == "s" && isCtrl == true) {
				downloadBlocs();
				return false;
			}
		};

		document.getElementById('left').addEventListener('click', newBloc, false);
		document.getElementById('right').addEventListener('click', newBloc, false);
		document.getElementById('clock').addEventListener('click', nightly, false);
		//document.getElementById('clock').addEventListener('contextmenu', settings, false);
		//document.getElementById('closeSet').addEventListener('click', settings, false);

		chrome.storage.sync.get(['order', 'blocs', 'focus', 'night'], (item) => {
			//get night sheet
			if (item['night'] != undefined) {
				night = !item['night'];
			}
			nightly();

			//load blocs
			if (item['blocs'] != undefined) { blocs = item['blocs']; }
			if (item['order'] != undefined) { order = item['order']; }
			for (i = 0; i < order.length; i++) {
				addBloc(order[i]);
				initBloc(order[i]);
			}
			if (item['focus'] != undefined) {
				focused = document.getElementById(item['focus']);
			} else {
				focused = document.getElementsByClassName('bloc')[0];
			}
			focused.classList.add('focus');

			//overide tab
			var textareas = document.getElementsByTagName('textarea');
			var count = textareas.length;
			for (var i = 0; i < count; i++) {
				textareas[i].onkeydown = (e) => {
					if (e.keyCode == 9 || e.which == 9) {
						e.preventDefault();
						var s = this.selectionStart;
						this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
						this.selectionEnd = s + 1;
					}
				}
			}

			document.getElementById('blocWrapper').style.opacity = 1;

			return false;
		});
	};

})(window, document, undefined);
