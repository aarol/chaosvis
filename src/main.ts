import App from './app'
import { Params } from './types';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

const params: Params = {
  num_points: 2500,
  time_scale: 1,

  point_scale: 1.0,
  point_color: 0xffffff,

  trail_length: 0,
  trail_scale: 0.1,
  trail_color: 0xffffff,
  vars: {
    rho: 28.0,
    sigma: 10.0,
    beta: 8.0 / 3.0,
  }
}

const element = document.getElementById('app')!

const reset = {
  reset: function () {
    app.dispose(element)
    app = new App(element, params)
  }
}

let app = new App(element, params);

const gui = new GUI()

gui.add(reset, 'reset')

gui.add(params, 'time_scale', 0, 2, 0.001)
.onChange(v => {
  app.updateParams({time_scale: v})
})

gui.add(params, 'num_points').onChange(_ => {
  app.dispose(element)
  app = new App(element, params)
})

gui.add(params, 'point_scale', 0.001, 2, 0.001)
  .onChange(v => {
    app.updateParams({ point_scale: v })
  })

gui.addColor(params, 'point_color')
  .onChange(v => {
    app.updateParams({ point_color: v })
  })

const trailFolder = gui.addFolder('trail')
trailFolder.open()

trailFolder.add(params, 'trail_length', 0, 1000, 10)
  .onChange(v => {
    app.updateParams({
      trail_length: v,
      num_points: params.num_points,
      trail_scale: params.trail_scale,
    })
  })

trailFolder.add(params, 'trail_scale', 0.0001, 1, 0.0001)
  .onChange(v => {
    app.updateParams({ trail_scale: v })
  })
trailFolder.addColor(params, 'trail_color')
  .onChange(v => {
    app.updateParams({ trail_color: v })
  })

const paramFolder = gui.addFolder('parameters')

paramFolder.add(params.vars!, 'sigma')
.onChange(v => {
  app.updateParams({vars: {sigma: v, rho: params.vars!.rho, beta: params.vars!.beta}})
})

paramFolder.add(params.vars!, 'rho')
.onChange(v => {
  app.updateParams({vars: {sigma: params.vars!.sigma, rho: v, beta: params.vars!.beta}})
})

paramFolder.add(params.vars!, 'beta')
.onChange(v => {
  app.updateParams({vars: {sigma: params.vars!.sigma, rho: params.vars!.rho, beta: v}})
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