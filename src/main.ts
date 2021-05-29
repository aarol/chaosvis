import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true})

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);

const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()

const scene = new THREE.Scene();

const material = new THREE.LineBasicMaterial({ color: 0xd4d4d4 })

const sphereGeometry = new THREE.SphereGeometry(1)

const spheres: THREE.Mesh<THREE.SphereGeometry, THREE.LineBasicMaterial>[] = []
for (let i = 0; i < 25; i++) {
  const mat = new THREE.LineBasicMaterial({color: i * 10})
  const sphere = new THREE.Mesh(sphereGeometry, mat)
  sphere.position.set(1+i/10,1,1)
  scene.add(sphere)
  spheres.push(sphere)
}

const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0

function animate() {
  requestAnimationFrame(animate)

  let s = clock.getDelta()

  for (const sphere of spheres) {
    
    let v = f(sphere.position, s / 2)
    
    sphere.position.add(v)
    
    controls.update()
    
    renderer.render(scene, camera)
  }
}

animate()

function f(current: THREE.Vector3, t: number) {
  let { x, y, z } = current;
  let dx = sigma * (y - x)
  let dy = x * (rho - z) - y
  let dz = x * y - beta * z
  return new THREE.Vector3(dx * t, dy * t, dz * t)
}