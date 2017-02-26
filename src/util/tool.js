// const THREE = require('three-js')();
module.exports = {

    makeFacesGroup(geo){
        let faces = geo.faces;
        let vertices = geo.vertices;

        let facesGroup = [];
        faces.forEach((elt)=>{
            let arr = [];
            arr.normal = elt.normal;
            arr.push(vertices[elt.a], vertices[elt.b], vertices[elt.c]);
            facesGroup.push(arr);
        });

        return facesGroup;
    },
    meshsToFacesGroup(meshes){
        return meshes.map((mesh)=>{
            let arr = mesh.geometry.vertices.slice();
            arr.normal = mesh.geometry.faces[0].normal;
            return arr;
        })
    },

    originFacesPosition(facesGroup){

        return facesGroup.map((elt)=>{
            return elt.map((elt)=>{
                return elt.clone();
            });

        });
    },

    resetPoint(facesGroup){
        facesGroup.forEach((elt,i,self)=>{
            let {x,y,z} = elt.center;

            elt.forEach((elt,i,self)=>{
                elt.set(x,y,z)
            })
        })
    },

    markFaces(meshes){
        let arr = [];
        meshes.forEach((elt,i)=>{


            // let geo = new THREE.IcosahedronGeometry(0.03, 1);
            let geo = new THREE.TextGeometry(i.toString(), {
                font: new THREE.Font()
            });

            let mat = new THREE.MeshPhongMaterial({
                map: texture
            });


            let mesh = new THREE.Mesh( geo, mat );

            mesh.position.x = elt.normal.x
            mesh.position.y = elt.normal.y
            mesh.position.z = elt.normal.z
            arr.push(mesh);
        })
        console.log(arr[0])
        return arr;
    },

    sceneAdd(scene, meshes){
        meshes.forEach((elt)=>{
            scene.add(elt);
        })
    },
    setMouse(x,y){
        return new THREE.Vector2(x,y);
    }
}
