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

function email() {
	if (document.body.querySelector('.message').value != '') {
        Email.send({
            SecureToken: "6d66f2a8-a8c6-4747-bb34-e77eb18b1ae3",
            To : 'jmblanck@millersville.edu',
            From : "blanckjm@gmail.com",
            Subject : document.querySelector('.name-first').value + ' ' + document.querySelector('.name-last').value,
            Body : document.querySelector('.message').value + ' ' + document.querySelector('.phone-number').value
        }).then(
          alert('Your message has been sent. Thank you!')
        );
    }
    else {
        alert('Please type a message before clicking send!');
    }
}

function dropdown1() {
    var dropdown = document.getElementById('dropdown1');
    var menu = document.getElementById('menu1')
    menuOpen1 = !menuOpen1;
    if (menuOpen1){
        dropdown.innerHTML = "-";
        gsap.to(menu, {height: "auto", opacity: "100%", duration: 1});
    }
    else {
        dropdown.innerHTML = "+";
        gsap.to(menu, {height: "0px", opacity: "0%", duration: 1});
    }
}

function dropdown2() {
    var dropdown = document.getElementById('dropdown2');
    var menu = document.getElementById('menu2');
    menuOpen2 = !menuOpen2;
    if (menuOpen2){
        dropdown.innerHTML = "-";
        gsap.to(menu, {height: "auto", opacity: "100%", duration: 1});
    }
    else {
        dropdown.innerHTML = "+";
        gsap.to(menu, {height: "0px", opacity: "0%", duration: 1});
    }
}