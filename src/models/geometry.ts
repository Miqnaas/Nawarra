import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { InfoId } from '../data';
export type V3 = [number, number, number];
export function pbr(color: T.ColorRepresentation, roughness=.42, metalness=.12) {return new T.MeshStandardMaterial({color,roughness,metalness});}
export function tag(object:T.Object3D,id:InfoId){object.userData.info=id;return object;}
export function sphere(parent:T.Group,scale:V3,position:V3,mat:T.Material,id?:InfoId){const mesh=new T.Mesh(new T.SphereGeometry(1,40,32),mat);mesh.scale.set(...scale);mesh.position.set(...position);if(id)tag(mesh,id);parent.add(mesh);return mesh;}
export function path(points:V3[]){return new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));}
export function tube(parent:T.Group,points:V3[],radius:number,mat:T.Material,id?:InfoId,segments=48){const curve=path(points);const mesh=new T.Mesh(new T.TubeGeometry(curve,segments,radius,8,false),mat);if(id)tag(mesh,id);parent.add(mesh);return {mesh,curve};}
export function rounded(parent:T.Group,size:V3,pos:V3,mat:T.Material,radius=.05,id?:InfoId){const mesh=new T.Mesh(new RoundedBoxGeometry(...size,3,radius),mat);mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;if(id)tag(mesh,id);parent.add(mesh);return mesh;}
export function vessel(parent:T.Group,points:V3[],radius:number,mat:T.Material,id?:InfoId){
 const {curve}=tube(parent,points,radius,mat,id);const end=curve.getPoint(1),normal=curve.getTangent(1);
 const rim=new T.Mesh(new T.TorusGeometry(radius*.87,radius*.13,8,32),mat);rim.position.copy(end);rim.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);if(id)tag(rim,id);parent.add(rim);
 const hole=new T.Mesh(new T.CircleGeometry(radius*.72,24),pbr('#211a28',.95));hole.position.copy(end).addScaledVector(normal,.002);hole.quaternion.copy(rim.quaternion);if(id)tag(hole,id);parent.add(hole);
}
function tissueTexture(){const size=128,data=new Uint8Array(size*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const v=Math.sin(x*.22+y*.38+Math.sin(y*.08)*3)*.3+Math.sin(y*1.4+x*.12)*.15;data[y*size+x]=Math.round(125+v*80);}const t=new T.DataTexture(data,size,size,T.RedFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,3);t.needsUpdate=true;return t;}
export function makeHeart(){
 const g=new T.Group();const flesh=new T.MeshPhysicalMaterial({color:'#803d46',roughness:.49,metalness:.03,clearcoat:.15,clearcoatRoughness:.5,bumpMap:tissueTexture(),bumpScale:.024});
 const red=pbr('#96454b',.4,.1), blue=pbr('#456985',.43,.18), atrium=flesh.clone();atrium.color.set('#925361');
 const geom=new T.SphereGeometry(1,72,64),p=geom.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),lower=(y+1)/2;
  const taper=.60+.40*Math.pow(Math.max(0,lower),.32);
  const groove=z>0?Math.exp(-Math.pow((x+.05-y*.2)*14,2))*.055:0;
  const ripple=1+.013*Math.sin(y*27+x*11)*Math.cos(z*13);
  p.setXYZ(i,x*taper*1.02-.21*(1-y)+.08*(1-y*y),y*1.18-.21,z*.68*ripple-groove);
 }
 geom.computeVertexNormals();const body=new T.Mesh(geom,flesh);body.castShadow=true;tag(body,'ventricle');g.add(body);
 const ra=sphere(g,[.55,.51,.48],[-.55,.5,-.04],atrium,'heart');ra.rotation.z=.38;
 sphere(g,[.43,.4,.43],[.5,.52,-.15],atrium,'heart');
 sphere(g,[.22,.27,.2],[-.78,.66,.22],flesh,'heart').rotation.z=-.45;
 vessel(g,[[-.12,.51,-.1],[-.2,1.02,-.15],[-.05,1.52,-.17],[.28,1.66,-.18],[.58,1.42,-.29],[.62,.8,-.4]],.18,red,'aorta');
 vessel(g,[[.05,1.43,-.15],[-.01,1.93,-.16]],.071,red,'aorta');
 vessel(g,[[.27,1.54,-.18],[.34,1.94,-.2]],.064,red,'aorta');
 vessel(g,[[.43,1.48,-.2],[.65,1.85,-.23]],.061,red,'aorta');
 vessel(g,[[-.39,.49,.1],[-.37,.96,.14],[-.13,1.15,.21],[.31,1.15,.17],[.86,1.29,-.02]],.156,blue,'heart');
 vessel(g,[[-.65,.36,-.23],[-.76,1.02,-.29],[-.79,1.66,-.28]],.14,blue,'heart');
 vessel(g,[[.43,.4,-.38],[.74,.7,-.41],[1.0,.76,-.44]],.092,red,'heart');
 const arteries=pbr('#b87c73',.55),veins=pbr('#536680',.48,.15);
 const paths:V3[][]=[
 [[-.12,.62,.61],[-.21,.27,.67],[-.08,-.05,.68],[.06,-.43,.6],[-.14,-.93,.36],[-.37,-1.26,.09]],
 [[-.16,.35,.65],[-.54,.23,.55],[-.8,-.04,.3],[-.8,-.45,.15]],
 [[-.08,-.02,.68],[.25,.05,.64],[.51,-.19,.54],[.66,-.47,.24]],
 [[.03,-.37,.62],[-.27,-.51,.61],[-.5,-.73,.4],[-.53,-1,.19]],
 [[.13,.12,.66],[.4,.3,.56],[.72,.42,.24]],
 [[-.1,-.85,.4],[.2,-.77,.36],[.38,-.93,.12]],
 [[-.53,.23,.55],[-.6,.01,.53],[-.57,-.3,.54],[-.72,-.58,.27]],
 ];
 paths.forEach((pts,i)=>tube(g,pts,i===0?.024:.013,i%3===0?veins:arteries,'ventricle'));
 for(let i=0;i<14;i++){const y=.22-i*.072,x=-.19+i*.012;tube(g,[[x,y,.68],[x+.1,y-.08,.66],[x+.27,y-.2,.57]],.0045,arteries,'ventricle',16);}
 g.rotation.set(-.08,-.22,-.12);return g;
}
export function makeTorso(){
 const g=new T.Group(),nx=72,ny=52,vertices:number[]=[],indices:number[]=[];
 const widths=[[0,1.34],[.17,1.43],[.4,1.78],[.65,1.97],[.78,2.02],[.88,1.63],[.94,.62],[1,.49]];
 function widthAt(t:number){for(let j=1;j<widths.length;j++)if(t<=widths[j][0]){const [a,w]=widths[j-1],[b,v]=widths[j];const k=(t-a)/(b-a);return T.MathUtils.lerp(w,v,k*k*(3-2*k));}return .49;}
 for(let j=0;j<=ny;j++){const t=j/ny,y=t*5.3-2.6,w=widthAt(t),depth=.61+.18*Math.sin(t*Math.PI);for(let i=0;i<=nx;i++){const a=i/nx*Math.PI*2;vertices.push(Math.cos(a)*w,y,Math.sin(a)*depth-.22);if(j<ny&&i<nx){const q=j*(nx+1)+i;indices.push(q,q+1,q+nx+1,q+1,q+nx+2,q+nx+1);}}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
 const skin=new T.MeshPhysicalMaterial({color:'#47768f',transparent:true,opacity:.07,roughness:.3,metalness:.2,side:T.DoubleSide,depthWrite:false});g.add(new T.Mesh(geo,skin));
 const wire=new T.Mesh(geo,new T.MeshBasicMaterial({color:'#7db8d0',wireframe:true,transparent:true,opacity:.018,depthWrite:false}));g.add(wire);
 const bone=new T.MeshStandardMaterial({color:'#72a1b2',transparent:true,opacity:.13,roughness:.55,depthWrite:false});
 for(let side of [-1,1]){
  for(let i=0;i<8;i++){const y=1.38-i*.34,w=1.62-i*.04;tube(g,[[0,y,.3],[side*.6,y+.11,.41],[side*w,y-.04,.17],[side*(w+.03),y-.25,-.25],[side*.6,y-.29,-.72],[0,y-.15,-.79]],.025,bone,undefined,32);}
  tube(g,[[side*.06,1.55,.33],[side*.65,1.74,.32],[side*1.4,1.67,.01],[side*1.92,1.48,-.2]],.045,bone);
  const lung=sphere(g,[.68,1.23,.48],[side*.96,-.08,-.36],new T.MeshStandardMaterial({color:'#426278',transparent:true,opacity:.045,depthWrite:false,roughness:.7}));lung.rotation.z=side*-.15;
  tube(g,[[side*.48,2.5,-.2],[side*.32,1.8,-.2],[side*.9,1.1,-.3],[side*.85,.5,-.55],[side*1.18,-.3,-.5]],.035,new T.MeshStandardMaterial({color:'#59c5dd',emissive:'#1e5b72',emissiveIntensity:.4,transparent:true,opacity:.24,depthWrite:false}));
 }
 tube(g,[[0,2.5,-.68],[0,1,-.82],[0,-1,-.8],[0,-2.4,-.68]],.055,bone);return g;
}
export function makePacemaker(){
 const g=new T.Group();tag(g,'pacemaker');
 rounded(g,[.85,.67,.20],[0,0,0],new T.MeshPhysicalMaterial({color:'#abbcc4',metalness:.82,roughness:.26,clearcoat:.7}),.13,'pacemaker');
 rounded(g,[.68,.47,.02],[0,-.01,.12],pbr('#334758',.45,.5),.07,'pacemaker');
 rounded(g,[.34,.22,.035],[-.1,-.04,.14],pbr('#acc3c0',.4,.6),.025,'battery');
 rounded(g,[.035,.08,.04],[.09,-.04,.15],pbr('#d5ca9c',.3,.8),.008,'battery');
 rounded(g,[.59,.13,.18],[0,.38,-.01],new T.MeshPhysicalMaterial({color:'#b7ccd5',transparent:true,opacity:.5,roughness:.2,metalness:.2}),.04,'pacemaker');
 for(let x of [-.18,.18])sphere(g,[.045,.045,.035],[x,.38,.09],pbr('#d0bc7f',.3,.8),'pacemaker');
 for(let y of [-.18,.16])for(let x of [-.29,.29]){const screw=new T.Mesh(new T.CylinderGeometry(.018,.018,.013,12),pbr('#d5dfe2',.3,.9));screw.rotation.x=Math.PI/2;screw.position.set(x,y,.146);g.add(screw);}
 return g;
}
export function makeBoard(){
 const g=new T.Group();tag(g,'conditioning');rounded(g,[1.10,.08,.72],[0,0,0],pbr('#18504c',.48,.3),.055,'conditioning');
 const trace=pbr('#d3ba73',.3,.75);
 for(let i=0;i<10;i++){const x=-.46+i*.1;tube(g,[[x,.052,-.27],[x,.052,-.12],[x+.04,.052,-.07],[x+.04,.052,.28]],.007,trace,'conditioning',8);}
 for(const [x,z,w,d] of [[-.19,-.05,.28,.25],[.28,.16,.18,.2],[.28,-.2,.13,.16]]){rounded(g,[w,.08,d],[x,.09,z],pbr('#16252d',.5,.35),.015,'conditioning');for(let i=0;i<4;i++)for(let side of [-1,1])rounded(g,[.025,.015,.018],[x+side*(w/2+.02),.07,z-d*.3+i*d*.2],trace,.002,'conditioning');}
 for(let x of [-.42,.42])for(let z of [-.27,.27]){const screw=new T.Mesh(new T.TorusGeometry(.025,.008,6,16),trace);screw.rotation.x=Math.PI/2;screw.position.set(x,.055,z);g.add(screw);}
 return g;
}
export function disposeObject(object:T.Object3D){const geos=new Set<T.BufferGeometry>(),mats=new Set<T.Material>(),textures=new Set<T.Texture>();object.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Points){geos.add(o.geometry);const mm=Array.isArray(o.material)?o.material:[o.material];mm.forEach(m=>{mats.add(m);if(m instanceof T.MeshStandardMaterial&&m.bumpMap)textures.add(m.bumpMap);});}});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
