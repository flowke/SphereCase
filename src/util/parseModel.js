const THREE = require('three-js')();

module.exports = function parseModel( json, scale ) {
    let geometry = new THREE.Geometry();
    function isBitSet( value, position ) {

        return value & ( 1 << position );
    }

    var i, j, fi,

    offset, zLength,

    colorIndex, normalIndex, uvIndex, materialIndex,

    type,
    isQuad,
    hasMaterial,
    hasFaceVertexUv,
    hasFaceNormal, hasFaceVertexNormal,
    hasFaceColor, hasFaceVertexColor,

    vertex, face, faceA, faceB, hex, normal,

    uvLayer, uv, u, v,

    faces = json.faces,
    vertices = json.vertices,
    normals = json.normals,
    colors = json.colors,

    nUvLayers = 0;

    if ( json.uvs !== undefined ) {

        // disregard empty arrays

        for ( i = 0; i < json.uvs.length; i ++ ) {

            if ( json.uvs[ i ].length ) nUvLayers ++;

        }

        for ( i = 0; i < nUvLayers; i ++ ) {

            geometry.faceVertexUvs[ i ] = [];

        }

    }

    offset = 0;
    zLength = vertices.length;

    let points = [];

    while ( offset < zLength ) {

        vertex = new THREE.Vector3();

        vertex.x = vertices[ offset ++ ] * scale;
        vertex.y = vertices[ offset ++ ] * scale;
        vertex.z = vertices[ offset ++ ] * scale;

        geometry.vertices.push( vertex );
        // points.push(vertex);

    }

    console.log(points.length)

    offset = 0;
    zLength = faces.length;

    while ( offset < zLength ) {

        type = faces[ offset ++ ];
        // let geometry = new THREE.Geometry()

        isQuad              = isBitSet( type, 0 );
        hasMaterial         = isBitSet( type, 1 );
        hasFaceVertexUv     = isBitSet( type, 3 );
        hasFaceNormal       = isBitSet( type, 4 );
        hasFaceVertexNormal = isBitSet( type, 5 );
        hasFaceColor	     = isBitSet( type, 6 );
        hasFaceVertexColor  = isBitSet( type, 7 );

        // console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

        if ( isQuad ) {

            faceA = new THREE.Face3();

            let oa1 = offset,
                oa2 = offset + 1,
                oa3 = offset + 3,

                ob1 = offset + 1,
                ob2 = offset + 2,
                ob3 = offset + 3;

            faceA.a = faces[ oa1 ];
            faceA.b = faces[ oa2 ];
            faceA.c = faces[ oa3 ];

            faceB = new THREE.Face3();
            faceB.a = faces[ ob1 ];
            faceB.b = faces[ ob2 ];
            faceB.c = faces[ ob3 ];

            offset += 4;

            if ( hasMaterial ) {

                materialIndex = faces[ offset ++ ];
                faceA.materialIndex = materialIndex;
                faceB.materialIndex = materialIndex;

            }

            // to get face <=> uv index correspondence

            fi = geometry.faces.length;

            if ( hasFaceVertexUv ) {

                for ( i = 0; i < nUvLayers; i ++ ) {

                    uvLayer = json.uvs[ i ];

                    geometry.faceVertexUvs[ i ][ fi ] = [];
                    geometry.faceVertexUvs[ i ][ fi + 1 ] = [];

                    for ( j = 0; j < 4; j ++ ) {

                        uvIndex = faces[ offset ++ ];

                        u = uvLayer[ uvIndex * 2 ];
                        v = uvLayer[ uvIndex * 2 + 1 ];

                        uv = new Vector2( u, v );

                        if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
                        if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

                    }

                }

            }

            if ( hasFaceNormal ) {

                normalIndex = faces[ offset ++ ] * 3;

                faceA.normal.set(
                    normals[ normalIndex ++ ],
                    normals[ normalIndex ++ ],
                    normals[ normalIndex ]
                );

                faceB.normal.copy( faceA.normal );

            }

            if ( hasFaceVertexNormal ) {

                for ( i = 0; i < 4; i ++ ) {

                    normalIndex = faces[ offset ++ ] * 3;

                    normal = new THREE.Vector3(
                        normals[ normalIndex ++ ],
                        normals[ normalIndex ++ ],
                        normals[ normalIndex ]
                    );


                    if ( i !== 2 ) faceA.vertexNormals.push( normal );
                    if ( i !== 0 ) faceB.vertexNormals.push( normal );

                }

            }


            if ( hasFaceColor ) {

                colorIndex = faces[ offset ++ ];
                hex = colors[ colorIndex ];

                faceA.color.setHex( hex );
                faceB.color.setHex( hex );

            }


            if ( hasFaceVertexColor ) {

                for ( i = 0; i < 4; i ++ ) {

                    colorIndex = faces[ offset ++ ];
                    hex = colors[ colorIndex ];

                    if ( i !== 2 ) faceA.vertexColors.push( new Color( hex ) );
                    if ( i !== 0 ) faceB.vertexColors.push( new Color( hex ) );

                }

            }

            // geometry.vertices = [
            //     points[oa1],
            //     points[oa2],
            //     points[oa3],
            //     points[ob1],
            //     points[ob2],
            //     points[ob3]
            // ];

            geometry.faces.push( faceA );
            geometry.faces.push( faceB );

            // group.add(
            //     new THREE.Mesh(
            //         geometry,
            //         new THREE.MeshLambertMaterial({color: 0x7777ff})
            //     )
            // );

        } else {

            face = new THREE.Face3();

            let o1 = offset++,
                o2 = offset++,
                o3 = offset++;

            face.a = faces[ o1 ];
            face.b = faces[ o2 ];
            face.c = faces[ o3 ];

            if ( hasMaterial ) {

                materialIndex = faces[ offset ++ ];
                face.materialIndex = materialIndex;

            }

            // to get face <=> uv index correspondence

            fi = geometry.faces.length;

            if ( hasFaceVertexUv ) {

                for ( i = 0; i < nUvLayers; i ++ ) {

                    uvLayer = json.uvs[ i ];

                    geometry.faceVertexUvs[ i ][ fi ] = [];

                    for ( j = 0; j < 3; j ++ ) {

                        uvIndex = faces[ offset ++ ];

                        u = uvLayer[ uvIndex * 2 ];
                        v = uvLayer[ uvIndex * 2 + 1 ];

                        uv = new Vector2( u, v );

                        geometry.faceVertexUvs[ i ][ fi ].push( uv );

                    }

                }

            }

            if ( hasFaceNormal ) {

                normalIndex = faces[ offset ++ ] * 3;

                face.normal.set(
                    normals[ normalIndex ++ ],
                    normals[ normalIndex ++ ],
                    normals[ normalIndex ]
                );

            }

            if ( hasFaceVertexNormal ) {

                for ( i = 0; i < 3; i ++ ) {

                    normalIndex = faces[ offset ++ ] * 3;

                    normal = new THREE.Vector3(
                        normals[ normalIndex ++ ],
                        normals[ normalIndex ++ ],
                        normals[ normalIndex ]
                    );

                    face.vertexNormals.push( normal );

                }

            }


            if ( hasFaceColor ) {

                colorIndex = faces[ offset ++ ];
                face.color.setHex( colors[ colorIndex ] );

            }


            if ( hasFaceVertexColor ) {

                for ( i = 0; i < 3; i ++ ) {

                    colorIndex = faces[ offset ++ ];
                    face.vertexColors.push( new Color( colors[ colorIndex ] ) );

                }

            }

            // geometry.vertices = [
            //     points[o1],
            //     points[o2],
            //     points[o3]
            // ];

            geometry.faces.push( face );

            // group.add(
            //     new THREE.Mesh(
            //         geometry,
            //         new THREE.MeshLambertMaterial({color: 0x7777ff})
            //     )
            // );

        }

    }
    return geometry;
}
