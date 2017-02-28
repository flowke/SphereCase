// const THREE = require('three-js')();
const base = require('util/basicComponent.js');
const TWEEN = require('tween.js');
const tool = require('util/tool');
let line = require('util/line');

// const fontUpdate = require('module/sphereFont');
// const fontUpdate = require('module/cssFontSphere');
const module = require('module/fontEmitter')

let sceneWidth = window.innerWidth,
    sceneHeight = window.innerHeight;

// 建立场景
let scene = new THREE.Scene();


// 建立相机
let {camera} = base.initCamera();
// 建立渲染器
let renderer = base.initRenderer();
// 灯光
let lights = base.initLight();

tool.sceneAdd(scene, lights);

// 网格模型


let icoMesh = base.getNormalIco(2,2, 0xfc475b);

icoMesh.scale.set(0.001,0.001,0.001)

scene.add(icoMesh);

let {normalIco1,normalIco3} = base.initSmallSphereScene(scene);

let normalIco = base.getNormalIco(1,1,0x000000);




function sphereBounceAni(mesh){
    let start = {
        scale: 0
    };

    let end = {
        scale: 0.5
    }

    let t1 = new TWEEN.Tween(start)
        .to(end, 600)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(function(){

            icoMesh.scale.x = this.scale;
            icoMesh.scale.y = this.scale;
            icoMesh.scale.z = this.scale;
        })


    let t2 = new TWEEN.Tween({s:0.5})
        .to({s:1}, 1500)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(function(){
            let {s} = this;

            icoMesh.scale.set(s,s,s)
        })

    t1.chain(t2);
    t1.start();

}
sphereBounceAni(icoMesh);


function icoRotate(mesh){
    mesh.rotation.y -= 0.002;
    mesh.rotation.x -= 0.002;
    mesh.rotation.z -= 0.002;
}


function animate(){
    requestAnimationFrame(animate);

    render();

}

let time = 0;

function render(){

    icoRotate(icoMesh);
    TWEEN.update();
    normalIco1.position.x += Math.sin(time++/175)/180;
    normalIco1.position.z += Math.sin(time++/275)/220;
    normalIco3.position.y += Math.cos(time++/185)/250;

    renderer.render(scene, camera);
}


animate();
 window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    let w = window.innerWidth;

    if(w<1200){
        return;
    }

    camera.aspect = w / 822;
    camera.updateProjectionMatrix();
    renderer.setSize( w, 822 );
}
