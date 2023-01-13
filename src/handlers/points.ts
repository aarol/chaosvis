import * as THREE from 'three'
import { Params } from '../main'

class PointHandler {
  points: THREE.Points

  constructor(scene: THREE.Scene, params: Params) {

    let verts = []
    let multip = 40
    let offset = 10

    let r = Math.random
    /// returns 3 randomly generated numbers
    let generatePosition = () => {
      return [r() * multip - offset, r() * multip - offset, r() * multip - offset]
    }
    for (let i = 0; i < params.num_points!; i++) {
      verts.push(...generatePosition())
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))

    const material = new THREE.PointsMaterial({
      size: params.point_scale,
      color: params.point_color,
      depthTest: false,
    })

    this.points = new THREE.Points(geometry, material)
    // inserts points in front of trails
    this.points.renderOrder = 1
    scene.add(this.points)
  }

  get position() {
    return this.points.geometry.attributes.position
  }

  setPoint(i: number, x: number, y: number, z: number) {
    this.position.setXYZ(i, x, y, z)
  }

  setColor(color: number) {
    (this.points.material as THREE.PointsMaterial).setValues({ color: color })
  }

  setSize(size: number) {
    (this.points.material as THREE.PointsMaterial).setValues({ size: size })
  }

  update() {
    this.position.needsUpdate = true
  }
}

export default PointHandler