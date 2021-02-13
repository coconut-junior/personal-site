let menuOpen = false;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var dragging = false;
var terminal = document.querySelector('.form');
var lang = 'en';

var menuOpen1 = false;
var menuOpen2 = false;
var menuOpen3 = false;

history.scrollRestoration = 'manual'; /*reset scroll position on reload*/

/*language toggle*/
function toggleLang() {
	if (lang=='en') {
		var x = document.getElementsByClassName("en");
			var i;
			for (i = 0; i < x.length; i++) {
				x[i].style.display="none";
			}	
		var x = document.getElementsByClassName("ja");
			var i;
			for (i = 0; i < x.length; i++) {
				x[i].style.display="block";
			}
		lang = 'ja';
	}
	else {
		var x = document.getElementsByClassName("ja");
			var i;
			for (i = 0; i < x.length; i++) {
				x[i].style.display="none";
			}	
		var x = document.getElementsByClassName("en");
			var i;
			for (i = 0; i < x.length; i++) {
				x[i].style.display="block";
			}	
		lang  = 'en';
	}
}

window.onbeforeunload = function () {
	window.scrollTop(0);
	window.scrollTo(0, 0);
}

function email() {
	Email.send({
		SecureToken: "6d66f2a8-a8c6-4747-bb34-e77eb18b1ae3",
		To : 'jmblanck@millersville.edu',
		From : "blanckjm@gmail.com",
		Subject : document.querySelector('.name-first').value + ' ' + document.querySelector('.name-last').value,
		Body : document.querySelector('.message').value
	}).then(
	  message => alert(message)
	);
}

window.onclick = e => {
	if(e.target.id == "dropdown1"){
        var menu = document.getElementById('menu1');
        menuOpen1 = !menuOpen1;
        if (menuOpen1){
            e.target.innerHTML = "-";
            gsap.to(menu, {height: "auto", opacity: "100%", duration: 1});
        }
        else {
            e.target.innerHTML = "+";
            gsap.to(menu, {height: "0px", opacity: "0%", duration: 1});
        }
    }

    if(e.target.id == "dropdown2"){
        var menu = document.getElementById('menu2');
        menuOpen2 = !menuOpen2;
        if (menuOpen2){
            e.target.innerHTML = "-";
            gsap.to(menu, {height: "auto", opacity: "100%", duration: 1});
        }
        else {
            e.target.innerHTML = "+";
            gsap.to(menu, {height: "0px", opacity: "0%", duration: 1});
        }
    }

    if(e.target.id == "dropdown3"){
        var menu = document.getElementById('menu3');
        menuOpen3 = !menuOpen3;
        if (menuOpen3){
            e.target.innerHTML = "-";
            gsap.to(menu, {height: "auto", opacity: "100%", duration: 1});
        }
        else {
            e.target.innerHTML = "+";
            gsap.to(menu, {height: "0px", opacity: "0%", duration: 1});
        }
    }
}

let openNav = function() {
	let homeButton = document.querySelector(".hamburger");
	let menu = document.querySelector(".links");
	var bars = document.getElementsByClassName("bar");

	if (menuOpen == false) {
		for(var i=0; i<bars.length; i++) {
		    bars[i].style.marginTop = "5%";
		    bars[i].style.marginBottom = "5%";
		}
		menuOpen = true;
		
		try {
			menu.style.top = "160px";
			menu.style.opacity = "1";
		}
		catch {
			console.log('menu not implemented!');
		}
		
	}
	else {
		for(var i=0; i<bars.length; i++) {
		    bars[i].style.marginTop = "2%";
		    bars[i].style.marginBottom = "2%";
		}
		menuOpen = false;
		try {
		menu.style.top = "0px";
		menu.style.opacity = "0";
		}
		catch {
			console.log('menu not implemented!');
		}
	}
}