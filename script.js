function saveTxt(){
 	var userInput = document.getElementById('textInput').value;
	chrome.storage.sync.set({'textarea': userInput});
};

(function(window, document, undefined){
	//chrome.storage.sync.clear();

	window.onload = init;

	function init(){
		var txtInput = document.getElementById('textInput');
		txtInput.addEventListener('input', saveTxt);
		chrome.storage.sync.get('textarea', function(txt){
			if(txt['textarea'] == undefined){
				txtInput.value = "";
			}else{
				txtInput.value = txt['textarea']
			}
		});
	};

})(window, document, undefined);