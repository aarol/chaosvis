import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterImagePass.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI, GUIController } from 'three/examples/jsm/libs/dat.gui.module.js'
import { hsv2rgb, lorenzAttractor } from './util'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let renderer: THREE.WebGLRenderer
let clock: THREE.Clock
let stats: Stats

let points: THREE.Points

let trails: THREE.Points

const params = {
  num_points: 250,
  scale: 1,
  trail_length: 100*3,
  trail_size: 0.1,
  point_color: 0xffffff,
  trail_color: 0x4444444,
}


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

  const gui = new GUI({})
  gui.add(params, 'num_points')
  .onChange(val => {
    console.log(val);
  })
  gui.add(params, 'scale', 0, 2)
  gui.add(params, 'trail_length', 0, 1000)
  gui.addColor(params, 'point_color')
  gui.addColor(params, 'trail_color')

  document.body.appendChild(renderer.domElement)
  document.body.appendChild(stats.dom)
}

function initPoints() {


  let verts = []
  let colors = []
  for (let i = 0; i < params.num_points; i++) {

    verts.push(Math.random() * 40, Math.random() * 40, Math.random() * 40)
    const rgb = hsv2rgb(1, 0, 1)
    colors.push(rgb[0], rgb[1], rgb[2])
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({ size: params.scale, vertexColors: true })
  points = new THREE.Points(geometry, material)
  scene.add(points)
}

function initTrails() {
  const geometry = new THREE.BufferGeometry()

  const len = params.trail_length * params.num_points
  const verts = new Array(len)
  verts.fill(0.0, 0.0, len)
  const positions = points.geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    verts[i * params.trail_length] = positions.getX(i)
    verts[i * params.trail_length + 1] = positions.getY(i)
    verts[i * params.trail_length + 2] = positions.getZ(i)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  const material = new THREE.PointsMaterial({ color: 'grey', size: params.trail_size })
  trails = new THREE.Points(geometry, material)
  scene.add(trails)
}

let trail_iterator = 0

function animate() {
  requestAnimationFrame(animate)

  let s = clock.getDelta()


  let pointPositions = points.geometry.attributes.position
  let trailPositions = trails.geometry.attributes.position
  for (let i = 0; i < pointPositions.count; i++) {
    // points
    const x = pointPositions.getX(i)
    const y = pointPositions.getY(i)
    const z = pointPositions.getZ(i)
    const o = lorenzAttractor([x, y, z], s / 5)

    const nx = x + o[0]
    const ny = y + o[1]
    const nz = z + o[2]

    pointPositions.setXYZ(i, nx, ny, nz)

    trailPositions.setXYZ(trail_iterator, nx, ny, nz)
    trail_iterator++
    if (trail_iterator > params.num_points * params.trail_length) trail_iterator = 0
  }

  pointPositions.needsUpdate = true
  trailPositions.needsUpdate = true

  controls.update()
  stats.update()
  renderer.render(scene, camera)
}

init()
initPoints()
initTrails()
animate()

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}