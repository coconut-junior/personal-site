let menuOpen = false;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var dragging = false;
var terminal = document.querySelector('.form');
var lang = 'en';

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
		To : 'jmblx99@outlook.com',
		From : "blanckjm@gmail.com",
		Subject : document.querySelector('.name-first').value + ' ' + document.querySelector('.name-last').value,
		Body : document.querySelector('.message').value
	}).then(
	  message => alert(message)
	);
}

document.addEventListener('scroll', function(e) {
	var scrolled = window.pageYOffset;
	scrolled = Math.round(window.innerHeight * (scrolled / document.body.scrollHeight)) + 106;
	document.querySelector(".scroll-indicator").style.top = scrolled;
});

document.addEventListener('mousemove', e => {
	e = e || window.event;
	e.preventDefault();
	pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
	pos4 = e.clientY;
	
	if (dragging) {
		if (terminal.offsetTop < (window.innerHeight - terminal.offsetHeight)) {
			terminal.style.position = "absolute";
			terminal.style.top = (terminal.offsetTop - pos2) + "px";
    		terminal.style.left = (terminal.offsetLeft - pos1) + "px";

			if (e.target.className == "fishtank") {
				gsap.to(document.getElementById('fish'), 
				{
					duration:1.5, ease: "elastic.out(1, 0.2)", x:  Math.sign(pos1)*15, y: Math.sign(pos2)*15
				});
				gsap.to(document.getElementById('shadow'), 
				{
					duration:1.5, ease: "elastic.out(1, 0.2)", x:  Math.sign(pos1)*20
				});
			}
		}
		else {
			terminal.style.top = window.innerHeight - terminal.offsetHeight - 10 + "px";
			dragging = false;
			terminal.style.cursor = "grab"
		}
	}
})

let drag = function(e) {
	e = e || window.event;
    e.preventDefault();
	
	if (e.target.className == "form" || "clock" || "fishtank") {
		pos3 = e.clientX;
		pos4 = e.clientY;
		dragging = true;
		terminal.style.zIndex = 1;
		terminal = e.target;
		terminal.style.zIndex = 2;
		terminal.style.border = "4px solid rgba(255,255,255,0.2)";
		terminal.style.cursor = "grabbing";
	}

}

let release = function(e) {
	e = e || window.event;
    e.preventDefault();
	dragging = false;
	terminal.style.border = "4px solid rgba(255,255,255,0)";
	terminal.style.cursor = "grab"
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