import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterImagePass.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import hsv2rgb from './util'

const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 25)

const clock = new THREE.Clock()

const scene = new THREE.Scene();

const stats = Stats()
document.body.appendChild(stats.dom)

const scale = 1
const numPoints = 2000


let verts = []
let colors = []
for (let i = 0; i < numPoints; i++) {

  verts.push(Math.random()* 40, Math.random()* 40, Math.random()* 40)
  const rgb = hsv2rgb(100, 1, 1)
  colors.push(rgb[0], rgb[1], rgb[2])
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
// // uniforms
// const uniforms = {
//   color: { value: new THREE.Color( 0xffff00 ) },
// };

// // point cloud material
// const shaderMaterial = new THREE.ShaderMaterial( {
//   uniforms: uniforms,
//   vertexShader: document.getElementById( 'vertexshader' )?.textContent!,
//   fragmentShader: document.getElementById( 'fragmentshader' )?.textContent!,
//   transparent:  true
// });
const material = new THREE.PointsMaterial({ size: scale, vertexColors: true })
const points = new THREE.Points(geometry, material)
scene.add(points)

// const gridHelper = new THREE.GridHelper(50, 10);
// scene.add(gridHelper);

const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0

function animate() {
  requestAnimationFrame(animate)

  let s = clock.getDelta()

  let verts = points.geometry.attributes.position
  for (let i = 0; i < verts.count; i++) {
    const x = verts.getX(i)
    const y = verts.getY(i)
    const z = verts.getZ(i)
    const o = f([x, y, z], s / 5)

    verts.setXYZ(i, x + o[0], y + o[1], z + o[2])
  }

  verts.needsUpdate = true

  controls.update()
  stats.update()
  renderer.render(scene, camera)
}

stats.begin()
animate()

function f(current: [number, number, number], t: number) {
  let [x, y, z] = current;

  let dx = sigma * (y - x)
  let dy = x * (rho - z) - y
  let dz = x * y - beta * z
  return [dx * t, dy * t, dz * t]
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}