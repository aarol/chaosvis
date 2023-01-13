import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import PointHandler from './handlers/points';
import TrailHandler from './handlers/trails';
import { Params } from './main';



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

  constructor(elem: HTMLElement, initial: Params) {
    this.params = initial
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

    this.pointHandler = new PointHandler(this.scene, initial)
    this.trailHandler = new TrailHandler(this.scene, initial)

    window.onfocus = () => this.clock.start()
    window.onblur = () => this.clock.stop()
  }

  update() {
    if (!this.params.time_scale || !this.clock.running) {
      return
    }
    // time between frames, usually small like 0.002
    const dt = this.clock.getDelta() / 5 * (this.params.time_scale)

    const { sigma, rho, beta } = this.params.vars
    const positions = this.pointHandler.position
    // loop through every point
    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i)
      let y = positions.getY(i)
      let z = positions.getZ(i)

      let dx = sigma * (y - x)
      let dy = x * (rho - z) - y
      let dz = x * y - beta * z

      x += dx * dt
      y += dy * dt
      z += dz * dt

      this.pointHandler.setPoint(i, x, y, z)

      // if trail enabled
      if (this.params.trail_length! > 0) {
        // set current point to trail
        this.trailHandler.setPoint(this.trail_iterator, x, y, z)
        // this is incremented every frame * num_points
        this.trail_iterator++

        this.trail_iterator %= this.params.num_points * this.params.trail_length
      }
    }

    this.pointHandler.requestUpdate()
    if (this.params.trail_length! > 0) {
      // only update trail if necessary
      this.trailHandler.update()
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  onParams(key: keyof Params, value: number) {
    switch (key) {
      case "num_points":
        throw "TODO"
      case "point_color":
        this.pointHandler.setColor(value)
        break
      case "point_scale":
        this.pointHandler.setSize(value)
        break
      case "time_scale":
        break
      case "trail_color":
        this.trailHandler.setValue({ color: value })
        break
      case "trail_length":
        throw "TODO"
      case "trail_scale":
        this.trailHandler.setValue({ size: value })
        break
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(elem: HTMLElement) {
    elem.removeChild(this.renderer.domElement)
    this.renderer.dispose()
    this.controls.dispose()
    this.clock.stop()
  }
}

export default App