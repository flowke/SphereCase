// const THREE = require('three-js')([
//     'TrackballControls',
//     'ExplodeModifier',
//     'CanvasRenderer',
//     'Projector'
// ]);
const parseModel = require('util/parseModel');
const sphereModel = require('static/model/sphere.json');
const ExtrudedIcosphere = require('util/geo');
const ExtrudedMaterial = require('util/material');
// require('vendor/TrackballControls');
let sceneWidth = window.innerWidth,
    sceneHeight = window.innerHeight;

module.exports = {

    initRenderer(){
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('sphere').appendChild(renderer.domElement);
        renderer.setClearColor(0xffffff, 0.0);
        renderer.shadowMap.enabled = true; //允许阴影映射
        return renderer;
    },
    canvasRender(){
        let renderer = new THREE.CanvasRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

        document.getElementById('sphere').appendChild(renderer.domElement);
        return renderer;
    },

    initCamera( ){
        let camera = new THREE.PerspectiveCamera(45,sceneWidth / sceneHeight ,0.1,1000 );
        let view = 10
        // let camera = new THREE.OrthographicCamera( -1*view, view, view, view*-1, 1, 100);
        let trackballControls = new THREE.TrackballControls(camera);

        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.0;
        trackballControls.panSpeed = 1.0;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 8;
        // camera.up.set(0,1,0);
        camera.lookAt({x:0,y:0,z:0});
        // camera.position.z = 5;
        return {camera,trackballControls};
    },

    initLight(){
        let ambLight = new THREE.AmbientLight(0xffffff, 0.2);

        // let HemisphereLight = new THREE.HemisphereLight( 0x7d5252, 0x222233 );
        // let HemisphereLightHelper = new THREE.HemisphereLightHelper( HemisphereLight, 5 );

        let mainLight = new THREE.SpotLight(0xffffff , 1 );
        mainLight.position.set(1,4,2);
        // mainLight.castShadow = true;
        var pointLightHelper = new THREE.PointLightHelper( mainLight, 2 );

        let dL1 = new THREE.DirectionalLight( mainLight, 0.8 );

        dL1.position.set(1,1,1);

        let fillLight = new THREE.SpotLight(0xffffff, 0.7);
        fillLight.position.set(-3,-2, 1)
        let fillLightHelper = new THREE.PointLightHelper( fillLight, 1 )

        let f2 = fillLight.clone();
        f2.position.set(-3,2,0)

        return [
            ambLight,
            mainLight,
            // pointLightHelper,
            dL1,
            fillLight,
            // fillLightHelper,
            f2
            // HemisphereLightHelper,
            // HemisphereLight
        ];
    },

    initSmallSphereScene(scene2){

        // let scene2 = new THREE.Scene();


        let normalIco1 = this.getNormalIco(1,1,0x7221d7)
        scene2.add(normalIco1);
        normalIco1.position.set(5,-3,-2)

        let normalIco2 = this.getNormalIco(1,2,0x12587a)
        scene2.add(normalIco2);
        normalIco2.position.set(10,-3,-16);

        let normalIco3 = this.getNormalIco(1.8,2,0xff79d1)
        scene2.add(normalIco3);
        normalIco3.position.set(-8,7,-10);

        return { normalIco1, normalIco3 }


    },

    loadModel(url, cb){
        let loader = new THREE.JSONLoader();
        loader.load(url,cb);
        return loader;
    },

    getSphereGeometry( ) {
        return parseModel(sphereModel, 1);
    },

    createMesh(geo, material, castShadow){
        let mesh = new THREE.Mesh(
            geo,
            material
        );
        mesh.castShadow = castShadow || true;
        return mesh;
    },
    getPiecesMesh(geo, castShadow){
        let meshes = [];
        geo.center()
        let geoPoints = geo.vertices,
            geoFaces = geo.faces;

        geoFaces.forEach((elt,i)=>{
            let piece = new THREE.Geometry();
            piece.vertices = [
                geoPoints[elt.a].clone(),
                geoPoints[elt.b].clone(),
                geoPoints[elt.c].clone()
            ];
            piece.faces = [new THREE.Face3(0,1,2)];

            // piece.normalize();
            piece.computeFaceNormals();

            let va = piece.vertices[0];
            let vb = piece.vertices[1];
            let vc = piece.vertices[2];

            let vmx = (va.x + vb.x + vc.x) / 3;
            let vmy = (va.y +  vb.y + vc.y) / 3;
            let vmz = (va.z + vb.z + vc.z) / 3;



            // piece.center();
            // let texture = markFaces(i);
            let mesh = new THREE.Mesh( piece, new THREE.MeshPhongMaterial({
                color: 0xfc475b,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide,
                // wireframe: true
             }) )
             mesh.faceCenter = new THREE.Vector3(vmx, vmy, vmz);
             mesh.faceCenter.normalize();
             let parent = new THREE.Group();

             parent.position.x = vmx;
             parent.position.y = vmy;
             parent.position.z = vmz;
            //  parent.add(mesh);
            //  console.log(parent)
            mesh.scale.set(0.001,0.001,0.001)

            meshes.push( mesh );
        });
        return meshes;

    },
    getIcosphere(){
        let geo = new THREE.IcosahedronGeometry(2, 2);
        let center = new THREE.Vector3(0, 0, 0)
        geo.normalize()
        geo.center()



        var explodeModifier = new THREE.ExplodeModifier();
        explodeModifier.modify( geo );

        let faces = geo.faces;

        let colors = new Float32Array(faces.length*3*3);
        let faceCenters = new Float32Array(faces.length*3*3);
        let displacement = new Float32Array( faces.length * 3 * 3 );

        let color = new THREE.Color(0xfc778b);

        faces.forEach((face,indx)=>{
            let va = geo.vertices[face.a];
            let vb = geo.vertices[face.b];
            let vc = geo.vertices[face.c];
            let vmx = (va.x + vb.x + vc.x) / 3;
            let vmy = (va.y +  vb.y + vc.y) / 3;
            let vmz = (va.z + vb.z + vc.z) / 3;

            var d = 0.5 * ( 0.5 - Math.random() );

            for(let i=0; i<3; i++){
                faceCenters[indx+(3*i)] = vmx + center.x;
                faceCenters[indx+(3*i) + 1] = vmy + center.y;
                faceCenters[indx+(3*i) + 2] = vmz + center.z;

                displacement[ indx + ( 3 * i )     ] = d;
                displacement[ indx + ( 3 * i ) + 1 ] = d;
                displacement[ indx + ( 3 * i ) + 2 ] = d;

                colors[ indx + ( 3 * i )     ] = color.r;
                colors[ indx + ( 3 * i ) + 1 ] = color.g;
                colors[ indx + ( 3 * i ) + 2 ] = color.b;
            }
        });

        let bfGeo = new THREE.BufferGeometry().fromGeometry( geo )
        console.log(colors)

        bfGeo.addAttribute('faceCenters', new THREE.BufferAttribute(faceCenters, 3));
        bfGeo.addAttribute('displacement', new THREE.BufferAttribute(displacement, 3));
        bfGeo.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );

        let uniforms = {
            amplitude: {value:0.0}
        }

        let mat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        });


        let mesh = new THREE.Mesh(geo, mat);
        // mesh.rotateY(Math.PI);
        return {mesh, uniforms};
    },
    getIco(r, d){
        return new THREE.IcosahedronGeometry(r,d);
    },
    getNormalIco(r,d, color){
        let geo = new THREE.IcosahedronGeometry(r,d);
        let mesh = new THREE.Mesh( geo, new THREE.MeshPhongMaterial({
            color: color,
            shading: THREE.FlatShading,
            // wireframe: true
        }) );
        return mesh;

    },
    toPiecesGeometry(geo){

    },
    extrudeGeometry(shap){
        return new THREE.ExtrudeGeometry();
    },
    makeShapes(points){
        console.log(points[0])
        let shape =  new THREE.Shape(points[0],points[1],points[2]);
    },
    getSphere(){
        let center = new THREE.Vector3(0,0,0);

        let extIco = new ExtrudedIcosphere(center);
        let material = new ExtrudedMaterial(center);

        let mesh = new THREE.Mesh(extIco, material.material);
        return {mesh  , material}
    },
    createRay(){
        return new THREE.Raycaster();
    }

}

function markFaces(i){
    let canvas = document.createElement('canvas');
    canvas.width=128;
    canvas.height=128;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b68431';
    ctx.fillText(i.toString, 1, 1, 1);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}
