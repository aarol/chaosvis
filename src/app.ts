import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Attractor } from './attractors';
import Params from './params'
import PointHandler from './subjects/points';
import TrailHandler from './subjects/trails';
import { Vec } from './vec';

class App {
  params: Params
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  attractor: Attractor

  pointHandler: PointHandler
  trailHandler: TrailHandler

  trail_iterator = 0

  constructor(params: Params) {
    this.params = params
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    this.camera.position.set(0, 0, 100)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 25)

    this.attractor = new Attractor(params.vars!, params.attractor!)

    document.body.appendChild(this.renderer.domElement)

    this.pointHandler = new PointHandler(this.scene, params)
    this.trailHandler = new TrailHandler(this.scene, params)
  }

  update() {
    const dt = this.clock.getDelta()
    const positions = this.pointHandler.position
    for (let i = 0; i < positions.count; i++) {
      const v: Vec = {
        x: positions.getX(i),
        y: positions.getY(i),
        z: positions.getZ(i),
      }
      const o = this.attractor.call!(v, dt / 5)

      v.x += o.x
      v.y += o.y
      v.z += o.z

      this.pointHandler.setPoint(i, v)
      if (this.params.trail_length! > 0) {
        this.trailHandler.setPoint(this.trail_iterator, v)
        this.trail_iterator++

        if (this.trail_iterator > this.params.num_points! * this.params.trail_length!) {
          this.trail_iterator = 0
        }
      }
    }
    this.pointHandler.requestUpdate()
    this.trailHandler.requestUpdate()

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateParams(newParams: Params) {
    if (newParams.trail_length) {
      this.trailHandler.dispose(this.scene)
      this.trailHandler = new TrailHandler(this.scene, newParams)
    } else if (newParams.point_color) {
      this.pointHandler.setColor(newParams.point_color)
    } else if (newParams.point_scale) {
      this.pointHandler.setSize(newParams.point_scale)
    } else if (newParams.trail_color) {
      this.trailHandler.setColor(newParams.trail_color)
    } else if (newParams.trail_size) {
      this.trailHandler.setSize(newParams.trail_size!)
    } else if (newParams.attractor) {
      this.attractor.setAttractor(newParams.attractor!)
    }
  }
  dispose() {
    document.body.removeChild(this.renderer.domElement)
  }
}

export default App