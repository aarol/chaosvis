import { Vec } from "./vec";

enum Attractors {
  lorenz,
  halvorsen,
  rayleightBenard,
  burkeShaw
}

type Vars = {
  rho: number,
  sigma: number,
  beta: number,
}

class Attractor {
  vars: Vars
  attractor!: (v: Vec, dt: number, vars: Vars) => Vec;

  constructor(vars: Vars, attractor: any) {
    this.vars = vars
    this.setAttractor(attractor)
  }

  setAttractor(att: Attractors) {
    if(att == Attractors.lorenz) {
      this.attractor = lorenzAttractor
    } else if (att == Attractors.halvorsen)
    {
      this.attractor = halvorsenAttractor
    } else if (att == Attractors.rayleightBenard) {
      this.attractor = rayleightBenardAttractor
    } else if (att == Attractors.burkeShaw) {
      this.attractor = burkeSharAttractor
    }
    
  }

  call(v: Vec, dt: number) {
    return this.attractor(v, dt, this.vars)
  }
}

function lorenzAttractor({ x, y, z }: Vec, t: number, vars: Vars): Vec {
  let dx = vars.sigma * (y - x)
  let dy = x * (vars.rho - z) - y
  let dz = x * y - vars.beta * z
  return {
    x: dx * t,
    y: dy * t,
    z: dz * t,
  }
}

function halvorsenAttractor({ x, y, z }: Vec, t: number, vars: Vars): Vec {
  let a = vars.sigma
  let dx = -a*x - 4*y - 4*z - y ^ 2
  let dy = -a*y - 4*z - 4*x - z ^ 2
  let dz = -a*z - 4*x - 4*y - x ^ 2
  return {
    x: dx * t,
    y: dy * t,
    z: dz * t
  }
}

function rayleightBenardAttractor({ x, y, z }: Vec, t: number, v: Vars): Vec {
  let {sigma, rho, beta} = v
  let dx = -sigma*x+sigma*y
  let dy = rho*x-y-x*z
  let dz = x*y-beta*z

  return {
    x: dx * t,
    y: dy * t,
    z: dz * t
  }
 }

function burkeSharAttractor({ x, y, z }: Vec, t: number, v: Vars): Vec {
  let {sigma, rho} = v
  let dx = -sigma*(x+y)
  let dy = -y-sigma*x*z
  let dz = sigma*x*y+rho

  return {
    x: dx * t,
    y: dy * t,
    z: dz * t
  }
}

export {
  Attractor,
  Attractors,
  Vars
}