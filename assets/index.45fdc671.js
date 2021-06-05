import{B as t,F as e,P as i,a as s,S as a,C as r,b as o,W as n,O as l,G as d}from"./vendor.95c5722d.js";function h({sigma:t,rho:e,beta:i},{x:s,y:a,z:r},o){return{x:t*(a-s)*o,y:(s*(e-r)-a)*o,z:(s*a-i*r)*o}}class c{constructor(a,r){let o=[],n=()=>Math.random();for(let t=0;t<r.num_points;t++)o.push(40*n()-10,40*n()-10,40*n()-10);const l=new t;l.setAttribute("position",new e(o,3));const d=new i({size:r.point_scale,color:r.point_color,depthTest:!1});this.points=new s(l,d),this.points.renderOrder=1,a.add(this.points)}get position(){return this.points.geometry.attributes.position}setPoint(t,e){this.position.setXYZ(t,e.x,e.y,e.z)}setColor(t){this.points.material.setValues({color:t})}setSize(t){this.points.material.setValues({size:t})}requestUpdate(){this.position.needsUpdate=!0}}class p{constructor(a,r){const o=3*r.trail_length*r.num_points,n=new Array(o);n.fill(0);const l=new t;l.setAttribute("position",new e(n,3));const d=new i({size:r.trail_scale,color:r.trail_color});this.trails=new s(l,d),a.add(this.trails)}get position(){return this.trails.geometry.attributes.position}setPoint(t,e){this.position.setXYZ(t,e.x,e.y,e.z)}setColor(t){this.trails.material.setValues({color:t})}setSize(t){this.trails.material.setValues({size:t})}requestUpdate(){this.position.needsUpdate=!0}dispose(t){t.remove(this.trails)}}class m{constructor(t,e){this.trail_iterator=0,this.params=e,this.scene=new a,this.clock=new r,this.camera=new o(45,window.innerWidth/window.innerHeight,1,500),this.camera.position.set(-80,40,0),this.renderer=new n,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.controls=new l(this.camera,this.renderer.domElement),this.controls.target.set(0,0,25),t.appendChild(this.renderer.domElement),this.pointHandler=new c(this.scene,e),this.trailHandler=new p(this.scene,e)}update(){const t=this.clock.getDelta()/5*this.params.time_scale,e=this.pointHandler.position;for(let i=0;i<e.count;i++){const s={x:e.getX(i),y:e.getY(i),z:e.getZ(i)},a=h(this.params.vars,s,t);s.x+=a.x,s.y+=a.y,s.z+=a.z,this.pointHandler.setPoint(i,s),this.params.trail_length>0&&(this.trailHandler.setPoint(this.trail_iterator,s),this.trail_iterator++,this.trail_iterator>this.params.num_points*this.params.trail_length&&(this.trail_iterator=0))}this.pointHandler.requestUpdate(),this.params.trail_length>0&&this.trailHandler.requestUpdate(),this.controls.update(),this.renderer.render(this.scene,this.camera)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}updateParams(t){void 0!==t.trail_length?(this.trailHandler.dispose(this.scene),t.trail_length>0&&(this.trailHandler=new p(this.scene,t))):void 0!==t.point_color?this.pointHandler.setColor(t.point_color):void 0!==t.point_scale?this.pointHandler.setSize(t.point_scale):void 0!==t.trail_color?this.trailHandler.setColor(t.trail_color):void 0!==t.trail_scale?this.trailHandler.setSize(t.trail_scale):void 0!==t.time_scale&&(this.params.time_scale=t.time_scale)}dispose(t){t.removeChild(this.renderer.domElement),this.renderer.dispose(),this.controls.dispose(),this.clock.stop()}}const _={num_points:2500,time_scale:1,point_scale:1,point_color:16777215,trail_length:0,trail_scale:.1,trail_color:16777215,vars:{rho:28,sigma:10,beta:8/3}},u=document.getElementById("app"),w={reset:function(){g.dispose(u),g=new m(u,_)}};let g=new m(u,_);const v=new d;v.add(w,"reset"),v.add(_,"time_scale",0,2,.001).onChange((t=>{g.updateParams({time_scale:t})})),v.add(_,"num_points").onChange((t=>{g.dispose(u),g=new m(u,_)})),v.add(_,"point_scale",.001,2,.001).onChange((t=>{g.updateParams({point_scale:t})})),v.addColor(_,"point_color").onChange((t=>{g.updateParams({point_color:t})}));const z=v.addFolder("trail");z.open(),z.add(_,"trail_length",0,1e3,10).onChange((t=>{g.updateParams({trail_length:t,num_points:_.num_points,trail_scale:_.trail_scale})})),z.add(_,"trail_scale",1e-4,1,1e-4).onChange((t=>{g.updateParams({trail_scale:t})})),z.addColor(_,"trail_color").onChange((t=>{g.updateParams({trail_color:t})}));const C=v.addFolder("parameters");function P(){g.onWindowResize()}C.add(_.vars,"sigma").onChange((t=>{g.updateParams({vars:{sigma:t,rho:_.vars.rho,beta:_.vars.beta}})})),C.add(_.vars,"rho").onChange((t=>{g.updateParams({vars:{sigma:_.vars.sigma,rho:t,beta:_.vars.beta}})})),C.add(_.vars,"beta").onChange((t=>{g.updateParams({vars:{sigma:_.vars.sigma,rho:_.vars.rho,beta:t}})})),window.onresize=P,P(),function t(){requestAnimationFrame(t),g.update()}();
