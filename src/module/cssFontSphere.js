let items = ['js原理', '正达式', '反倒是', '电风电费', '发短无法', '富兰克林', '老师', '反对虐杀', 'vwfsfdf'];
items = items.concat(items, items, items, items);

let r = window.innerHeight/4+20,
    count = 80,
    nodeIndx = 0,
    canvas = document.querySelector('#fontSphere .fsControl ')
;

let PI = Math.PI,
    sin = Math.sin,
    cos = Math.cos;

run();

function run(){
    createSphere();
}

function createSphere(){
    let data = splot(count)

    let fragment = document.createDocumentFragment();

    data.forEach((elt)=>{
        let node = createNode();
        fragment.appendChild(node);

        node.style.transform = [
                `translateX(${elt.x}px)`,
                `translateY(${elt.y}px)`,
                `translateZ(${elt.z}px)`, 
            ].join(' ');
    });

    canvas.appendChild(fragment);


}



function fora(){
    let fragment = document.createDocumentFragment();
    let nodes = createNode(length);
    for(let i=1; i<=h; i++){
        let theta = i/h*PI,
            wx = sin(theta)*r,
            wy = cos(   theta)*r;
        // 纬线最大个数
        let length = Math.max(wy/r*h*2|1,0);




        for(let j=0; j<length; j++){
            let wz = cos(2*PI*j/length*wx);

            let xx = i/h*180,
                yy = j/length*360;

            if(xx<90){
                wy = -wy;
            }

            if(yy>180){
                wx = -wx;
            }

            if(yy<90||yy>270){
                wz = -wz;
            }
            console.log()
            let node = createNode();
            fragment.appendChild(node);
            node.style.transform = [
                `translateX(${wx}px)`
                `translateY(${wy}px)`
                `translateZ(${wz}px)`
            ].join(' ');
        }
    }

    canvas.appendChild(fragment);
}

function createNode(){
    let div = document.createElement('div');
    let span = document.createElement('span');

    div.appendChild(span);
    div.className = 'fontWrap';
    span.className = 'item';

    span.innerHTML = items[nodeIndx++%items.length];

    return div;
}


function toCartesian(azimuthal,polar,radial){
    let r = Math.sin(azimuthal) * radial;
    let x = Math.cos(polar) * r;
    let y = Math.sin(polar) * r;
    let z = Math.cos(azimuthal) * radial;
    return {x,y,z}
}
function splot(limit){
    // let s = new Spherical();
    let n = Math.ceil(Math.sqrt((limit)-2)/4);
    let azimuthal = 0.5*Math.PI/n;
    let azi = 0;
    let arr = [];

    for(let i = -n; i<n+1; i++){
        // s.polar = 0;
        let polar = 0;
        let size = Math.max((n-Math.abs(i))*4|0, 1);
        let polarCal = 2*Math.PI/size;

        for(let j=0; j<size; j++){
            arr.push(toCartesian(azi, polar, r));
            polar += polarCal;

        }
        azi += azimuthal;
        // s.azimuthal += azimuthal;

    }

    return arr;

}
