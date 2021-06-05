import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { lorenzAttractor } from './attractor';
import { Params } from './types'
import PointHandler from './handlers/points';
import TrailHandler from './handlers/trails';
import { Vec } from './types';

class App {
  params: Params
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock

  pointHandler: PointHandler
  trailHandler: TrailHandler

  trail_iterator = 0

  constructor(elem: HTMLElement, params: Params) {
    this.params = params
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    this.camera.position.set(-80, 40, 0)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 25)
    // this.scene.add(new THREE.GridHelper(100))

    elem.appendChild(this.renderer.domElement)

    this.pointHandler = new PointHandler(this.scene, params)
    this.trailHandler = new TrailHandler(this.scene, params)
  }

  update() {
    const dt = this.clock.getDelta() / 5 * (this.params.time_scale!)
    const positions = this.pointHandler.position
    for (let i = 0; i < positions.count; i++) {
      const v: Vec = {
        x: positions.getX(i),
        y: positions.getY(i),
        z: positions.getZ(i),
      }
      const o = lorenzAttractor(this.params.vars!, v, dt)

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
    if (newParams.trail_length !== undefined) {
      this.trailHandler.dispose(this.scene)
      console.log(newParams.trail_length)
      if (newParams.trail_length > 0) {
        this.trailHandler = new TrailHandler(this.scene, newParams)
      }
    } else if (newParams.point_color !== undefined) {
      this.pointHandler.setColor(newParams.point_color)
    } else if (newParams.point_scale !== undefined) {
      this.pointHandler.setSize(newParams.point_scale)
    } else if (newParams.trail_color !== undefined) {
      this.trailHandler.setColor(newParams.trail_color)
    } else if (newParams.trail_scale !== undefined) {
      this.trailHandler.setSize(newParams.trail_scale!)
    } else if (newParams.time_scale !== undefined) {
      this.params.time_scale = newParams.time_scale
    }
  }
  dispose(elem: HTMLElement) {
    elem.removeChild(this.renderer.domElement)
  }
}

export default App