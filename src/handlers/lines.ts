import * as THREE from "three";
import { BufferAttribute } from "three";
import { Params } from "../main";

type n = number

export class LineHandler {

  iterator = 0
  lineCount: number
  lines: THREE.LineSegments

  constructor(scene: THREE.Scene, params: Params) {
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
    this.lineCount = params.trail_length * params.num_points

    scene.add(this.lines)
  }

  get positions() {
    return this.lines.geometry.attributes.position;
  }

  drawLine(x0: n, y0: n, z0: n, x1: n, y1: n, z1: n) {
    this.positions.setXYZ(this.iterator, x0,y0,z0)
    this.positions.setXYZ(this.iterator + 1, x1, y1, z1)
    this.iterator = (this.iterator + 2) % this.lineCount
  }

  update() {
    this.positions.needsUpdate = true
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.lines)
  }
}