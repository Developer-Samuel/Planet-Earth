// Create a new scene.
const scene = new THREE.Scene();

// Create a perspective camera with specified parameters (field of view, aspect ratio, near and far clipping planes).
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a WebGL renderer and set its size to match the window dimensions, then append it to the document body.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry with specified radius, width segments, and height segments.
const geometry = new THREE.SphereGeometry(6, 32, 32); 
const textureLoader = new THREE.TextureLoader();

// Load a texture map for the material.
const material = new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg') });

// Create a mesh with the geometry and material, then add it to the scene.
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Set the initial position of the camera along the z-axis.
camera.position.z = 15;
renderer.setClearColor(0x111);

// Initialize variables for mouse dragging functionality.
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

// Function to handle mouse movement.
function onMouseMove(event) {
  // Calculate the change in mouse position.
  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y
  };

  // Check if the cursor is hovering over the sphere.
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(earth);
  
  // If mouse dragging is active, rotate the earth based on mouse movement.
  if (isDragging) {
    const deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        toRadians(deltaMove.y * 0.5),
        toRadians(deltaMove.x * 0.5),
        0,
        'XYZ'
      ));

    earth.quaternion.multiplyQuaternions(deltaRotationQuaternion, earth.quaternion);
  }

  // Update previous mouse position.
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };

  // Change cursor style based on whether it's hovering over the sphere.
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'auto';
  }
}

// Function to handle mouse button down event.
function onMouseDown(event) {
  // Set dragging flag to true and record current mouse position.
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

// Function to handle mouse button up event.
function onMouseUp(event) {
  // Set dragging flag to false.
  isDragging = false;
}

// Function to convert degrees to radians.
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Function to animate the scene.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start the animation loop.
animate();

// Add event listeners for mouse movement, mouse button down, and mouse button up.
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);



// Function to handle window resize.
function onWindowResize() {
  // Update camera aspect ratio and renderer size.
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize.
window.addEventListener('resize', onWindowResize);

// Call onWindowResize once initially to set up the correct sizes.
onWindowResize();
