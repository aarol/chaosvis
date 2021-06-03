import { Attractors, Vars } from "./attractors"
import { Vec } from "./vec"


type Params = {
  attractor?: Attractors
  num_points?: number,
  point_scale?: number,
  point_color?: number,

  trail_size?: number,
  trail_color?: number,
  trail_length?: number,

  vars?: Vars
}

export default Params