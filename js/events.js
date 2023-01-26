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
		emailjs.send('service_8o5zc8r', 'template_9q4e9xg', templateParams)
    	.then(
          alert('Your message has been sent. Thank you! 😄')
        );
    }
    else {
        alert('Please type a message before clicking send! 😨');
    }
}