import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineHandler } from './handlers/lines';
import PointHandler from './handlers/points';
import { Params } from './main';



class App {
  params: Params
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  renderer: THREE.WebGLRenderer
  clock: THREE.Clock
  after_pause = false

  pointHandler: PointHandler
  lineHandler: LineHandler

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
    this.lineHandler = new LineHandler(this.scene, initial)

    window.onfocus = () => this.after_pause = true
  }

  update() {
    if (!this.params.time_scale) {
      return
    }
    if (this.after_pause) {
      this.clock.getDelta()
      this.after_pause = false
      this.update()
    }
    // time between frames, usually small like 0.002
    const dt = this.clock.getDelta() / 5 * (this.params.time_scale)

    const { sigma, rho, beta } = this.params.vars
    const positions = this.pointHandler.position

    for (let i = 0; i < positions.count; i++) {
      let x0 = positions.getX(i)
      let y0 = positions.getY(i)
      let z0 = positions.getZ(i)

      let x1 = x0 + (sigma * (y0 - x0)) * dt
      let y1 = y0 + (x0 * (rho - z0) - y0) * dt
      let z1 = z0 + (x0 * y0 - beta * z0) * dt

      this.pointHandler.setPoint(i, x1, y1, z1)


      if (this.trail_iterator % (i + 2) == 0) {
        this.lineHandler.drawLine(x0, y0, z0, x1, y1, z1)
      }

    }

    this.pointHandler.update()

    this.lineHandler.update()
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
      case "trail_color":
        // this.lineHandler.setValue({ color: value })
        break
      case "trail_length":
        this.lineHandler.dispose(this.scene)
        this.lineHandler = new LineHandler(this.scene, this.params)
      case "trail_scale":
        // this.lineHandler.setValue({ size: value })
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