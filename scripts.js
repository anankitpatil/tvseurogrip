import * as THREE from "three";

import Stats from "./jsm/libs/stats.module.js";

import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { TrackballControls } from "./jsm/controls/TrackballControls.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";
import TWEEN from "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.min.js";

let container,
  camera,
  scene,
  renderer,
  stats,
  trackballControls,
  hemiLight,
  dirLight,
  mesh,
  grid,
  loader,
  imageLoader,
  controls,
  isAnimating = false,
  slide = 0;

const clock = new THREE.Clock();

setUpScene();
loadObjects();

function setUpScene() {
  container = document.querySelector(".preload");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(250, 120, 0);
  camera.lookAt(0, 75, 60);

  scene = new THREE.Scene();
  // scene.background = new THREE.Color();
  // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 200, 0);

  dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  // ground
  mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;

  grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  //renderer.setClearColor(0x000000, 0);

  //controls = new OrbitControls(camera, renderer.domElement);
  //controls.target.set(0, 75, 0);

  window.addEventListener("resize", onWindowResize);

  // camera control
  //trackballControls = new TrackballControls(camera, renderer.domElement);

  // stats
  stats = new Stats();
}

function loadObjects() {
  // load models
  loader = new GLTFLoader();
  imageLoader = new THREE.TextureLoader();
  loader.load("3d/Protorq Extreme HF.gltf", function (protorqExtremeHF) {
    loader.load("3d/Remora.gltf", function (remora) {
      loader.load("3d/IT30.gltf", function (iT30) {
        loader.load("3d/Pancer Poly X.gltf", function (pancerPolyX) {
          loader.load("3d/Jumbo XT.gltf", function (jumboXT) {
            loader.load("3d/Jumbo XT(wireframe).gltf", function (jumboXTWire) {
              loader.load("3d/Protorq sport BF.gltf", function (
                protorqSportBF
              ) {
                loader.load("3d/EL18.gltf", function (eL18) {
                  loader.load("3d/TR18.gltf", function (tR18) {
                    loader.load("3d/Globe.gltf", function (globe) {
                      console.log(protorqExtremeHF);
                      // Remove preloader
                      document.querySelector(".lds-ellipsis").remove();
                      // Trigger web animation
                      document
                        .querySelector(".animation .one")
                        .classList.add("play");
                      container.appendChild(stats.dom);
                      container.appendChild(renderer.domElement);
                      // Set up Frame 1 - [0,1]
                      protorqExtremeHF.scene.scale.set(10, 10, 10);
                      protorqExtremeHF.scene.position.set(-270, 65, -270);
                      protorqExtremeHF.scene.rotation.set(0, 2.2, 0);
                      protorqExtremeHF.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.castShadow = true;
                        }
                      });
                      scene.add(protorqExtremeHF.scene);
                      const bikeMaterial = new THREE.MeshLambertMaterial({
                        map: imageLoader.load("img/KTM(rev).png"),
                        transparent: true,
                      });
                      const bikeGeometry = new THREE.PlaneGeometry(240, 240);
                      const bikeMesh = new THREE.Mesh(
                        bikeGeometry,
                        bikeMaterial
                      );
                      bikeMesh.position.set(50, 131, -42);
                      bikeMesh.rotation.set(0, 1.5, 0);
                      scene.add(bikeMesh);

                      // Set up Frame 2a - [2]
                      remora.scene.scale.set(10, 10, 10);
                      remora.scene.position.set(0, 65, 0);
                      remora.scene.rotation.set(0, 1.66, 0);
                      remora.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(remora.scene);

                      // Set up Frame 2b - [3]
                      iT30.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(iT30.scene);

                      // Set up Frame 2c - [4]
                      pancerPolyX.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(pancerPolyX.scene);

                      // Set up Frame 3a - [5]
                      jumboXT.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(jumboXT.scene);

                      // Set up Frame 3b - [6]
                      jumboXTWire.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(jumboXTWire.scene);

                      // Set up Frame 4 - [7,8,9]
                      protorqSportBF.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(protorqSportBF.scene);
                      eL18.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(eL18.scene);
                      tR18.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(tR18.scene);

                      // Set up Frame 5 - [10]
                      globe.scene.traverse(function (node) {
                        if (node.isMesh) {
                          node.material.transparent = true;
                          node.material.opacity = 0;
                        }
                      });
                      scene.add(globe.scene);

                      // Set up Frame 6

                      // Set up rest of the scene
                      scene.add(mesh); // [11]
                      scene.add(hemiLight); // [12]
                      scene.add(dirLight); // [13]
                      scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
                      scene.add(grid);

                      console.log(scene);

                      document.querySelector(".preload").classList.add("done");

                      tweenOne();
                      animate();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  //controls.update();
  //trackballControls.update();
  stats.update();
  TWEEN.update();

  if (scene.children[0]) scene.children[0].rotation.z += 0.015;

  renderer.render(scene, camera);
}

function tweenOne() {
  // Scene 1
  // Start animation
  isAnimating = true;
  TWEEN.removeAll();
  setTimeout(() => {
    var protorqExtremeHF = scene.children[0].position;
    new TWEEN.Tween(protorqExtremeHF)
      .to(new THREE.Vector3(0, 65, 0), 1000)
      .easing(TWEEN.Easing.Quintic.Out)
      .onUpdate(() => {
        scene.children[5].position.set(
          protorqExtremeHF.x,
          protorqExtremeHF.y,
          protorqExtremeHF.z
        );
      })
      .start()
      .onComplete(() => {
        var bikeMesh = scene.children[1].material;
        new TWEEN.Tween(bikeMesh)
          .to({ opacity: 1 }, 500)
          .start()
          .onComplete(() => (isAnimating = false));
      });
  }, 100);
}
function tweenTwo() {
  // Scene 1 to 2
  isAnimating = true;
  TWEEN.removeAll();
  var cameraRotation = { z: 60 };
  new TWEEN.Tween(cameraRotation)
    .to({ z: 0 }, 3000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onUpdate(() => {
      camera.lookAt(0, 75, cameraRotation.z);
    })
    .start();
  var protorqExtremeHFRotation = scene.children[0].rotation;
  new TWEEN.Tween(protorqExtremeHFRotation)
    .to({ y: 1.66 }, 3000)
    .easing(TWEEN.Easing.Quintic.Out)
    .onUpdate(() => {
      scene.children[0].rotation.y = protorqExtremeHFRotation.y;
    })
    .start()
    .onComplete(() => (isAnimating = false));
  var bikeMesh = scene.children[1].material;
  new TWEEN.Tween(bikeMesh).to({ opacity: 0 }, 500).start();
  document.body.style.backgroundColor = "#000";
  var meshMaterial = scene.children[11].material;
  new TWEEN.Tween(meshMaterial).to({ opacity: 0 }, 500).start();
}
// Move camera with mouse
/* document.addEventListener("mousemove", function (e) {
  //console.log(e);
  camera.lookAt(
    camera.rotation.x - (e.pageY - window.innerHeight / 2) * 0.01,
    camera.rotation.y,
    camera.rotation.z - (e.pageX - window.innerWidth / 2) * 0.01
  );
}); */
function setOpacity(obj, opacity) {
  obj.children.forEach((child) => {
    setOpacity(child, opacity);
  });
  if (obj.material) {
    obj.material.opacity = opacity;
  }
}
// Get scroll direction
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}
var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
function checkScrollDirection(e) {
  if (e.wheelDelta) {
    return e.wheelDelta > 0;
  }
  return e.deltaY < 0;
}
let oldScroll = 0;
const scrollEvent = (e) => {
  if (!isAnimating) {
    if (checkScrollDirection(e)) {
      // Scrolled up
    } else {
      // Scrolled down
      console.log(slide);
      switch (slide) {
        case 0:
          tweenTwo();
          slide = 1;
          break;
        case 1:
          break;
      }
    }
  }
};
const debounceScroll = debounce(scrollEvent, 100);
document.addEventListener(wheelEvent, debounceScroll, wheelOpt);
document.addEventListener("ontouchmove", debounceScroll, wheelOpt);
