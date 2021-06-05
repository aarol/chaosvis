import * as THREE from 'three'
import {Params} from '../params'
import {Vec} from '../vec'

class PointHandler {
  points: THREE.Points

  constructor(scene: THREE.Scene, params: Params) {

    let verts = []
    let colors = []
    let multip = 40
    let r = () => Math.random()
    let offset = 10

    let generatePosition = () => {
      return [r() * multip - offset, r() * multip - offset, r() * multip - offset]
    }
    for (let i = 0; i < params.num_points!; i++) {
      verts.push(...generatePosition())
      const rgb = [255, 255, 255]
      colors.push(rgb[0], rgb[1], rgb[2])
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: params.point_scale!})
    material.depthTest =false

    this.points = new THREE.Points(geometry, material)
    this.points.renderOrder = 1
    scene.add(this.points)
  }

  get position() {
    return this.points.geometry.attributes.position
  }

  setPoint(i: number, v: Vec) {
    this.position.setXYZ(i, v.x, v.y, v.z)
  }

  setColor(color: number) {
    (this.points.material as THREE.PointsMaterial).setValues({color: color})
  }

  setSize(size: number) {
    (this.points.material as THREE.PointsMaterial).setValues({size: size})
  }

  requestUpdate() {
    this.position.needsUpdate = true
  }
}

export default PointHandler