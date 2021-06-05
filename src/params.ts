type Vars = {
  sigma: number,
  rho: number,
  beta: number,
}

type Params = {
  num_points?: number,
  time_scale?: number,

  point_scale?: number,
  point_color?: number,

  trail_scale?: number,
  trail_color?: number,
  trail_length?: number,
  vars?: Vars,
}

export { Params, Vars }