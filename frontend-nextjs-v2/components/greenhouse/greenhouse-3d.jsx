import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const LOGO_B64 = "data:image/jpeg;base64,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";

const VIEWS=[
  {id:"all",label:"Visão Completa",icon:"◉"},
  {id:"structure",label:"Estrutura",icon:"▦"},
  {id:"irrigation",label:"Irrigação",icon:"◈"},
  {id:"electronics",label:"Elétrica",icon:"⚡"},
];

const GH={L:12,W:6,H:6,soilH:1.5,baseH:0.3,wallH:1.5};

export default function Greenhouse3D(){
  const mountRef=useRef(null);
  const S=useRef({});
  const [view,setView]=useState("all");
  const [irrigOn,setIrrigOn]=useState(true);
  const [autoRot,setAutoRot]=useState(false);
  const [lbls,setLbls]=useState(false);
  const [stats,setStats]=useState({temp:26,hum:72,soil:58,ai:0.92});
  const [ready,setReady]=useState(false);

  // Zoom function exposed to UI buttons
  const doZoom=(dir)=>{
    if(!S.current.sph)return;
    S.current.sph.r=Math.max(6,Math.min(40,S.current.sph.r+dir*2));
    S.current.camUp();
  };

  useEffect(()=>{
    if(!mountRef.current)return;
    const box=mountRef.current;
    let cW=box.clientWidth,cH=box.clientHeight;

    // ═══ RENDERER ═══
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(cW,cH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.15;
    renderer.outputEncoding=THREE.sRGBEncoding;
    box.appendChild(renderer.domElement);

    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x070b12);
    scene.fog=new THREE.FogExp2(0x070b12,0.005);

    const camera=new THREE.PerspectiveCamera(45,cW/cH,0.1,200);
    const sph={theta:0.55,phi:0.95,r:20};
    const camUp=()=>{
      camera.position.set(
        sph.r*Math.sin(sph.phi)*Math.cos(sph.theta),
        sph.r*Math.cos(sph.phi),
        sph.r*Math.sin(sph.phi)*Math.sin(sph.theta)
      );
      camera.lookAt(0,2,0);
    };
    camUp();

    // Store refs for zoom buttons
    S.current.sph=sph;
    S.current.camUp=camUp;

    // ═══ LIGHTS ═══
    scene.add(new THREE.AmbientLight(0x4466aa,0.4));
    const sun=new THREE.DirectionalLight(0xffeedd,0.95);
    sun.position.set(10,22,8);sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-16;sun.shadow.camera.right=16;
    sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;
    sun.shadow.camera.far=55;sun.shadow.bias=-0.0008;
    scene.add(sun);
    scene.add(new THREE.DirectionalLight(0x88bbff,0.22).translateX(-8).translateY(10).translateZ(-6));
    scene.add(new THREE.DirectionalLight(0x22cc66,0.12).translateY(6).translateZ(-10));
    const glow=new THREE.PointLight(0x22c55e,0.35,28);glow.position.set(0,6,0);scene.add(glow);

    // ═══ GROUND ═══
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x0b1018,roughness:0.95}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-0.51;ground.receiveShadow=true;scene.add(ground);
    const grid=new THREE.GridHelper(50,50,0x152240,0x0e1828);grid.position.y=-0.49;scene.add(grid);

    // ═══ GROUPS ═══
    const G={structure:new THREE.Group(),plants:new THREE.Group(),water:new THREE.Group(),electronics:new THREE.Group(),posts:new THREE.Group()};
    Object.values(G).forEach(g=>scene.add(g));

    // ═══ MATERIALS ═══
    const M={
      glass:new THREE.MeshPhysicalMaterial({color:0x99ccee,transparent:true,opacity:0.1,roughness:0.02,metalness:0.05,transmission:0.88,thickness:0.12,side:THREE.DoubleSide}),
      frame:new THREE.MeshStandardMaterial({color:0x283848,roughness:0.32,metalness:0.88}),
      mdf:new THREE.MeshStandardMaterial({color:0xA07530,roughness:0.78}),
      mdfD:new THREE.MeshStandardMaterial({color:0x7A5520,roughness:0.82}),
      mdfW:new THREE.MeshStandardMaterial({color:0x8B6428,roughness:0.75}),
      soil:new THREE.MeshStandardMaterial({color:0x3d2b1f,roughness:1.0}),
      pcb:new THREE.MeshStandardMaterial({color:0x006633,roughness:0.42,metalness:0.22}),
      chip:new THREE.MeshStandardMaterial({color:0x111111,roughness:0.22,metalness:0.78}),
      pvc:new THREE.MeshStandardMaterial({color:0xd0d0d0,roughness:0.38,metalness:0.08}),
      pvcJ:new THREE.MeshStandardMaterial({color:0x999999,roughness:0.42}),
      wP:new THREE.MeshStandardMaterial({color:0x2288dd,roughness:0.48,metalness:0.22}),
      noz:new THREE.MeshStandardMaterial({color:0x44aa88,roughness:0.28,metalness:0.55}),
      wBody:new THREE.MeshPhysicalMaterial({color:0x1e90ff,transparent:true,opacity:0.4,roughness:0.05,transmission:0.5}),
      res:new THREE.MeshPhysicalMaterial({color:0x1a3a5c,transparent:true,opacity:0.3,roughness:0.06,side:THREE.DoubleSide}),
      sBlue:new THREE.MeshStandardMaterial({color:0x3399ff,roughness:0.5}),
      sGrey:new THREE.MeshStandardMaterial({color:0xaaaaaa,metalness:0.75,roughness:0.3}),
      gold:new THREE.MeshStandardMaterial({color:0xccaa44,metalness:0.82,roughness:0.25}),
    };

    const hL=GH.L/2,hW=GH.W/2,soilTop=GH.baseH/2+GH.soilH;
    const wT=0.18; // wall thickness

    // ═══ HELPERS ═══
    function bar(x1,y1,z1,x2,y2,z2,r=0.08){
      const d=new THREE.Vector3(x2-x1,y2-y1,z2-z1);const l=d.length();
      const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,8),M.frame);
      m.position.set((x1+x2)/2,(y1+y2)/2,(z1+z2)/2);
      const u=new THREE.Vector3(0,1,0),n=d.normalize();
      if(Math.abs(n.dot(u))<0.9999)m.quaternion.setFromUnitVectors(u,n);
      m.castShadow=true;return m;
    }
    function wire(pts,c){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,0.025,6,false),new THREE.MeshStandardMaterial({color:c,roughness:0.5}));}
    function tube(pts,r=0.055){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,r,8,false),M.wP);}

    // ════════════════════════════════════════════════
    // ██ STRUCTURE
    // ════════════════════════════════════════════════

    // Bottom base plate
    G.structure.add(new THREE.Mesh(new THREE.BoxGeometry(GH.L+wT*2,GH.baseH,GH.W+wT*2),[M.mdfD,M.mdfD,M.mdf,M.mdfD,M.mdfD,M.mdfD]));

    // Metal frame — INSIDE the wood walls
    // Vertical corner posts
    const corners=[[-hL,-hW],[-hL,hW],[hL,-hW],[hL,hW]];
    corners.forEach(([x,z])=>G.structure.add(bar(x,GH.baseH/2,z,x,GH.H,z,0.09)));
    // Top frame
    [[-hL,-hW,hL,-hW],[-hL,hW,hL,hW],[-hL,-hW,-hL,hW],[hL,-hW,hL,hW]].forEach(([a,b,c,d])=>{
      G.structure.add(bar(a,GH.H,b,c,GH.H,d,0.08));
      G.structure.add(bar(a,GH.baseH/2,b,c,GH.baseH/2,d,0.07));
    });
    G.structure.add(bar(0,GH.H,-hW,0,GH.H,hW,0.06));
    [-hL,hL].forEach(x=>G.structure.add(bar(x,GH.H*0.55,-hW,x,GH.H*0.55,hW,0.045)));

    // MDF WALLS — OUTSIDE the metal frame (in front of it)
    const wH=GH.wallH,wY=GH.baseH/2+wH/2;
    // Front (Z+) — positioned OUTSIDE the frame
    const fw=new THREE.Mesh(new THREE.BoxGeometry(GH.L+wT*2,wH,wT),M.mdfW);
    fw.position.set(0,wY,hW+wT/2);fw.castShadow=true;G.structure.add(fw);
    // Back (Z-)
    const bw=new THREE.Mesh(new THREE.BoxGeometry(GH.L+wT*2,wH,wT),M.mdfW);
    bw.position.set(0,wY,-hW-wT/2);bw.castShadow=true;G.structure.add(bw);
    // Left (X-)
    const lw=new THREE.Mesh(new THREE.BoxGeometry(wT,wH,GH.W+wT*2),M.mdfD);
    lw.position.set(-hL-wT/2,wY,0);lw.castShadow=true;G.structure.add(lw);
    // Right (X+)
    const rw=new THREE.Mesh(new THREE.BoxGeometry(wT,wH,GH.W+wT*2),M.mdfD);
    rw.position.set(hL+wT/2,wY,0);rw.castShadow=true;G.structure.add(rw);

    // Wood grain on front wall
    for(let i=0;i<15;i++){
      const ln=new THREE.Mesh(new THREE.BoxGeometry(0.02,wH-0.1,0.002),new THREE.MeshStandardMaterial({color:0x6B4E1E,roughness:0.9}));
      ln.position.set(-hL-wT+0.4+i*0.82,wY,hW+wT+0.001);G.structure.add(ln);
    }

    // Logo on base
    new THREE.TextureLoader().load(LOGO_B64,t=>{
      const m=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshStandardMaterial({map:t,transparent:true,opacity:0.55,roughness:0.7}));
      m.rotation.x=-Math.PI/2;m.position.set(hL-0.8,GH.baseH/2+0.005,hW-0.2);G.structure.add(m);
    });

    // Glass — above the wood walls
    [hW+wT,-hW-wT].forEach(z=>{
      const g=new THREE.Mesh(new THREE.PlaneGeometry(GH.L,GH.H-soilTop),M.glass);
      g.position.set(0,soilTop+(GH.H-soilTop)/2,z);
      if(z<0)g.rotation.y=Math.PI;G.structure.add(g);
    });
    [-hL-wT,hL+wT].forEach(x=>{
      const g=new THREE.Mesh(new THREE.PlaneGeometry(GH.W,GH.H-soilTop),M.glass);
      g.position.set(x,soilTop+(GH.H-soilTop)/2,0);
      g.rotation.y=x>0?Math.PI/2:-Math.PI/2;G.structure.add(g);
    });
    const tg=new THREE.Mesh(new THREE.PlaneGeometry(GH.L+wT*2,GH.W+wT*2),M.glass);
    tg.rotation.x=-Math.PI/2;tg.position.y=GH.H;G.structure.add(tg);

    // Soil
    const soil=new THREE.Mesh(new THREE.BoxGeometry(GH.L-0.2,GH.soilH,GH.W-0.2),M.soil);
    soil.position.y=GH.baseH/2+GH.soilH/2;soil.castShadow=true;soil.receiveShadow=true;G.structure.add(soil);
    for(let i=0;i<60;i++){
      const r=0.05+Math.random()*0.14;
      const b=new THREE.Mesh(new THREE.SphereGeometry(r,6,4),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(0.06,0.45+Math.random()*0.2,0.13+Math.random()*0.09),roughness:1}));
      b.position.set(-hL+0.5+Math.random()*(GH.L-1),soilTop-0.01,-hW+0.5+Math.random()*(GH.W-1));
      b.scale.y=0.25;G.structure.add(b);
    }

    // ════════════════════════════════════════════════
    // ██ PLANTS — 2 rows × 4 = 8 big realistic plants
    // ════════════════════════════════════════════════
    const PD=[]; // physics data
    const leafMeshes=[]; // individual leaves for physics

    function mkLeaf(hue,size){
      // Realistic leaf shape using a custom geometry
      const shape=new THREE.Shape();
      const s=size;
      shape.moveTo(0,0);
      shape.bezierCurveTo(s*0.4,s*0.3, s*0.45,s*0.7, 0,s);
      shape.bezierCurveTo(-s*0.45,s*0.7, -s*0.4,s*0.3, 0,0);
      const geo=new THREE.ShapeGeometry(shape,6);
      const mat=new THREE.MeshStandardMaterial({
        color:new THREE.Color().setHSL(hue,0.65,0.28+Math.random()*0.12),
        roughness:0.55,side:THREE.DoubleSide,
      });
      const m=new THREE.Mesh(geo,mat);
      m.castShadow=true;
      return m;
    }

    function mkPlant(x,z,h){
      const g=new THREE.Group();
      const myLeaves=[];

      // Main stem
      const stemCurve=new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0.05,h*0.3,0.03),
        new THREE.Vector3(-0.03,h*0.6,-0.02),
        new THREE.Vector3(0.02,h*0.85,0.01),
        new THREE.Vector3(0,h,0),
      ]);
      const stem=new THREE.Mesh(
        new THREE.TubeGeometry(stemCurve,12,0.06,6,false),
        new THREE.MeshStandardMaterial({color:0x2d5a27,roughness:0.7})
      );
      stem.castShadow=true;g.add(stem);

      // Secondary stems branching off
      for(let b=0;b<3;b++){
        const bh=h*0.3+b*h*0.2;
        const ba=(b/3)*Math.PI*2+Math.random()*0.5;
        const bLen=0.8+Math.random()*0.6;
        const bc=new THREE.CatmullRomCurve3([
          new THREE.Vector3(0,bh,0),
          new THREE.Vector3(Math.cos(ba)*bLen*0.5,bh+0.3,Math.sin(ba)*bLen*0.5),
          new THREE.Vector3(Math.cos(ba)*bLen,bh+0.1,Math.sin(ba)*bLen),
        ]);
        const branch=new THREE.Mesh(
          new THREE.TubeGeometry(bc,8,0.035,5,false),
          new THREE.MeshStandardMaterial({color:0x356B2F,roughness:0.72})
        );
        branch.castShadow=true;g.add(branch);
      }

      // Leaves — many, distributed along stem and branches
      for(let i=0;i<18;i++){
        const lSize=0.35+Math.random()*0.35;
        const hue=0.26+Math.random()*0.1;
        const leaf=mkLeaf(hue,lSize);
        const t=0.2+Math.random()*0.75; // position along stem
        const angle=(i/18)*Math.PI*2+Math.random()*0.8;
        const rad=0.15+Math.random()*0.4;
        const ly=h*t;

        leaf.position.set(Math.cos(angle)*rad, ly, Math.sin(angle)*rad);
        leaf.rotation.set(
          -0.3+Math.random()*0.6,
          angle+Math.PI*0.5,
          -0.2+Math.random()*0.4
        );
        g.add(leaf);

        // Store leaf for individual physics
        myLeaves.push({
          mesh:leaf,
          baseRotX:leaf.rotation.x,
          baseRotY:leaf.rotation.y,
          baseRotZ:leaf.rotation.z,
          velX:0,velZ:0,
          angX:0,angZ:0,
          phase:Math.random()*Math.PI*2,
          stiff:3+Math.random()*4,
          damp:0.88+Math.random()*0.08,
          mass:0.3+Math.random()*0.5,
        });
      }

      // Top leaf cluster — crown
      for(let i=0;i<6;i++){
        const lSize=0.4+Math.random()*0.3;
        const leaf=mkLeaf(0.3+Math.random()*0.06,lSize);
        const angle=(i/6)*Math.PI*2;
        leaf.position.set(Math.cos(angle)*0.2,h+0.1+Math.random()*0.15,Math.sin(angle)*0.2);
        leaf.rotation.set(-0.5+Math.random()*0.3,angle,Math.random()*0.3);
        g.add(leaf);
        myLeaves.push({
          mesh:leaf,
          baseRotX:leaf.rotation.x,baseRotY:leaf.rotation.y,baseRotZ:leaf.rotation.z,
          velX:0,velZ:0,angX:0,angZ:0,
          phase:Math.random()*Math.PI*2,
          stiff:2.5+Math.random()*3,damp:0.9+Math.random()*0.06,mass:0.25+Math.random()*0.4,
        });
      }

      leafMeshes.push(...myLeaves);

      g.position.set(x,soilTop,z);
      G.plants.add(g);

      // Whole plant physics
      PD.push({
        mesh:g,aX:0,aZ:0,vX:0,vZ:0,
        mass:1.2+Math.random()*0.8,
        damp:0.93+Math.random()*0.04,
        stiff:1.0+Math.random()*1.5,
        wPh:Math.random()*Math.PI*2,
      });
    }

    // Exactly 2 rows × 4 plants, well spaced
    const row1Z=-1.3, row2Z=1.3;
    const plantXPositions=[-3.5,-1.2,1.2,3.5];
    plantXPositions.forEach(x=>mkPlant(x,row1Z,1.8+Math.random()*0.8));
    plantXPositions.forEach(x=>mkPlant(x,row2Z,1.8+Math.random()*0.8));

    // ════════════════════════════════════════════════
    // ██ POSTS — short, cameras
    // ════════════════════════════════════════════════
    const nzP=[],postH=2.8;
    const ppArr=[{x:-3.5,z:0},{x:0,z:0},{x:3.5,z:0}];

    ppArr.forEach((pp,idx)=>{
      const pg=new THREE.Group();
      pg.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.16,postH,12),M.pvc);m.position.y=soilTop+postH/2;m.castShadow=true;return m;})());
      pg.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,postH-0.2,8),M.wP);m.position.set(0.09,soilTop+postH/2,0);return m;})());
      for(let j=0;j<=2;j++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.18,0.03,8,16),M.pvcJ);r.position.y=soilTop+(postH/2.5)*j;r.rotation.x=Math.PI/2;pg.add(r);}
      pg.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.19,0.08,16),M.pvcJ);m.position.y=soilTop+postH;return m;})());

      // Camera
      const cg=new THREE.Group();
      cg.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.22,0.1),new THREE.MeshStandardMaterial({color:0x444444,metalness:0.7,roughness:0.3}));m.position.y=0.11;return m;})());
      cg.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.3),M.chip);m.position.y=0.32;m.castShadow=true;return m;})());
      cg.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.09,16),new THREE.MeshStandardMaterial({color:0x2a2a3a,roughness:0.2,metalness:0.7}));m.rotation.x=Math.PI/2;m.position.set(0,0.32,0.2);return m;})());
      cg.add((()=>{const m=new THREE.Mesh(new THREE.CircleGeometry(0.08,16),new THREE.MeshPhysicalMaterial({color:0x0a0a44,roughness:0,metalness:0.3,transparent:true,opacity:0.8}));m.position.set(0,0.32,0.25);return m;})());
      const rl=new THREE.Mesh(new THREE.SphereGeometry(0.02,8,8),new THREE.MeshStandardMaterial({color:0xff0000,emissive:0xff0000,emissiveIntensity:2}));rl.position.set(0.18,0.42,0.12);cg.add(rl);
      cg.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.3,6),new THREE.MeshStandardMaterial({color:0x555555,metalness:0.7}));m.position.set(-0.18,0.5,0);return m;})());
      cg.position.y=soilTop+postH;cg.rotation.y=[Math.PI*0.25,Math.PI,-Math.PI*0.25][idx];pg.add(cg);

      // Sprinklers
      [soilTop+postH*0.45,soilTop+postH*0.75].forEach(nh=>{
        pg.add((()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,10),M.wP);m.position.y=nh;return m;})());
        [0,Math.PI/2,Math.PI,Math.PI*1.5].forEach(angle=>{
          const ag=new THREE.Group();const aL=0.85;
          ag.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,aL,8),M.wP);m.rotation.z=Math.PI/2;m.position.x=aL/2;return m;})());
          ag.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.04,0.08,10),M.noz);m.position.set(aL,0.04,0);return m;})());
          ag.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.08,0.12,8),M.noz);m.position.set(aL,-0.04,0);return m;})());
          ag.add((()=>{const m=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.01,6,12),M.noz);m.position.set(aL,-0.1,0);m.rotation.x=Math.PI/2;return m;})());
          ag.position.y=nh;ag.rotation.y=angle;pg.add(ag);
          nzP.push({x:pp.x+Math.cos(angle)*aL,y:nh-0.1,z:pp.z+Math.sin(angle)*aL});
        });
      });
      pg.position.set(pp.x,0,pp.z);G.posts.add(pg);
    });

    // ════════════════════════════════════════════════
    // ██ WATER
    // ════════════════════════════════════════════════
    G.water.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(GH.L-0.5,0.9,GH.W-0.5),M.res);m.position.y=-0.6;return m;})());
    const wBody=new THREE.Mesh(new THREE.BoxGeometry(GH.L-0.8,0.6,GH.W-0.8),M.wBody);wBody.position.y=-0.65;G.water.add(wBody);
    G.water.add((()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.45,16),M.chip);m.position.set(-4,-0.35,0);return m;})());
    G.water.add(tube([new THREE.Vector3(-4,-0.1,0),new THREE.Vector3(-3.8,0.5,0),new THREE.Vector3(-3.5,soilTop-0.15,0)]));
    G.water.add(tube([new THREE.Vector3(-3.5,soilTop-0.15,0),new THREE.Vector3(0,soilTop-0.15,0),new THREE.Vector3(3.5,soilTop-0.15,0)]));

    // Spray particles
    const spGeo=new THREE.SphereGeometry(0.018,4,4);const sprays=[];
    nzP.forEach(np=>{for(let i=0;i<6;i++){const mt=new THREE.MeshBasicMaterial({color:0x66ccff,transparent:true,opacity:0.5});const p=new THREE.Mesh(spGeo,mt);p.visible=false;p.userData={ox:np.x,oy:np.y,oz:np.z,ang:Math.random()*Math.PI*2,spd:0.35+Math.random()*0.45,spr:0.18+Math.random()*0.35,ph:Math.random()*Math.PI*2};G.water.add(p);sprays.push(p);}});

    // ════════════════════════════════════════════════
    // ██ ELECTRONICS
    // ════════════════════════════════════════════════
    // ESP32
    const esp=new THREE.Group();
    esp.add(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.065,0.4),M.pcb));
    esp.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.05,0.26),M.chip);m.position.y=0.055;return m;})());
    const espLed=new THREE.Mesh(new THREE.SphereGeometry(0.022,8,8),new THREE.MeshStandardMaterial({color:0x00ff00,emissive:0x00ff00,emissiveIntensity:2.5}));
    espLed.position.set(0.07,0.08,0.13);esp.add(espLed);
    for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.007,0.007,0.07,4),M.gold);p.position.set(-0.3+i*0.043,-0.065,0.17);esp.add(p);const p2=p.clone();p2.position.z=-0.17;esp.add(p2);}
    esp.position.set(-4.8,-0.2,-2.6);G.electronics.add(esp);

    // DHT11 — visible on wall
    const dht=new THREE.Group();
    dht.add(new THREE.Mesh(new THREE.BoxGeometry(0.55,0.55,0.24),M.sBlue));
    for(let r=0;r<4;r++)for(let c=0;c<4;c++){dht.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.065,0.005),new THREE.MeshStandardMaterial({color:0x2277bb,roughness:0.3}));m.position.set(-0.1+c*0.072,0.1-r*0.072,0.122);return m;})());}
    for(let i=-1;i<=1;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.013,0.013,0.32,6),M.gold);p.position.set(i*0.1,-0.42,0);dht.add(p);}
    const dhtLed=new THREE.Mesh(new THREE.SphereGeometry(0.032,8,8),new THREE.MeshStandardMaterial({color:0x00ccff,emissive:0x00ccff,emissiveIntensity:1.5}));dhtLed.position.set(0.2,0.2,0.13);dht.add(dhtLed);
    dht.add((()=>{const c=document.createElement("canvas");c.width=128;c.height=32;const ctx=c.getContext("2d");ctx.fillStyle="#1155aa";ctx.fillRect(0,0,128,32);ctx.fillStyle="#fff";ctx.font="bold 18px sans-serif";ctx.textAlign="center";ctx.fillText("DHT11",64,22);const m=new THREE.Mesh(new THREE.PlaneGeometry(0.35,0.09),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:0.4}));m.position.set(0,-0.19,0.126);return m;})());
    dht.position.set(-hL+0.55,soilTop+1.6,hW-0.55);dht.rotation.y=0.2;G.electronics.add(dht);

    // Soil moisture sensors
    function mkMoist(x,z,ry){
      const mg=new THREE.Group();
      mg.add(new THREE.Mesh(new THREE.BoxGeometry(0.08,1.5,0.02),M.sGrey));
      mg.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.5,0.02),M.sGrey);m.position.x=0.18;return m;})());
      mg.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.48,0.28,0.1),M.pcb);m.position.set(0.09,0.9,0);return m;})());
      const led=new THREE.Mesh(new THREE.SphereGeometry(0.028,8,8),new THREE.MeshStandardMaterial({color:0x44ff44,emissive:0x22cc22,emissiveIntensity:1.5}));led.position.set(0.24,0.98,0.05);mg.add(led);
      mg.position.set(x,soilTop-0.35,z);mg.rotation.y=ry;G.electronics.add(mg);return led;
    }
    const mLed1=mkMoist(2,1.8,0);const mLed2=mkMoist(-2,-1.5,Math.PI*0.5);

    // Relay
    G.electronics.add((()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.1,0.35),new THREE.MeshStandardMaterial({color:0x0044aa,roughness:0.4}));m.position.set(-4.8,-0.1,2.3);return m;})());
    const relLed=new THREE.Mesh(new THREE.SphereGeometry(0.022,8,8),new THREE.MeshStandardMaterial({color:0xff4400,emissive:0xff4400,emissiveIntensity:2}));relLed.position.set(-4.6,0,2.3);G.electronics.add(relLed);

    // Wires
    G.electronics.add(wire([new THREE.Vector3(-4.8,-0.2,-2.6),new THREE.Vector3(-5.3,0,-0.5),new THREE.Vector3(-5.3,-0.05,1.2),new THREE.Vector3(-4.8,-0.1,2.3)],0xcc2222));
    G.electronics.add(wire([new THREE.Vector3(-4.8,-0.1,2.3),new THREE.Vector3(-4.6,-0.2,1.2),new THREE.Vector3(-4,-0.35,0)],0xcc2222));
    G.electronics.add(wire([new THREE.Vector3(2,soilTop+0.55,1.8),new THREE.Vector3(0,soilTop+0.3,0),new THREE.Vector3(-3,0,-1.5),new THREE.Vector3(-4.8,-0.2,-2.6)],0xddaa00));
    G.electronics.add(wire([new THREE.Vector3(-hL+0.55,soilTop+1.1,hW-0.55),new THREE.Vector3(-4.5,1.5,1),new THREE.Vector3(-4.8,0.3,-1),new THREE.Vector3(-4.8,-0.2,-2.6)],0x2266cc));

    // ════════════════════════════════════════════════
    // ██ LABELS
    // ════════════════════════════════════════════════
    function mkLbl(text,pos){const c=document.createElement("canvas");c.width=320;c.height=52;const ctx=c.getContext("2d");ctx.fillStyle="rgba(8,12,20,0.9)";ctx.fillRect(0,0,320,52);ctx.strokeStyle="rgba(34,197,94,0.5)";ctx.lineWidth=2;ctx.strokeRect(0,0,320,52);ctx.fillStyle="#4ade80";ctx.font="bold 18px sans-serif";ctx.textAlign="center";ctx.fillText(text,160,34);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));sp.position.copy(pos);sp.scale.set(3,0.5,1);sp.visible=false;scene.add(sp);return sp;}
    const lblSp=[
      mkLbl("📷 Câmera+Aspersor",new THREE.Vector3(-3.5,soilTop+postH+1.2,0)),
      mkLbl("📷 Câmera+Aspersor",new THREE.Vector3(0,soilTop+postH+1.2,0)),
      mkLbl("📷 Câmera+Aspersor",new THREE.Vector3(3.5,soilTop+postH+1.2,0)),
      mkLbl("⚡ ESP32",new THREE.Vector3(-4.8,0.4,-2.6)),
      mkLbl("🌡️ DHT11",new THREE.Vector3(-hL+0.55,soilTop+2.8,hW-0.55)),
      mkLbl("💧 Sensor Solo",new THREE.Vector3(2,soilTop+1.8,1.8)),
      mkLbl("💧 Reservatório",new THREE.Vector3(2,0,0)),
      mkLbl("⚙️ Bomba 5V",new THREE.Vector3(-4,0.4,0)),
    ];

    // ════════════════════════════════════════════════
    // ██ CONTROLS (orbit + zoom)
    // ════════════════════════════════════════════════
    let drag=false,pm={x:0,y:0},lTD=0;const el=renderer.domElement;
    el.addEventListener("pointerdown",e=>{drag=true;pm={x:e.clientX,y:e.clientY};});
    el.addEventListener("pointermove",e=>{if(!drag)return;sph.theta-=(e.clientX-pm.x)*0.005;sph.phi=Math.max(0.12,Math.min(Math.PI/2-0.05,sph.phi+(e.clientY-pm.y)*0.005));pm={x:e.clientX,y:e.clientY};camUp();});
    el.addEventListener("pointerup",()=>drag=false);el.addEventListener("pointerleave",()=>drag=false);
    el.addEventListener("wheel",e=>{sph.r=Math.max(6,Math.min(40,sph.r+e.deltaY*0.014));camUp();},{passive:true});
    el.addEventListener("touchstart",e=>{if(e.touches.length===1){drag=true;pm={x:e.touches[0].clientX,y:e.touches[0].clientY};}else if(e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;lTD=Math.sqrt(dx*dx+dy*dy);}},{passive:true});
    el.addEventListener("touchmove",e=>{if(e.touches.length===1&&drag){sph.theta-=(e.touches[0].clientX-pm.x)*0.005;sph.phi=Math.max(0.12,Math.min(Math.PI/2-0.05,sph.phi+(e.touches[0].clientY-pm.y)*0.005));pm={x:e.touches[0].clientX,y:e.touches[0].clientY};camUp();}else if(e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;const d=Math.sqrt(dx*dx+dy*dy);sph.r=Math.max(6,Math.min(40,sph.r+(lTD-d)*0.04));lTD=d;camUp();}},{passive:true});
    el.addEventListener("touchend",()=>drag=false);

    // ════════════════════════════════════════════════
    // ██ ANIMATION
    // ════════════════════════════════════════════════
    let t=0,iC=0,aId;const dt=0.016;

    function anim(){
      aId=requestAnimationFrame(anim);t+=dt;iC+=dt;
      if(S.current.autoRot&&!drag){sph.theta+=0.0018;camUp();}

      // Wind forces
      const wX=Math.sin(t*0.7)*0.14+Math.sin(t*1.3)*0.07+Math.sin(t*3)*0.06*Math.max(0,Math.sin(t*0.2));
      const wZ=Math.cos(t*0.5)*0.1+Math.cos(t*1.1)*0.05+Math.cos(t*2.5)*0.05*Math.max(0,Math.sin(t*0.3));

      // Whole plant spring physics
      PD.forEach(p=>{
        const fx=(wX*Math.sin(t*0.3+p.wPh))/p.mass;
        const fz=(wZ*Math.cos(t*0.4+p.wPh))/p.mass;
        p.vX+=(-p.stiff*p.aX+fx)*dt;p.vZ+=(-p.stiff*p.aZ+fz)*dt;
        p.vX*=p.damp;p.vZ*=p.damp;
        p.aX=Math.max(-0.12,Math.min(0.12,p.aX+p.vX*dt));
        p.aZ=Math.max(-0.12,Math.min(0.12,p.aZ+p.vZ*dt));
        p.mesh.rotation.x=p.aX;p.mesh.rotation.z=p.aZ;
      });

      // Individual leaf physics
      leafMeshes.forEach(lf=>{
        const lfx=(wX*1.5*Math.sin(t*2+lf.phase)+Math.sin(t*4+lf.phase)*0.08)/lf.mass;
        const lfz=(wZ*1.5*Math.cos(t*1.8+lf.phase)+Math.cos(t*3.5+lf.phase)*0.06)/lf.mass;
        lf.velX+=(-lf.stiff*lf.angX+lfx)*dt;
        lf.velZ+=(-lf.stiff*lf.angZ+lfz)*dt;
        lf.velX*=lf.damp;lf.velZ*=lf.damp;
        lf.angX=Math.max(-0.25,Math.min(0.25,lf.angX+lf.velX*dt));
        lf.angZ=Math.max(-0.25,Math.min(0.25,lf.angZ+lf.velZ*dt));
        lf.mesh.rotation.x=lf.baseRotX+lf.angX;
        lf.mesh.rotation.z=lf.baseRotZ+lf.angZ;
      });

      glow.intensity=0.3+Math.sin(t*2)*0.12;
      const iAct=S.current.irrigOn!==false;const cOn=iC%10<7;
      sprays.forEach(p=>{if(iAct&&cOn&&S.current.wVis){p.visible=true;const d=p.userData;const tt=(t*d.spd+d.ph)%1;const a=d.ang+t*0.85;const r=tt*d.spr;p.position.set(d.ox+Math.cos(a)*r,d.oy-tt*1.5,d.oz+Math.sin(a)*r);p.material.opacity=0.45*(1-tt);p.scale.setScalar(0.75+tt*0.6);}else p.visible=false;});
      wBody.material.opacity=0.32+Math.sin(t*1.4)*0.06;
      dhtLed.material.emissiveIntensity=1+Math.sin(t*3)*0.8;
      mLed1.material.emissiveIntensity=1+Math.sin(t*2.5+1)*0.8;
      mLed2.material.emissiveIntensity=1+Math.sin(t*2.5+2)*0.8;
      relLed.material.emissiveIntensity=1.5+Math.sin(t*4)*1;
      espLed.material.emissiveIntensity=2+Math.sin(t*3.5)*1.5;
      renderer.render(scene,camera);
    }
    anim();

    function onR(){const w=box.clientWidth,h=box.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
    window.addEventListener("resize",onR);
    S.current={...S.current,G,lblSp,irrigOn:true,autoRot:false,wVis:true};
    setReady(true);
    return()=>{cancelAnimationFrame(aId);window.removeEventListener("resize",onR);renderer.dispose();if(box.contains(renderer.domElement))box.removeChild(renderer.domElement);};
  },[]);

  useEffect(()=>{if(S.current.G)S.current.irrigOn=irrigOn;},[irrigOn]);
  useEffect(()=>{if(S.current.G)S.current.autoRot=autoRot;},[autoRot]);
  useEffect(()=>{if(!S.current.G)return;const g=S.current.G;const sh=(s,p,po,w,e)=>{g.structure.visible=!!s;g.plants.visible=!!p;g.posts.visible=!!po;g.water.visible=!!w;g.electronics.visible=!!e;S.current.wVis=!!w;};if(view==="all")sh(true,true,true,true,true);else if(view==="structure")sh(true,true,true,false,false);else if(view==="irrigation")sh(true,false,true,true,false);else if(view==="electronics")sh(true,false,true,false,true);},[view]);
  useEffect(()=>{if(S.current.lblSp)S.current.lblSp.forEach(s=>s.visible=lbls);},[lbls]);
  useEffect(()=>{const iv=setInterval(()=>{setStats({temp:+(24+Math.sin(Date.now()*0.0003)*3).toFixed(1),hum:Math.round(70+Math.sin(Date.now()*0.0002+1)*8),soil:Math.round(55+Math.sin(Date.now()*0.00025+2)*12),ai:+(0.88+Math.sin(Date.now()*0.00015)*0.07).toFixed(2)});},1500);return()=>clearInterval(iv);},[]);

  const pill=a=>({background:a?"rgba(34,197,94,0.12)":"rgba(12,20,35,0.88)",backdropFilter:"blur(14px)",border:`1px solid ${a?"#22c55e":"rgba(34,197,94,0.12)"}`,borderRadius:9,padding:"8px 14px",color:a?"#4ade80":"#8494a8",fontSize:11,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all 0.2s",outline:"none"});
  const zoomBtn={width:40,height:40,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,cursor:"pointer",border:"1px solid rgba(34,197,94,0.25)",background:"rgba(12,20,35,0.88)",backdropFilter:"blur(14px)",color:"#4ade80",transition:"all 0.2s",outline:"none"};

  return(<div style={{width:"100%",height:"100vh",position:"relative",overflow:"hidden",background:"#070b12",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
    <div ref={mountRef} style={{position:"absolute",inset:0}}/>

    <div style={{position:"absolute",top:0,left:0,right:0,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:"linear-gradient(180deg,rgba(7,11,18,0.88) 0%,transparent 100%)",zIndex:10,pointerEvents:"none"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,}}>
      </div>
      <div style={{display:"flex",gap:8,pointerEvents:"auto",flexWrap:"wrap",justifyContent:"flex-end", marginTop: 40}}>
        {[{l:"Temperatura",v:`${stats.temp}°C`,c:"#f97316"},{l:"Umidade Ar",v:`${stats.hum}%`,c:"#38bdf8"},{l:"Umidade Solo",v:`${stats.soil}%`,c:"#4ade80"},{l:"IA",v:`${stats.ai}`,c:"#a78bfa"},{l:"Status",v:"● ON",c:"#22c55e"}].map((s,i)=>(
          <div key={i} style={{background:"rgba(12,20,35,0.88)",backdropFilter:"blur(12px)",border:"1px solid rgba(34,197,94,0.1)",borderRadius:10,padding:"7px 12px",minWidth:62,textAlign:"center"}}>
            <div style={{fontSize:7,textTransform:"uppercase",letterSpacing:1,color:"#5a6a7a",marginBottom:2}}>{s.l}</div>
            <div style={{fontSize:13,fontWeight:600,color:s.c,fontVariantNumeric:"tabular-nums"}}>{s.v}</div>
          </div>))}
      </div>
    </div>

    {/* ZOOM BUTTONS — right side */}
    <div style={{position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",zIndex:12,display:"flex",flexDirection:"column",gap:8,pointerEvents:"auto"}}>
      <button onClick={()=>doZoom(-1)} style={zoomBtn} title="Zoom In">+</button>
      <button onClick={()=>doZoom(1)} style={zoomBtn} title="Zoom Out">−</button>
    </div>

    {/* BOTTOM */}
    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"flex-end",background:"linear-gradient(0deg,rgba(7,11,18,0.88) 0%,transparent 100%)",zIndex:10,pointerEvents:"none"}}>
      <div style={{display:"flex",flexDirection:"column",gap:5,pointerEvents:"auto"}}>
        {VIEWS.map(v=><button key={v.id} onClick={()=>setView(v.id)} style={pill(view===v.id)}><span style={{width:6,height:6,borderRadius:"50%",background:view===v.id?"#22c55e":"#2a3a4a",boxShadow:view===v.id?"0 0 6px rgba(34,197,94,0.6)":"none",transition:"all 0.2s"}}/>{v.icon} {v.label}</button>)}
        <div style={{height:3}}/>
        {[{l:"💧 Irrigação",a:irrigOn,fn:()=>setIrrigOn(!irrigOn)},{l:"🔄 Auto Rotação",a:autoRot,fn:()=>setAutoRot(!autoRot)},{l:"🏷️ Rótulos 3D",a:lbls,fn:()=>setLbls(!lbls)}].map((b,i)=><button key={i} onClick={b.fn} style={pill(b.a)}>{b.l}</button>)}
      </div>
      <div style={{pointerEvents:"auto",background:"rgba(12,20,35,0.88)",backdropFilter:"blur(14px)",border:"1px solid rgba(34,197,94,0.1)",borderRadius:13,padding:"14px 18px",maxWidth:280}}>
        <div style={{fontSize:11,fontWeight:600,color:"#4ade80",letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>📐 Dimensões</div>
        <div style={{fontSize:11,color:"#8494a8",marginBottom:10}}>{["120cm","60cm","60cm"].map((d,i)=><span key={i}><span style={{display:"inline-block",background:"rgba(34,197,94,0.1)",color:"#4ade80",padding:"2px 6px",borderRadius:4,fontSize:9.5,fontWeight:600,margin:"0 2px"}}>{d}</span>{i<2?" × ":""}</span>)}</div>
        <div style={{fontSize:11,fontWeight:600,color:"#4ade80",letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>🔧 Componentes</div>
        <div style={{fontSize:10.5,color:"#8494a8",lineHeight:1.75}}>
          {["2 fileiras × 4 plantas realistas","3× Postes PVC c/ câmera + aspersores","ESP32 c/ módulo Wi-Fi","🌡️ DHT11 — visível na parede","💧 Sensor solo ×2 — visível","Bomba 5V + Relé","Reservatório 2–5L","Paredes MDF externas"].map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:4,height:4,borderRadius:"50%",background:"#22c55e",flexShrink:0}}/>{item}</div>)}
        </div>
      </div>
    </div>

    {irrigOn&&<div style={{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,alignItems:"center",zIndex:10,background:"rgba(12,20,35,0.82)",backdropFilter:"blur(12px)",border:"1px solid rgba(56,189,248,0.2)",padding:"6px 13px",borderRadius:18,fontSize:10.5,color:"#38bdf8"}}><span style={{width:7,height:7,borderRadius:"50%",background:"#38bdf8",animation:"pulse 2s ease-in-out infinite"}}/>Aspersores ativos</div>}
    {!ready&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#070b12",zIndex:100}}><div style={{textAlign:"center"}}><div style={{fontSize:30,marginBottom:10}}>🌱</div><div style={{color:"#4ade80",fontSize:13,fontWeight:600,letterSpacing:2}}>INOVATECH</div><div style={{color:"#5a6a7a",fontSize:10.5,marginTop:3}}>Carregando modelo 3D...</div></div></div>}
    <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}`}</style>
  </div>);
}