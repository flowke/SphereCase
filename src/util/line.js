
const base = require('util/basicComponent.js');
const TWEEN = require('tween.js');
const tool = require('util/tool');
var r = 490;
let f_icoVec = base.getIco(r,2).vertices;
var group;
var container, controls, stats;
var particlesData = [];
var camera, scene, renderer;
var positions, colors;
var particles;
var pointCloud;
var particlePositions;
var linesMesh;

var particleCount = f_icoVec.length;

var rHalf = 60;
let seed =  1;
let oriPositions;
var effectController = {
    showDots: true,
    showLines: true,
    minDistance: 220,
    limitConnections: true,
    maxConnections: 50,
    particleCount: f_icoVec.length
};

let sceneWidth = window.innerWidth>1200 ? window.innerWidth : 1200,
    sceneHeight = 822;

var maxParticleCount = f_icoVec.length;
// particleCount = effectController.particleCount;


init();
animate();
// render();
function initGUI() {
    var gui = new dat.GUI();
    gui.add( effectController, "showDots" ).onChange( function( value ) { pointCloud.visible = value; } );
    gui.add( effectController, "showLines" ).onChange( function( value ) { linesMesh.visible = value; } );
    gui.add( effectController, "minDistance", 10, 300 );
    gui.add( effectController, "limitConnections" );
    gui.add( effectController, "maxConnections", 0, 30, 1 );
    gui.add( effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( function( value ) {
        particleCount = parseInt( value );
        particles.setDrawRange( 0, particleCount );
    });
}

function init() {
    // initGUI();
    container = document.getElementById('lineSphere');
    //
    camera = new THREE.PerspectiveCamera( 45, sceneWidth / sceneHeight, 1000, 1800 );
    camera.position.z = 1750;
    // controls = new THREE.OrbitControls( camera, container );
    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add( group );

    // scene.fog = new THREE.Fog(0xffffff, 1400, 1900)

    // var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
    // helper.material.color.setHex( 0x080808 );
    // helper.material.blending = THREE.AdditiveBlending;
    // helper.material.transparent = true;
    // group.add( helper );


    // var segments = maxParticleCount * maxParticleCount;
    let segments = f_icoVec.length*f_icoVec.length;

    positions = new Float32Array( segments * 3 );
    colors = new Float32Array( segments * 3 );
    var pMaterial = new THREE.PointsMaterial( {
        color: 0xFFFFFF,
        size: 5,
        opacity: 0.4,
        // blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    } );
    particles = new THREE.BufferGeometry();



    particlePositions = new Float32Array( maxParticleCount * 3 );
    oriPositions = new Float32Array( maxParticleCount * 3 )
    for ( var i = 0; i < f_icoVec.length; i++ ) {
        var x = f_icoVec[i].x;
        var y = f_icoVec[i].y;
        var z = f_icoVec[i].z;
        particlePositions[ i * 3     ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;

        oriPositions[ i * 3     ] = x;
        oriPositions[ i * 3 + 1 ] = y;
        oriPositions[ i * 3 + 2 ] = z;

        // add it to the geometry

        particlesData.push( {
            velocity: new THREE.Vector3( -1 + Math.random()*seed, -1 + Math.random()*seed,  -1 + Math.random()*seed ),
            numConnections: 0
        } );
    }
    particles.setDrawRange( 0, particleCount );
    particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );
    // create the particle system
    pointCloud = new THREE.Points( particles, pMaterial );
    group.add( pointCloud );
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
    geometry.computeBoundingSphere();
    geometry.setDrawRange( 0, 0 );
    var material = new THREE.LineBasicMaterial( {
        // vertexColors: THREE.VertexColors,
        // blending: THREE.AdditiveBlending,
        opacity: 0.4,
        transparent: true,
        // sizeAttenuation: true,
        linewidth: 3
    } );
    linesMesh = new THREE.LineSegments( geometry, material );
    group.add( linesMesh );
    // group.scale.set(0.8,0.8,0.8)
    // group.visible = false;
    //
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( sceneWidth, sceneHeight );
    renderer.setClearColor(0x000000, 0.0);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    //
    // stats = new Stats();
    // container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );


}



function onWindowResize() {
    let w = window.innerWidth;

    if(w<1200){
        return;
    }

    camera.aspect = w / 822;
    camera.updateProjectionMatrix();
    renderer.setSize( w, 822 );
}

function animate() {

    var vertexpos = 0;
    var colorpos = 0;
    var numConnected = 0;
    for ( var i = 0; i < particleCount; i++ )
    particlesData[ i ].numConnections = 0;
    for ( var i = 0; i < particleCount; i++ ) {
        // get the particle
        let f_r1 = -1 + Math.random() * seed,
            f_r2 = -1 + Math.random() * seed,
            f_r3 = -1 + Math.random() * seed;
        var particleData = particlesData[i];

        let f_p1 = particlePositions[ i * 3     ];
        let f_p2 = particlePositions[ i * 3 +1    ];

        if( f_p2 < -240 ){
            particlePositions[ i * 3     ] += particleData.velocity.x;
            particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
            particlePositions[ i * 3 + 2 ] += particleData.velocity.z;
        }



        let f_dy = particlePositions[ i * 3 + 1 ] - oriPositions[i * 3 + 1];
        let f_dx = particlePositions[ i * 3 ] - oriPositions[ i * 3 ];
        let f_dz = particlePositions[ i * 3 + 2 ] - oriPositions[ i * 3 +2 ];

        if ( f_dx > rHalf || f_dx < -rHalf )
        particleData.velocity.y = -particleData.velocity.y;
        if ( f_dx < -rHalf || f_dx > rHalf )
        particleData.velocity.x = -particleData.velocity.x;
        if ( f_dz < -rHalf || f_dz > rHalf )
        particleData.velocity.z = -particleData.velocity.z;
        if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
        continue;
        // Check collision
        for ( var j = i + 1; j < particleCount; j++ ) {
            var particleDataB = particlesData[ j ];
            if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
            continue;
            var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
            var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
            var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
            var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );
            if ( dist < effectController.minDistance ) {
                particleData.numConnections++;
                particleDataB.numConnections++;
                var alpha = 1.0 - dist / effectController.minDistance;
                positions[ vertexpos++ ] = particlePositions[ i * 3     ];
                positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
                positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];
                positions[ vertexpos++ ] = particlePositions[ j * 3     ];
                positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
                positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];
                colors[ colorpos++ ] = alpha;
                colors[ colorpos++ ] = alpha;
                colors[ colorpos++ ] = alpha;
                colors[ colorpos++ ] = alpha;
                colors[ colorpos++ ] = alpha;
                colors[ colorpos++ ] = alpha;
                numConnected++;
            }
        }
    }
    linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame( animate );
    // stats.update();

    render();

}
group.position.z = -600;

setTimeout(elt=>{
    scaLine();
}, 200)

// scaLine();

function scaLine(){
    let start = {
        z: -600
    }
    let end = {
        z: 0
    }
    new TWEEN.Tween(start)
        .to(end, 2300)
        .easing(TWEEN.Easing.Exponential.InOut)
        .onUpdate(function(){

            group.position.z = this.z;

        })
        .start();
}


function render() {


    group.rotation.y -= 0.003;
    renderer.render( scene, camera );
}
