import { Vars,Vec } from "./types";

function lorenzAttractor({ sigma, rho, beta }: Vars, { x, y, z }: Vec, t: number): Vec {
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