
let sceneWidth = window.innerWidth>1200 ? window.innerWidth : 1200,
    sceneHeight = 822;

module.exports = {

    initRenderer(){
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(sceneWidth, sceneHeight);
        document.getElementById('sphere').appendChild(renderer.domElement);
        renderer.setClearColor(0xffffff, 0.0);
        // renderer.shadowMap.enabled = true; //允许阴影映射
        return renderer;
    },
    initCamera( ){
        let camera = new THREE.PerspectiveCamera(45,sceneWidth / sceneHeight ,0.1,1000 );
        let view = 10;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 8;
        // camera.up.set(0,1,0);
        camera.lookAt({x:0,y:0,z:0});
        // camera.position.z = 5;
        return {camera};
    },

    initLight(){
        let ambLight = new THREE.AmbientLight(0xffffff, 0.2);

        // let HemisphereLight = new THREE.HemisphereLight( 0x7d5252, 0x222233 );
        // let HemisphereLightHelper = new THREE.HemisphereLightHelper( HemisphereLight, 5 );

        let mainLight = new THREE.SpotLight(0xffffff , 1 );
        mainLight.position.set(1,4,2);
        // mainLight.castShadow = true;ff

        let dL1 = new THREE.DirectionalLight( 0xffffff, 0.8 );
        dL1.position.set(1,1,1);

        let dl2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
        dl2.position.set(1,-1,1);

        let fillLight = new THREE.SpotLight(0xffffff, 0.7);
        fillLight.position.set(-3,-2, 1)

        let f2 = fillLight.clone();
        f2.position.set(-3,2,0)

        return [
            ambLight,
            mainLight,
            dL1,
            fillLight,
            f2,
            dl2
        ];
    },
    initSmallSphereScene(scene2){

        // let scene2 = new THREE.Scene();


        let normalIco1 = this.getNormalIco(1,1,0x7221d7)
        scene2.add(normalIco1);
        normalIco1.position.set(5,-3,-2)

        let normalIco2 = this.getNormalIco(2,2,0x186b94)
        scene2.add(normalIco2);
        normalIco2.position.set(-12,-5,-22);

        let normalIco3 = this.getNormalIco(1.8,2,0xff79d1)
        scene2.add(normalIco3);
        normalIco3.position.set(-8,7,-10);

        return { normalIco1, normalIco3 }


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

    }


}
