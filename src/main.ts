import App from './app'

import { GUI } from 'lil-gui';

const params = {
  num_points: 1500,
  time_scale: 1,

  point_scale: 0.2,
  point_color: 0xffffff,

  trail_length: 100,
  trail_scale: 0.1,
  trail_color: 0xffffff,

  vars: {
    rho: 28.0,
    sigma: 10.0,
    beta: 8.0 / 3.0,
  }
}

export type Params = typeof params

const element = document.getElementById('app')!

let app = new App(element, params);

const gui = new GUI()

gui.onChange(event => {
  console.log(event);

  app.onParams(event.property as keyof Params, event.value)
})

gui.add(params, "time_scale", 0, 10)
gui.add(params, "num_points")

let trail = gui.addFolder("Trail")

trail.add(params, "trail_length", 0, 2000)
trail.addColor(params, "trail_color")
trail.add(params, "trail_scale", 0, 1)

let constants = gui.addFolder("Constants").close()

constants.add(params.vars, 'rho', 0, 100).name("ρ")
constants.add(params.vars, 'sigma', 0, 100).name("σ")
constants.add(params.vars, 'beta', 0, 100).name("β")

function reset() {
  app.dispose(element)
  app = new App(element, params)
}

gui.add({ reset }, "reset")

window.onresize = () => app.onWindowResize();

function render() {
  app.update();
  requestAnimationFrame(render);
}

render();