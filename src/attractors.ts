import { Vec } from "./vec";

const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0

function lorenzAttractor(current: Vec, t: number): Vec {
  let { x, y, z } = current;

  let dx = sigma * (y - x)
  let dy = x * (rho - z) - y
  let dz = x * y - beta * z
  return {
    x: dx * t,
    y: dy * t,
    z: dz * t,
  }
}

export {
  lorenzAttractor,
}