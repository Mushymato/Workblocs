var blocs;
var blocsCount;
var focused;

function saveTxt(){
	blocs[this.id] = this.value;
	chrome.storage.sync.set({'blocs': blocs});
};

function changeFocus(){
	focused.className = focused.className.replace( /(?:^|\s)focus(?!\S)/g , '' );
	this.className += " focus";
	focused = this;
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
				blocs = {'1':'', '2':'', '3':''};
			}
			if(item['blocsCount'] != undefined) {
				blocsCount = item['blocsCount'];
			}else{
				blocsCount = 1;
			}
			if(item['focus'] != undefined){
				focused = document.getElementById(item['focus']);
			}else{
				focused = document.getElementById('1');
			}
			for (var key in blocs) {
			  if (blocs.hasOwnProperty(key)) {
				var bloc = document.getElementById(key);
				bloc.addEventListener('input', saveTxt);
				bloc.addEventListener('focus', changeFocus);
				bloc.value = blocs[key];
			  }
			};
		});
	};

})(window, document, undefined);