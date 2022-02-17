let menuOpen = false;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var lang = 'en';

var menuOpen1 = false;
var menuOpen2 = false;
var menuOpen3 = false;

history.scrollRestoration = 'manual'; /*reset scroll position on reload*/



function email() {
	if (document.body.querySelector('.message').value != '') {
		var templateParams = {
		    name: document.querySelector('.name-first').value + ' ' + document.querySelector('.name-last').value,
		    message: document.querySelector('.message').value + ' ' + document.querySelector('.phone-number').value
		};
		emailjs.send('service_wraq17q', 'template_37qdzrg', templateParams)
    	.then(
          alert('Your message has been sent. Thank you! 😄')
        );
    }
    else {
        alert('Please type a message before clicking send! 😨');
    }
}

function dropdown1() {
    var dropdown = document.getElementById('dropdown1');
    var menu = document.getElementById('menu1')
    menuOpen1 = !menuOpen1;
    if (menuOpen1){
        dropdown.innerHTML = "-";
        gsap.to(menu, {height: "auto", opacity: "100%", duration: 0.5});
    }
    else {
        dropdown.innerHTML = "+";
        gsap.to(menu, {height: "0px", opacity: "0%", duration: 0.5});
    }
}

function dropdown2() {
    var dropdown = document.getElementById('dropdown2');
    var menu = document.getElementById('menu2');
    menuOpen2 = !menuOpen2;
    if (menuOpen2){
        dropdown.innerHTML = "-";
        gsap.to(menu, {height: "auto", opacity: "100%", duration: 0.5});
    }
    else {
        dropdown.innerHTML = "+";
        gsap.to(menu, {height: "0px", opacity: "0%", duration: 0.5});
    }
}