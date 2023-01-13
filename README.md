# Chaosvis

## [Hosted on GitHub pages](https://aarol.github.io/chaosvis/)

Chaosvis visualizes [the Lorenz system](https://en.wikipedia.org/wiki/Lorenz_system) in real time. When two points are put close to each other, the result will be drastically different. The Lorenz system is a [chaotic attractor](https://en.wikipedia.org/wiki/Chaos_theory).

---

<img src="./resources/white.gif" alt="Preview GIF">

<img src="./resources/blue.gif" alt="Preview GIF">

<img src="./resources/million.png" alt="Preview PNG">

---

## How it works

For every point in 3D space, the following formula is calculated:

<img src="./resources/formula.png" width="20%" alt="Lorenz attractor formula" />

Where x,y,z is the current position, dt is the time between frames and σ, ρ, β are parameters. Play around with different parameters and see the effects.

---

Made with [Three.js](https://threejs.org/), [dat.gui](https://github.com/dataarts/dat.gui) and [Vite](https://vitejs.dev/)

[Inspiration came from this video by Orfeas Liossatos](https://youtu.be/idpOunnpKTo)