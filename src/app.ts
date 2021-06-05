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
    // high density displays look blurry without this
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // in threejs examples
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // center camera on the attractor
    this.controls.target.set(0, 0, 25)

    elem.appendChild(this.renderer.domElement)

    this.pointHandler = new PointHandler(this.scene, params)
    this.trailHandler = new TrailHandler(this.scene, params)
  }

  update() {
    // time between frames, usually small like 0.002
    const dt = this.clock.getDelta() / 5 * (this.params.time_scale!)
    const positions = this.pointHandler.position
    // loop through every point
    for (let i = 0; i < positions.count; i++) {
      const v: Vec = {
        x: positions.getX(i),
        y: positions.getY(i),
        z: positions.getZ(i),
      }
      const o = lorenzAttractor(this.params.vars!, v, dt)

      // increment point position by formula
      v.x += o.x
      v.y += o.y
      v.z += o.z

      this.pointHandler.setPoint(i, v)

      // if trail enabled
      if (this.params.trail_length! > 0) {
        // set current point to trail
        this.trailHandler.setPoint(this.trail_iterator, v)
        // this is incremented every frame * num_points
        this.trail_iterator++

        // if iterator out of bounds
        if (this.trail_iterator > this.params.num_points! * this.params.trail_length!) {
          this.trail_iterator = 0
        }
      }
    }
    this.pointHandler.requestUpdate()
    if(this.params.trail_length! > 0) {
      // only update trail if necessary
      this.trailHandler.requestUpdate()
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /// called from main, handles gui input changes
  updateParams(newParams: Params) {
    // set trail length
    if (newParams.trail_length !== undefined) {
      this.trailHandler.dispose(this.scene)
      if (newParams.trail_length > 0) {
        // if trail has length
        this.trailHandler = new TrailHandler(this.scene, newParams)
      }
      // set point color
    } else if (newParams.point_color !== undefined) {
      this.pointHandler.setColor(newParams.point_color)
      // set point scale
    } else if (newParams.point_scale !== undefined) {
      this.pointHandler.setSize(newParams.point_scale)
      // set trail color
    } else if (newParams.trail_color !== undefined) {
      this.trailHandler.setColor(newParams.trail_color)
      // set trial scale
    } else if (newParams.trail_scale !== undefined) {
      this.trailHandler.setSize(newParams.trail_scale!)
      // set time scale
    } else if (newParams.time_scale !== undefined) {
      this.params.time_scale = newParams.time_scale
    }
  }

  dispose(elem: HTMLElement) {
    elem.removeChild(this.renderer.domElement)
    this.renderer.dispose()
    this.controls.dispose()
    this.clock.stop()
  }
}

export default App