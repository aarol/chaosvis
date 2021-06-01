import App from './app'
import Params from './params';
import { lorenzAttractor } from './attractors';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

const params: Params = {
  num_points: 2500,
  point_scale: 1.0,
  trail_length: 100,
  trail_size: 0.1,
  point_color: 0xffffff,
  trail_color: 0x4444444,
  attractor: lorenzAttractor
}

let app = new App(params);

const gui = new GUI()
gui.add(params, 'num_points').onChange(_ => {
  app.dispose()
  app = new App(params)
})

gui.add(params, 'point_scale', 0.01, 2)
.onChange(v => {
  app.updateParams({point_scale: v})
})

gui.add(params, 'trail_size', 0, 1000)
.onChange(v => {
  app.updateParams({trail_size: v})
})
gui.addColor(params, 'trail_color')
.onChange(v => {
  app.updateParams({trail_color: v})
})
gui.addColor(params, 'point_color')
.onChange(v => {
  app.updateParams({point_color: v})
})

bindEventListeners();
render();

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();	
}

function resizeCanvas() {
    app.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    app.update();
}