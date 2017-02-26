 const tool = require('util/tool');
 const base = require('util/basicComponent.js');

var group;
var container, controls, stats;
var particlesData = [];
var camera, scene, renderer;
var positions, colors;
var particles;
var pointCloud;
var particlePositions;
var linesMesh;
var maxParticleCount = 100;
var particleCount = 50;
var r = 3;
var rHalf = r / 2;

var effectController = {
        showDots: false,
        showLines: false,
        minDistance: 1,
        limitConnections: false,
        maxConnections: 2,
        particleCount: 10
    };

function sss (){

        let lineScene = new THREE.Scene();
        let lineRenderer = new THREE.CanvasRenderer();
        lineRenderer.setPixelRatio( window.devicePixelRatio );
        lineRenderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( lineRenderer.domElement );

        let PI2 = Math.PI*2;
        let particle;
        let material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff,
            program: function(context){
                context.beginPath();
                context.arc(0,0,0.2, 0, PI2, true);
                context.fill();
            }
        });
        let facesGroup = tool.makeFacesGroup(base.getIco());
        facesGroup.forEach((elt)=>{

            for(let i=0; i<elt.length-1; i++){
                for(let j=i+1; j<elt.length; j++){

                    let p1 = new THREE.Sprite(material);
                    p1.position.x = elt[i].x;
                    p1.position.y = elt[i].y;
                    p1.position.z = elt[i].z;
                    p1.position.normalize();
                    p1.position.multiplyScalar(40 );
                    lineScene.add(p1);


                    let p2 = new THREE.Sprite(material);
                    p2.position.x = elt[j].x;
                    p2.position.y = elt[j].y;
                    p2.position.z = elt[j].z;
                    p2.position.normalize();
                    p2.position.multiplyScalar(40 );
                    lineScene.add(p2);


                    let geo = new THREE.Geometry();
                    geo.vertices.push(p1.position, p2.position);
                    let line = new THREE.Line(geo, new THREE.LineBasicMaterial({
                        color: 0xffffff,
                        opacity: 0.5
                    }))
                    lineScene.add(line);
                }
            }

        });

        return {lineScene, lineRenderer}

    }


function cccc(scene){
    let geo = new base.getIco(2.1,1);

    scene.fog = new THREE.Fog(0xd4d4d4, 8, 20)


    let bfGeo = new THREE.BufferGeometry().fromGeometry( geo );

    let mat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: THREE.VertexColors,
        color: 0x252525
    });

    let points = new THREE.Points(bfGeo, mat);

    let object = new THREE.Object3D();
    object.add(points);

    object.add(new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
        color: 0x616161,
        emissive: 0xa1a1a1,
        wireframe: true,
        fog: 1
    })))

    scene.add(object);

}

module.exports = {
    init,
    animate,
    group,
    scene,
    camera
}
function init(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 1750;

    group = new THREE.Group();
    scene.add( group );
    let segments = maxParticleCount * maxParticleCount;

    positions = new Float32Array( segments * 3 );
    colors = new Float32Array( segments * 3 );

    let pMaterial = new THREE.PointsMaterial( {
        color: 0xFFFFFF,
        size: 0.3,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
    } );

    particles = new THREE.BufferGeometry();
    particlePositions = new Float32Array(maxParticleCount*3);

    for(let i=0; i<maxParticleCount; i++){
        var x = Math.random() * r - r / 2;
        var y = Math.random() * r - r / 2;
        var z = Math.random() * r - r / 2;
        particlePositions[ i * 3     ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;
        // add it to the geometry
        particlesData.push( {
            velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
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
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        transparent: true
    } );
    linesMesh = new THREE.LineSegments( geometry, material );
    group.add( linesMesh );

}

function animate() {
    var vertexpos = 0;
    var colorpos = 0;
    var numConnected = 0;
    for ( var i = 0; i < particleCount; i++ )
    particlesData[ i ].numConnections = 0;
    for ( var i = 0; i < particleCount; i++ ) {
        // get the particle
        var particleData = particlesData[i];
        particlePositions[ i * 3     ] += particleData.velocity.x;
        particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
        particlePositions[ i * 3 + 2 ] += particleData.velocity.z;
        if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
        particleData.velocity.y = -particleData.velocity.y;
        if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
        particleData.velocity.x = -particleData.velocity.x;
        if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
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

}
