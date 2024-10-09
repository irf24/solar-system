import * as THREE from "three";
import { OrbitControls, ThreeMFLoader } from "three/examples/jsm/Addons.js";

var scene, camera, sun, canvas, renderer, controls;

//get the canvas object and pass it to the renderer
canvas = document.getElementById("box");

//load textures
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

cubeTextureLoader.setPath("./cubeMap/");

const sunTexture = textureLoader.load("./textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("./textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("./textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("./textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("./textures/2k_mars.jpg");
const jupitarTexture = textureLoader.load("./textures/2k_jupiter.jpg");
const saturnTexture = textureLoader.load("./textures/2k_saturn.jpg");
const uranusTexture = textureLoader.load("./textures/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("./textures/2k_neptune.jpg");
const moonTexture = textureLoader.load("./textures/2k_moon.jpg");
const ringTexture = textureLoader.load("./textures/2k_saturn_ring_alpha.png");
// ringTexture.wrapS = THREE.ClampToEdgeWrapping;
// ringTexture.wrapT = THREE.RepeatWrapping;
// ringTexture.repeat.set(0, 10);

const backgroundCubeMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

const ring = new THREE.RingGeometry(0.6, 0.7, 32);
const ringMaterial1 = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  side: THREE.DoubleSide,
});
const ringMaterial2 = new THREE.MeshStandardMaterial({
  color: 0x909090,
  side: THREE.DoubleSide,
});
const ringMaterial3 = new THREE.MeshStandardMaterial({
  color: 0xe3e3e3,
  side: THREE.DoubleSide,
});
const ringMaterial4 = new THREE.MeshStandardMaterial({
  color: 0x484848,
  side: THREE.DoubleSide,
});
const ringMesh1 = new THREE.Mesh(ring, ringMaterial1);
const ringMesh2 = new THREE.Mesh(ring, ringMaterial2);
const ringMesh3 = new THREE.Mesh(ring, ringMaterial3);
const ringMesh4 = new THREE.Mesh(ring, ringMaterial4);
const ringGroup = new THREE.Group();
ringGroup.add(ringMesh1, ringMesh2, ringMesh3, ringMesh4);
ringGroup.rotation.x = 1;
ringMesh1.scale.setScalar(2);
ringMesh2.scale.setScalar(2.5);
ringMesh3.scale.setScalar(3);
ringMesh4.scale.setScalar(3.5);
const planets = [
  {
    name: "Mercury",
    radius: 2439.7,
    distanceFromSun: 57900000,
    orbitalSpeed: 47.87,
    material: new THREE.MeshStandardMaterial({
      map: mercuryTexture,
    }),
    mesh: null,
    moons: [],
  },
  {
    name: "Venus",
    radius: 6051.8,
    distanceFromSun: 108200000,
    orbitalSpeed: 35.02,
    material: new THREE.MeshStandardMaterial({
      map: venusTexture,
    }),
    mesh: null,
    moons: [],
  },
  {
    name: "Earth",
    radius: 6371,
    distanceFromSun: 149600000,
    orbitalSpeed: 29.78,
    material: new THREE.MeshStandardMaterial({
      map: earthTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Moon",
        radius: 1737.4,
        distanceFromPlanet: 384400,
        orbitalSpeed: 1.022, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
  {
    name: "Mars",
    radius: 3389.5,
    distanceFromSun: 227900000,
    orbitalSpeed: 24.07,
    material: new THREE.MeshStandardMaterial({
      map: marsTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Phobos",
        radius: 11.1,
        distanceFromPlanet: 9378,
        color: "#a9a9a9", // Dark Gray
        orbitalSpeed: 2.138, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Deimos",
        radius: 6.2,
        distanceFromPlanet: 23460,
        color: "#c0c0c0", // Silver
        orbitalSpeed: 1.351, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 69911,
    distanceFromSun: 778500000,
    orbitalSpeed: 13.07,
    material: new THREE.MeshStandardMaterial({
      map: jupitarTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Ganymede",
        radius: 2634.1,
        distanceFromPlanet: 1070400,
        color: "#6c5b7b", // Deep Purple
        orbitalSpeed: 10.88, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Callisto",
        radius: 2410.3,
        distanceFromPlanet: 1882700,
        color: "#8a795d", // Brownish Gray
        orbitalSpeed: 8.2, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Io",
        radius: 1821.6,
        distanceFromPlanet: 421700,
        color: "#ffd700", // Gold
        orbitalSpeed: 17.34, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Europa",
        radius: 1560.8,
        distanceFromPlanet: 670900,
        color: "#ffffff", // White
        orbitalSpeed: 13.74, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
  {
    name: "Saturn",
    radius: 58232,
    distanceFromSun: 1429000000,
    orbitalSpeed: 9.69,
    material: new THREE.MeshStandardMaterial({
      map: saturnTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Titan",
        radius: 2574.7,
        distanceFromPlanet: 1222000,
        color: "#d2b48c", // Tan
        orbitalSpeed: 5.57, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Enceladus",
        radius: 252.1,
        distanceFromPlanet: 238000,
        color: "#ffffff", // White
        orbitalSpeed: 12.64, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Mimas",
        radius: 198.2,
        distanceFromPlanet: 185520,
        color: "#c0c0c0", // Silver
        orbitalSpeed: 14.28, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Rhea",
        radius: 763.8,
        distanceFromPlanet: 527000,
        color: "#bdbdbd", // Gray
        orbitalSpeed: 8.48, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
  {
    name: "Uranus",
    radius: 25362,
    distanceFromSun: 2871000000,
    orbitalSpeed: 6.8,
    material: new THREE.MeshStandardMaterial({
      map: uranusTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Titania",
        radius: 788.4,
        distanceFromPlanet: 436300,
        color: "#afeeee", // Pale Turquoise
        orbitalSpeed: 3.64, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Oberon",
        radius: 761.4,
        distanceFromPlanet: 583500,
        color: "#a9a9a9", // Dark Gray
        orbitalSpeed: 3.15, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Ariel",
        radius: 578.9,
        distanceFromPlanet: 190900,
        color: "#b0c4de", // Light Steel Blue
        orbitalSpeed: 5.51, // km/s
        material: new THREE.MeshStandardMaterial({
          color: 0xb0c4de,
        }),
        mesh: null,
      },
      {
        name: "Miranda",
        radius: 235.8,
        distanceFromPlanet: 129900,
        color: "#d3d3d3", // Light Gray
        orbitalSpeed: 6.66, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
  {
    name: "Neptune",
    radius: 24622,
    distanceFromSun: 4495000000,
    orbitalSpeed: 5.43,
    material: new THREE.MeshStandardMaterial({
      map: neptuneTexture,
    }),
    mesh: null,
    moons: [
      {
        name: "Triton",
        radius: 1353.4,
        distanceFromPlanet: 354760,
        color: "#87cefa", // Light Sky Blue
        orbitalSpeed: 4.39, // km/s (retrograde orbit)
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
      {
        name: "Nereid",
        radius: 170,
        distanceFromPlanet: 5513400,
        color: "#778899", // Light Slate Gray
        orbitalSpeed: 1.12, // km/s
        material: new THREE.MeshStandardMaterial({
          map: moonTexture,
        }),
        mesh: null,
      },
    ],
  },
];

//create a scene object
scene = new THREE.Scene();
scene.background = backgroundCubeMap;

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xf1a81a, 50000);
scene.add(ambientLight);
scene.add(pointLight);

//create a perpective camera
camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

//position the camera
camera.position.z = 400;
camera.position.y = 5;

// define the geometry and material of the object
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});

planets.map((planet) => {
  planet.mesh = new THREE.Mesh(sphereGeometry, planet.material);
  if (planet.name === "Saturn") {
    planet.mesh.add(ringGroup);
  }
  // planet.mesh.position.x = planet.distanceFromSun / 200000000;
  planet.mesh.scale.setScalar(planet.radius / 8000);
  scene.add(planet.mesh);

  if (planet.moons) {
    planet.moons.forEach((moon) => {
      moon.mesh = new THREE.Mesh(sphereGeometry, moon.material);
      planet.mesh.add(moon.mesh);
      // moon.mesh.position.x = moon.distanceFromPlanet / 200000;
      moon.mesh.scale.setScalar(moon.radius / 10000);
    });
  }
});

//create sun mesh
sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(7);
scene.add(sun);

//create a renderer object
renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setPixelRatio(2);

//set size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

//orbital controls
controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

function renderLoop() {
  planets.map((planet) => {
    planet.mesh.rotation.y += planet.orbitalSpeed / 2000;
    planet.mesh.position.x =
      (Math.sin(planet.mesh.rotation.y) * planet.distanceFromSun) / 6000000;
    planet.mesh.position.z =
      (Math.cos(planet.mesh.rotation.y) * planet.distanceFromSun) / 6000000;
    if (planet.moons) {
      planet.moons.map((moon) => {
        moon.mesh.rotation.y += moon.orbitalSpeed / 1000;
        moon.mesh.position.x =
          (Math.sin(moon.mesh.rotation.y) * moon.distanceFromPlanet) / 200000;
        moon.mesh.position.z =
          (Math.cos(moon.mesh.rotation.y) * moon.distanceFromPlanet) / 200000;
      });
    }
  });

  //render the scene
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
}

//handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderLoop();
