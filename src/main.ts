import App from './app'
import Params from './params';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
// import Stats from 'three/examples/jsm/libs/stats.module';

const params: Params = {
  num_points: 2500,
  point_scale: 1.0,
  point_color: 0xffffff,

  trail_length: 0,
  trail_scale: 0.1,
  trail_color: 0x4444444,
}
const reset = {
  reset: function () {
    app.dispose()
    app = new App(params)
  }
}

let app = new App(params);

// const stats = Stats()
// document.body.append(stats.domElement)

const gui = new GUI()

gui.add(reset, 'reset')

gui.add(params, 'num_points').onChange(_ => {
  app.dispose()
  app = new App(params)
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
  // stats.update()
}