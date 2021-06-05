import * as THREE from 'three'
import { Params, Vec } from '../types'

export default class TrailHandler {
  trails: THREE.Points

  constructor(scene: THREE.Scene, params: Params) {
    // length is multiplied by 3 for the x,y,z coordinates
    const len = params.trail_length! * 3 * params.num_points!
    const verts = new Array(len)
    // every point spawns in 0.0
    verts.fill(0.0)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    const material = new THREE.PointsMaterial({
      size: params.trail_scale!,
      color: params.trail_color!,
    })

    this.trails = new THREE.Points(geometry, material)

    scene.add(this.trails)
  }

  get position() {
    return this.trails.geometry.attributes.position
  }

  setPoint(i: number, v: Vec) {
    this.position.setXYZ(i, v.x, v.y, v.z)
  }

  setColor(color: number) {
    (this.trails.material as THREE.PointsMaterial).setValues({ color: color })
  }

  setSize(size: number) {
    (this.trails.material as THREE.PointsMaterial).setValues({ size: size })
  }

  requestUpdate() {
    this.position.needsUpdate = true
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.trails)
  }
}