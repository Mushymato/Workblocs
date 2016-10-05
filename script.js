var blocs = {'default':['','']};
var blocsCount = 3;
var focused;

function initBloc(key){
	var bloc = document.getElementById(key);
		
	var blocTitle = bloc.getElementsByClassName('title')[0];
		blocTitle.addEventListener('input', saveTitle, false);
		blocTitle.addEventListener('focus', changeFocus, false);
		blocTitle.value = blocs[key][0];

	var blocTxt = bloc.getElementsByClassName('txt')[0];
		blocTxt.addEventListener('input', saveTxt, false);
		blocTxt.addEventListener('focus', changeFocus, false);
		blocTxt.value = blocs[key][1];
}
 
function newBloc(){
	blocsCount += 1;
	chrome.storage.local.set({'blocsCount': blocsCount});	
	var newId = parseInt(blocsCount);
	blocs[newId] = ['', ''];
	chrome.storage.local.set({'blocs': blocs});

	addBloc(newId, this.id);
	return false;
}
/* <div class="bloc" id="default"><input  placeholder="Title" spellcheck="false" class="title"></input><textarea placeholder="Write here." spellcheck="false" class="txt"></textarea></div> */
function addBloc(newId, direction = 'right'){	
	var	newTitle = document.createElement('input');
		newTitle.className += "title";
		newTitle.setAttribute('placeholder', 'Title');
		newTitle.setAttribute('spellcheck', 'false');
		
	var	newTxt = document.createElement('textarea');
		newTxt.className += "txt";
		newTxt.setAttribute('placeholder', 'Write here');
		newTxt.setAttribute('spellcheck', 'false');

	var newDiv = document.createElement('div');
		newDiv.className += "bloc";
		newDiv.setAttribute('id', newId);
		newDiv.appendChild(newTitle);
		newDiv.appendChild(newTxt);
	
	var blocWrapper = document.getElementById('blocWrapper');
	blocWrapper.appendChild(newDiv);
	
	initBloc(newId);
	
	return false;
};

function deleteBloc(){
	var blocWrapper = document.getElementById('blocWrapper');
	var delBloc = blocWrapper.childNodes[0];
	delete blocs[delBloc.id];
	chrome.storage.local.set({'blocs': blocs});
	if (delBloc.className.match( /(?:^|\s)focus(?!\S)/g , '' )){
		focused = document.getElementsByClassName('bloc')[0]
		chrome.storage.local.set({'focus':focused.id});
		
	};
	blocWrapper.removeChild(delBloc);
}

function saveTitle(){
	blocs[this.parentElement.id][0] = this.value;
	chrome.storage.local.set({'blocs': blocs});
};

function saveTxt(){
	blocs[this.parentElement.id][1] = this.value;
	chrome.storage.local.set({'blocs': blocs});
};

function changeFocus(){
	if (this == focused){
		return false;
	}
	var blocList = document.getElementsByClassName('bloc');
	
	for (i=0; i < blocList.length; i++){
		if(blocList[i].className.match( /(?:^|\s)focus(?!\S)/g , '' )){
			blocList[i].className = blocList[i].className.replace( /(?:^|\s)focus(?!\S)/g , '' );
		};
	};
	
	this.parentElement.className += ' focus';
	focused = this.parentElement;
	chrome.storage.local.set({'focus':focused.id});
	return false;
};
function settings(){
	chrome.storage.local.clear();	
}

(function(window, document, undefined){

	window.onload = init;
	
	function init(){
		document.getElementById('del').addEventListener('click', deleteBloc, false);
		document.getElementById('add').addEventListener('click', newBloc, false);
		document.getElementById('settings').addEventListener('click', settings, false);
		
		chrome.storage.local.get(['blocs', 'blocsCount', 'focus'], function(item){
			if(item['blocs'] != undefined) {blocs = item['blocs'];};
			
			for (var key in blocs) {
			  if (blocs.hasOwnProperty(key)) {
				addBloc(key);
				initBloc(key);
			  }
			}

			if(item['blocsCount'] != undefined) {blocsCount = item['blocsCount'];}
			if(item['focus'] != undefined){
				focused = document.getElementById(item['focus']);
			}else{
				focused = document.getElementsByClassName('bloc')[0];
			}
			focused.className += ' focus';
			return false;
		});
	};

})(window, document, undefined);