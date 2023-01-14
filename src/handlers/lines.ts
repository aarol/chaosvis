import * as THREE from "three";
import { BufferAttribute } from "three";
import { Params } from "../main";

type n = number

export class LineHandler {

  iterator = 0
  last_indexes: Array<number>
  lines: THREE.LineSegments
  params: Params

  constructor(scene: THREE.Scene, points: Array<number>, params: Params) {
    this.params = params
    const len = params.trail_length * 3 * params.num_points
    const geometry = new THREE.BufferGeometry()
    const verts = new Float32Array(len)
    const colors = new Float32Array(len)

    geometry.setAttribute("position", new BufferAttribute(verts, 3))
    geometry.setAttribute("vertColor", new BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xFFFFFF),
    })

    this.lines = new THREE.LineSegments(geometry, material)
    this.last_indexes = points

    scene.add(this.lines)
  }

  get positions() {
    return this.lines.geometry.attributes.position;
  }

  drawLine(i: n, x1: n, y1: n, z1: n) {
    let pointIndex = i * 3
    let [x, y, z] = this.last_indexes.slice(pointIndex, pointIndex + 3)
    this.positions.setXYZ(this.iterator, x, y, z)
    this.positions.setXYZ(this.iterator + 1, x1, y1, z1)
    this.iterator = (this.iterator + 2) % (this.params.num_points * this.params.trail_length)
    this.last_indexes[pointIndex] = x1
    this.last_indexes[pointIndex + 1] = y1
    this.last_indexes[pointIndex + 2] = z1
  }

  update() {
    this.positions.needsUpdate = true
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.lines)
  }
}