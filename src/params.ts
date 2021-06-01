import { Vec } from "./vec"

type Params = {
  num_points?: number,
  point_scale?: number,
  trail_length?: number,
  trail_size?: number,
  point_color?: number,
  trail_color?: number,
  attractor?: (v: Vec, dt: number) => Vec,
}

export default Params