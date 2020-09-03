let camera, scene, renderer, cube;
var direction = 0;
var cursor_x = 0;
var cusor_y = 0;
var tex_index = 0;
var tex_array = [
	'https://i.imgur.com/FH0QKkf.png',
	'https://i.imgur.com/iOxRcqp.png',
	'https://i.imgur.com/mVgaYhR.png',
	'https://i.imgur.com/GZlYrXH.png'
];
var hue_array = [
	0xE5F6AD,
	0xFFC8FB,
	0xC0E6DB,
	0xE0DEFF
];
const texture = new THREE.TextureLoader();

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
	cursor_x = e.pageX;
	cursor_y = e.pageY;
})

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Init BoxGeometry object (rectangular cuboid)
const geometry = new THREE.BoxGeometry(3.5, 2, 0.05);
randTex();

function init() {
	// Init scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( hue_array[tex_index] );
	document.body.style.backgroundColor = scene.background.Color;

	// Init camera (PerspectiveCamera)
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
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
	cube.rotation.x = ((cursor_x - (window.innerWidth/2)) * 0.002);
	cube.rotation.y = -((cursor_y - (window.innerHeight/2)) * 0.002);
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

window.addEventListener('resize', onWindowResize, false);

init();

window.onclick = e => {
	if (e.target.className == "button icon-shuffle")
    {
    	setTimeout(nextTex(), 100);
		init();
    }
}

animate();