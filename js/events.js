let menuOpen = false;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var dragging = false;
var terminal = document.querySelector('.form');



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
	pos3 = e.clientX;
    pos4 = e.clientY;
	dragging = true;
	terminal.style.cursor = "grabbing"
}

let release = function() {
	dragging = false;
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