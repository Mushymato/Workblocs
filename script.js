var blocs;
var blocsCount;
var focused;

function saveTitle(){
	blocs[this.parentElement.id][0] = this.value;
	chrome.storage.sync.set({'blocs': blocs});
};

function saveTxt(){
	blocs[this.parentElement.id][1] = this.value;
	chrome.storage.sync.set({'blocs': blocs});
};

function changeFocus(){
	focused.className = focused.className.replace( /(?:^|\s)focus(?!\S)/g , '' );
	this.parentElement.className += " focus";
	focused = this.parentElement;
	chrome.storage.sync.set({'focus':focused.id})
}

(function(window, document, undefined){
	//chrome.storage.sync.clear();

	window.onload = init;
	
	function init(){
		focused = document.getElementsByClassName('focus')[0];
		chrome.storage.sync.get(['blocs', 'blocsCount', 'focus'], function(item){
			if (chrome.runtime.lastError) {
				console.log(chrome.runtime.lastError.message);
			}

			if(item['blocs'] != undefined) {
				blocs = item['blocs'];
			}else{
				blocs = {'1':['', ''], '2':['', ''], '3':['', '']};
			}
			if(item['blocsCount'] != undefined) {
				blocsCount = item['blocsCount'];
			}else{
				blocsCount = 3;
			}
			if(item['focus'] != undefined){
				focused = document.getElementById(item['focus']);
			}else{
				focused = document.getElementById('1');
			}
			focused.className += " focus";
			for (var key in blocs) {
			  if (blocs.hasOwnProperty(key)) {
				var bloc = document.getElementById(key);
				var blocTxt = bloc.getElementsByClassName("txt")[0];
					blocTxt.addEventListener('input', saveTitle);
					blocTxt.addEventListener('focus', changeFocus);
					blocTxt.value = blocs[key][1];
				var blocTitle = bloc.getElementsByClassName("title")[0];
					blocTitle.addEventListener('input', saveTitle);
					blocTitle.addEventListener('focus', changeFocus);
					blocTitle.value = blocs[key][0];
				bloc.style.display = "block";
			  }
			};
		});
	};

})(window, document, undefined);