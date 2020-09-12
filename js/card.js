let camera, scene, renderer, cube;
var direction = 0;
var cursor_x = 0;
var cusor_y = 0;
var tex_index = 0;
var tex_array = [
	'https://i.imgur.com/476P4Wv.png',
	'https://i.imgur.com/FH0QKkf.png',
	'https://i.imgur.com/iOxRcqp.png',
	'https://i.imgur.com/mVgaYhR.png',
	'https://i.imgur.com/GZlYrXH.png'
];
var hue_array = [
	"#CDABA1",
	"#B5C589",
	"#DB6499",
	"#77C6AF",
	"#7B77C6"
];
var shadow_array = [
	"",
	"",
	"",
	"",
	""
]
const texture = new THREE.TextureLoader();
var menuOpen1 = false;
var menuOpen2 = false;
var menuOpen3 = false;

var isMobile = false;

window.addEventListener('touchstart', function onFirstTouch() {
	isMobile = true;
}, false);

function randTex() {
	tex_index = Math.floor(Math.random() * ((tex_array.length - 1) - 0) + 0);
}

function nextTex() {
	if (tex_index < tex_array.length - 1) {
		++tex_index
	}
	else {
		tex_index = 0;
	}
}

cursor_x = window.innerWidth / 2;
cursor_y = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
	cursor_x = e.pageX - 256;
	cursor_y = e.pageY - 256;

	var c = document.getElementById('c');
	var sphere = document.getElementById('sphere');
	var hero = document.getElementById('hero');
	var j = document.getElementById('j');
	var b = document.getElementById('b');
	var squiggle = document.getElementById('squiggle');

	if (!isMobile) {
		gsap.to(sphere, {left: -cursor_x / 4 + 256, top: cursor_y / 8, duration: 6});
		gsap.to(j, {left: (cursor_x / 8) - 256, top: -cursor_y / 10, duration: 6});
		gsap.to(b, {left: cursor_x / 8 + 512, top: cursor_y / 4, duration: 6});
		gsap.to(squiggle, {right: cursor_x /  + 512, bottom: cursor_y / 8, duration: 6});
	}

	if (isMobile) {
		gsap.to(j, {left: (window.innerWidth / 10) - 256, top: window.innerHeight / 10, duration: 8});
		gsap.to(b, {left: window.innerWidth / 10, top: window.innerHeight / 10, duration: 8});
	}

	if (e.target.className == "colorpicker")
	{
		document.getElementsByClassName("banner branding")[0].style.backgroundImage = "url('images/can_pink.jpg')";
	}
	if (e.target.className == "banner branding")
	{
		document.getElementsByClassName("banner branding")[0].style.backgroundImage = "url('images/can_blue.jpg')";
	}
})

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Init BoxGeometry object (rectangular cuboid)
const geometry = new THREE.BoxGeometry(3.5, 2, 0.05);

function init() {
	// Init scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf8f8f8);
	var s = document.getElementById('shuffle');
	s.style = "color: " + hue_array[tex_index] + ";";
	document.body.style.backgroundColor = scene.background.Color;

	// Init camera (PerspectiveCamera)
	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000000
	);

	material = new THREE.MeshBasicMaterial({ map: texture.load(tex_array[tex_index]) });

	// Create mesh with geo and material
	cube = new THREE.Mesh(geometry, material);
	// Add to scenethr
	scene.add(cube);

	// Position camera
	camera.position.z = 5;
}

// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);
	// Rotate cube (Change values to change speed)
	cube.rotation.y = ((cursor_x - (window.innerWidth / 4)) * 0.001);
	cube.rotation.x = ((cursor_y - (window.innerHeight / 4) - window.innerHeight) * 0.001);
	renderer.render(scene, camera);
}

function onWindowResize() {
	// Camera frustum aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	// After making changes to aspect
	camera.updateProjectionMatrix();
	// Reset size
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.shuffle = function shuffle() {
	nextTex()
	init();
}

init();
window.addEventListener('resize', onWindowResize, false);

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

animate();