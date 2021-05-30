
function hsv2rgb(h: number,s: number,v: number) 
{                              
  let f= (n: number,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0

function lorenzAttractor(current: [number, number, number], t: number) {
  let [x, y, z] = current;

  let dx = sigma * (y - x)
  let dy = x * (rho - z) - y
  let dz = x * y - beta * z
  return [dx * t, dy * t, dz * t]
}

export {
  hsv2rgb,
  lorenzAttractor,
}