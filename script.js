var order = ["1"];
var blocs = {"1":['','']};
var blocsCount = 1;
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
	
	var blocX = bloc.getElementsByClassName('closeBloc')[0];
		blocX.addEventListener('click', deleteBloc, false)
}
 
function newBloc(){
	blocsCount += 1;
	chrome.storage.local.set({'blocsCount': blocsCount});	
	var newId = parseInt(blocsCount);
	blocs[newId] = ['', ''];
	chrome.storage.local.set({'blocs': blocs});

	addBloc(newId, this.id == "right");
	if (document.getElementsByClassName('focus').length == 0){
		focused = document.getElementById(newId);
		focused.className += ' focus';
	}
	
	return false;
}
function addBloc(newId, isRight = true){
	if (document.getElementById(newId) == undefined){
		var	newTitle = document.createElement('input');
			newTitle.className += 'title';
			newTitle.setAttribute('placeholder', 'Title');
			newTitle.setAttribute('spellcheck', 'false');
			
		var	newTxt = document.createElement('textarea');
			newTxt.className += 'txt';
			newTxt.setAttribute('placeholder', 'Write here');
			newTxt.setAttribute('spellcheck', 'false');
		
		var newX = document.createElement('a');
			newX.className += 'closeBloc';
			newX.setAttribute('href', '#');
			newX.innerHTML = '&#10005;';

		var newDiv = document.createElement('div');
			newDiv.className += 'bloc';
			newDiv.setAttribute('id', newId);
			newDiv.appendChild(newX);
			newDiv.appendChild(newTitle);
			newDiv.appendChild(newTxt);
		
		var blocWrapper = document.getElementById('blocWrapper');
		
		if (isRight){
			order.push(newId);
			blocWrapper.appendChild(newDiv);
		} else {
			order.unshift(newId);
			blocWrapper.insertBefore(newDiv, blocWrapper.firstChild);
		}
		chrome.storage.local.set({'order': order});
	}
	initBloc(newId);	
	return false;
};

function deleteBloc(){
	var blocWrapper = document.getElementById('blocWrapper');
	var delBloc = blocWrapper.getElementsByClassName('bloc')[0];
	delete blocs[delBloc.id];
	for(i=0; i<order.length; i++){
		if (order[i] == delBloc.id){
			order.splice(i, 1);
		}
	}	
	chrome.storage.local.set({'blocs':blocs, 'order':order})
	
	if (delBloc.className.match( /(?:^|\s)focus(?!\S)/g , '' )){
		blocWrapper.removeChild(delBloc);
		try{
			focused = blocWrapper.getElementsByClassName('bloc')[0]
			focused.className += ' focus'
			chrome.storage.local.set({'focus':focused.id});
		} catch(err){
			focused = undefined;
		}
	} else{
		blocWrapper.removeChild(delBloc);
	};
	
	
	setTimeout(function(){
		//document.getElementById('blocWrapper').style.opacity = 1;
	}, 100);
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
	if (this.parentElement == focused){
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
	//chrome.storage.local.clear();	

	window.onload = init;
	
	function init(){
		document.getElementById('left').addEventListener('click', newBloc, false);
		document.getElementById('right').addEventListener('click', newBloc, false);
		//document.getElementById('settings').addEventListener('click', settings, false);
				
		chrome.storage.local.get(['order','blocs', 'blocsCount', 'focus'], function(item){
			if(item['blocs'] != undefined) {blocs = item['blocs'];}
			if(item['order'] != undefined) {order = item['order'];}
			for (i=0; i < order.length; i ++) {
				addBloc(order[i]);
				initBloc(order[i]);
			}
			if(item['blocsCount'] != undefined) {blocsCount = item['blocsCount'];}
			if(item['focus'] != undefined){
				focused = document.getElementById(item['focus']);
			}else{
				focused = document.getElementsByClassName('bloc')[0];
			}
			focused.className += ' focus';
			
			//overide tab
			var textareas = document.getElementsByTagName('textarea');
			var count = textareas.length;
			for(var i=0;i<count;i++){
				textareas[i].onkeydown = function(e){
					if(e.keyCode==9 || e.which==9){
						e.preventDefault();
						var s = this.selectionStart;
						this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
						this.selectionEnd = s+1; 
					}
				}
			}
			
			document.getElementById('blocWrapper').style.opacity = 1;

			return false;
		});
	};

})(window, document, undefined);