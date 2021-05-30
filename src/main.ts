import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterImagePass.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { hsv2rgb, lorenzAttractor } from './util'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let renderer: THREE.WebGLRenderer
let clock: THREE.Clock
let stats: Stats

let points: THREE.Points

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, 100);
  
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 25)
  
  clock = new THREE.Clock()
  
  stats = Stats()
  
  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)
}

function initPoints() {
  const scale = .6
  const numPoints = 5000

  let verts = []
  let colors = []
  for (let i = 0; i < numPoints; i++) {

    verts.push(Math.random() * 40, Math.random() * 40, Math.random() * 40)
    const rgb = hsv2rgb(1, 0, 1)
    colors.push(rgb[0], rgb[1], rgb[2])
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({ size: scale, vertexColors: true })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}


function animate() {
  requestAnimationFrame(animate)

  let s = clock.getDelta()

  let verts = points.geometry.attributes.position
  for (let i = 0; i < verts.count; i++) {
    const x = verts.getX(i)
    const y = verts.getY(i)
    const z = verts.getZ(i)
    const o = lorenzAttractor([x, y, z], s / 5)

    verts.setXYZ(i, x + o[0], y + o[1], z + o[2])
  }

  verts.needsUpdate = true

  controls.update()
  stats.update()
  renderer.render(scene, camera)
}

init()
initPoints()
animate()

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}