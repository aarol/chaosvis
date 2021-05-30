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
const scale = .6
const numPoints = 2

let trails: THREE.LineSegments
const trail_size = 150 * 3

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

function initTrails() {

  const verts: number[] = new Array(trail_size*numPoints)
  verts.fill(0.0)
  const colors = []

  const positions = points.geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    verts[i * trail_size] = positions.getX(i)
    verts[i * trail_size + 1] = positions.getY(i)
    verts[i * trail_size + 2] = positions.getZ(i)
    colors.push(255, 255, 255)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const material = new THREE.LineBasicMaterial({ color: 'red' })
  trails = new THREE.LineSegments(geometry, material)
  scene.add(trails)
}

function setTrail(
  trailPositions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  i: number, x: number, y: number, z: number,
  o: any[],
) {
  let trail = Array.from(trailPositions.array)
  trail = trail.slice(i * trail_size, i * trail_size + trail_size)
  trail.unshift(x + o[0], y + o[1], z + o[2])
  trail.splice(-3, 3)

  for (let k = 0; k < trail.length; k++) {
    trailPositions.setXYZ(i*trail_size + k, trail[3 * k], trail[3 * k + 1], trail[3 * k + 2])
  }
}

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

    pointPositions.setXYZ(i, x + o[0], y + o[1], z + o[2])

    // trails
    setTrail(trailPositions, i, x, y, z, o)
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