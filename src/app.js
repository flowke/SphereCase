// const THREE = require('three-js')();
const base = require('util/basicComponent.js');
const TWEEN = require('tween.js');
const tool = require('util/tool');
let line = require('util/line');

const fontUpdate = require('module/sphereFont');
// const fontUpdate = require('module/cssFontSphere');
const module = require('module/fontEmitter');

let sceneWidth = window.innerWidth,
    sceneHeight = window.innerHeight;

// 建立场景
let scene = new THREE.Scene();


// 建立相机
let {camera, trackballControls} = base.initCamera();
// 建立渲染器
let renderer = base.initRenderer();
// 灯光
let lights = base.initLight();
tool.sceneAdd(scene, lights);

let ray = base.createRay();
let mouse = tool.setMouse(-sceneHeight/2, sceneHeight/2);
// 网格模型

let icoMeshes = base.getPiecesMesh(base.getIco(2,2));
tool.sceneAdd(scene, icoMeshes);

let {normalIco1,normalIco3} = base.initSmallSphereScene(scene);
// let normalIco = base.getNormalIco(1,1,#000000)

// let {mesh: extIco , material} = base.getSphere();

// scene.add(extIco)
// let facesGroup = tool.makeFacesGroup(base.getIco());
// let {lineScene, lineRenderer} = makeLineSphere();


//


// let {mesh: bfMesh, uniforms} = base.getIcosphere()

// scene.add(bfMesh)


// tool.sceneAdd(scene, tool.markFaces(facesGroup));
// let originFacesPosition = tool.originFacesPosition(facesGroup);
//
// tool.resetPoint(facesGroup);
//
// let face = facesGroup[15];



// 把对象添加到场景



function icoRotation(meshes){
    meshes.forEach((elt)=>{
        elt.rotation.y += 0.005;
        elt.rotation.x -= 0.005;
        elt.rotation.z -= 0.005;
    })
}


function perPieceAnimate(mesh){

    let center = mesh.faceCenter;
    let start = {
        rotation: Math.PI*0.5,
        scale: 0
    };

    let end = {
        rotation: 0,
        scale: 1
    }

    new TWEEN.Tween(start)
        .to(end, 2000)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function(){
            // mesh.setRotationFromAxisAngle( center, this.rotation );
            // mesh.rotation.z = this.rotation
            mesh.scale.set(this.scale, this.scale, this.scale);
            // mesh.position.z = this.position
        })
        .start();
}

function resetIcoMeshes(){
    icoMeshes.forEach((elt)=>{
        elt.scale.x = 0;
        elt.scale.y = 0;
        elt.scale.z = 0;
    })
}
// resetIcoMeshes();

function piecesAnimate(meshes){


    meshes.forEach((elt,i)=>{
        setTimeout(()=>{
            perPieceAnimate(elt);
        }, i*16)

    })

}
piecesAnimate(icoMeshes)


let clock = new THREE.Clock();

function onWindowResize( event ) {
	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(){
    requestAnimationFrame(animate);

    render();

}

let time = 0;

function render(){
    let delta = clock.getDelta();
    trackballControls.update(delta);
    icoRotation(icoMeshes);
    TWEEN.update();

    normalIco1.position.x += Math.sin(time++/175)/180
    normalIco1.position.z += Math.sin(time++/275)/220
    normalIco3.position.y += Math.cos(time++/185)/250

    fontUpdate();
    renderer.render(scene, camera);
}
// render();
animate();

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
