
// this is the code which will be injected into a given page...

(function() {

	// just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'Injected!';
	document.body.appendChild(div);

	alert('inserted self... giggity');

	setValue("i.0.mix", 0.5) //setzen des wertes
    updateByKey("i.0.mix") //gui aktualisieren  

})();