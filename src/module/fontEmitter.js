const TWEEN = require('tween.js');



let items = ['js原理', '正则表达式', '反倒是', '电风扇水电费', '发短信无法', '富兰克林', '妇女节老师', '反对虐杀', 'vwfsfdfsf'];
items = items.concat(items, items, items, items);



let pCount = 20,
    nodeIndx = 0,
    perDuration = 2500,
    inHold = false,
    canvas = document.querySelector('#fontEmitter .container.ca');

let nodePool = [];
nodePool.own = 0;
let canvas2 = document.querySelector('#fontEmitter .container.cb')
let stage = document.querySelector('#fontEmitter');

run();

function run(){
    setTimeout(()=>{
        clickNode('ma');
        clickNode('mb');
        for(let i=0; i<pCount; i++){
            setTimeout(()=>{
                getFromNodePool();
            },Math.random()*20000);
        }
    }, 3000);

}

function clickNode(n){
    let wrap = document.createElement('div'),
        hover = document.createElement('a');

    wrap.appendChild(hover);
    wrap.className = 'hovMov '+n;
    hover.className = 'hov';
    hover.href = "#"
    hover.innerHTML = items[nodeIndx%items.length];
    nodeIndx++;
    canvas2.appendChild(wrap);
    wrap.addEventListener("animationiteration", ani);
    function ani(){
        nodeIndx++;
        hover.innerHTML = items[nodeIndx%items.length];
    }

}

function getFromNodePool(){

    if(!nodePool.lenght){
        nodePool.own++;
        if(nodePool.own>pCount){
            return null;
        }

        let wrap = document.createElement('div'),
            move = document.createElement('div'),
            rotate = document.createElement('a');

        move.appendChild(rotate);

        wrap.className = 'directionWrap';
        wrap.style.transform = `rotateZ(${(0.5-Math.random())*60}deg)`;

        move.sub = rotate;
        move.addEventListener("animationiteration", ani);
        function ani(){
            // nodePool.push(move);


            resetOne(move);
        }

        nodePool.push(move);
    }

    let node = nodePool.shift();

    resetOne(node);

    canvas.appendChild(node);
    return node;
}

function resetOne(node){
    node.style.transform=`scale(${Math.random()*1.4+0.1}) translate3d(0px,${-1*(Math.random()*50)}px,0px)`;

    node.style.left = Math.random()*50 +'px';
    node.style.bottom = Math.random()*150 +'px';
    node.className = 'move';
    node.sub.className = 'rotate';
    node.sub.innerHTML = items[nodeIndx%items.length];
    nodeIndx++;
}
//
// let emitPos = {
//     x: 0,
//     y: canvas.clientHeight
// }
//
// let starPoint = [
//     {x: emitPos.x, y: emitPos.y-100},
//     {x: emitPos.x, y: emitPos.y-50},
//     {x: emitPos.x+50, y: emitPos.y},
//     {x: emitPos.x+50, y: emitPos.y-50}
// ];
//
// let endPoint = [
//     {x: emitPos.x + 220, y: emitPos.y -100},
//     {x: emitPos.x + 240, y: emitPos.y- 150},
//     {x: emitPos.x+ 200, y: emitPos.y - 220},
//     {x: emitPos.x+ 280, y: emitPos.y- 150}
// ]
//
//
// // firstRound();
//
// function firstRound(){
//     let i = 0;
//     let timer = setInterval(()=>{
//         i++;
//         if(i>pCount){
//             clearInterval(timer);
//         }
//
//         emitOne();
//
//         // console.log(i)
//
//     },1500);
// }
//
//
//
//
// function emitOne(){
//     let node = getNode();
//
//     if(node===null){
//         console.log('等待生产');
//         return;
//     }
//     animateWidthPath(node);
//
// }
//
// function getNode(){
//
//     if(!nodePool.length){
//
//         if(nodePool.own>pCount){
//             return null;
//         }
//
//         nodePool.own++;
//         let node = document.createElement('a');
//
//
//
//         node.additionProperty = {
//             inHold : false,
//             opacity : 0,
//             pos : {x: emitPos.x, y: emitPos.y},
//             vec2:  {
//                 x: Math.random(),
//                 y: Math.random()
//             }
//         }
//
//         node.onmouseover = function(){
//             this.inHold = true;
//             this.tween1.stop();
//             this.tween2.stop();
//             // this.className = 'animated swing';
//
//
//
//         }
//         node.onmouseout = function(){
//             this.inHold = false;
//             this.tween1.start();
//             this.tween2.start();
//             this.className = '';
//
//
//
//         }
//
//         nodePool.push(node);
//     }
//
//     let node = nodePool.shift();
//
//     node.innerHTML = items[nodeIndx % items.length];
//
//     let x = starPoint[nodeIndx % starPoint.length].x;
//     let y = starPoint[nodeIndx % starPoint.length].y;
//     node.style.left = x;
//     node.style.left = y;
//     node.style.fontSize = Math.random()*3 + 9+'px';
//
//     node.className = 'tran1'
//
//     nodeIndx++;
//
//
//
//     node.additionProperty.pos = {x:x,y:y }
//
//     canvas.appendChild(node);
//
//
//
//     return node;
// }
//
//
// function animateWidthPath(node){
//
//     let sTime = Date.now();
//
//     let addiP = node.additionProperty;
//
//     let start = {
//         opacity : 0,
//         x: addiP.pos.x,
//         y: addiP.pos.y,
//         rotation: -70
//     }
//
//
//
//     let ep = endPoint[nodeIndx%endPoint.length];
//
//     let end = {
//         opacity : 0,
//         x: ep.x,
//         y: ep.y,
//         rotation: -60
//     }
//
//
//
//     // console.log(end.x,end.y)
//     let mid = {
//         x: 300 + (0.5-Math.random()*80),
//         y: 180 + (0.5-Math.random()*130),
//         opacity: 0.7,
//         rotation: 0
//     };
//
//     node.tween1 = new TWEEN.Tween(start)
//     .to(mid, 3000)
//     .easing(TWEEN.Easing.Linear.None)
//     .onUpdate(function(){
//
//         // node.style.left = this.x+'px';
//         // node.style.top = this.y+'px';
//         // node.style.opacity = this.opacity;
//         // node.style.transform = 'rotate('+ this.rotation +'deg)';
//
//     })
//     ;
//
//     node.tween2 = new TWEEN.Tween(mid)
//     .to(end, 2500 )
//     .easing(TWEEN.Easing.Linear.None)
//     .onUpdate(function(){
//
//         // node.style.left = this.x+'px';
//         // node.style.top = this.y+'px';
//         // node.style.opacity = this.opacity;
//         // node.style.transform = 'rotate('+ this.rotation +'deg)'
//
//     })
//     .onComplete(function(){
//         canvas.removeChild(node);
//         nodePool.push(node);
//         setTimeout(()=>{
//             emitOne();
//         },Math.random*2000)
//
//     })
//     ;
//
//     node.tween1.chain(node.tween2);
//     // node.tween2.chain(node.tween1);
//     node.tween1.start();
//
//     // let timer = setInterval(()=>{
//     //
//     //     if(Date.now()-sTime > perDuration){
//     //         clearInterval(timer);
//     //         nodePool.push(node);
//     //         canvas.removeChild(node);
//     //     }
//     //
//     //     if(node.inHold===true){
//     //         clearInterval(timer);
//     //         node.className = 'f-hold';
//     //     }
//     //
//     //     curtPos.x += vec2.x ;
//     //     curtPos.y += vec2.y ;
//     //
//     //     node.style.left = curtPos.x;
//     //     node.style.top = curtPos.y;
//     //
//     //
//     // }, 20);
//
// }
//
// function getRandomOriPos(){
//     let seed = 40;
//
//     return {
//         x: (Math.random())*seed,
//         y: canvas.clientHeight + (0.5-Math.random())*seed
//     }
//
// }
// stage.style.background = 'red'
// stage.style.width = window.innerWidth/2 - window.innerHeight*1/7 + 'px';
stage.style.left = window.innerWidth/2 + 150 + 'px';
// console.log(window.innerWidth)
window.onWindowResize = function(){
    stage.style.left = window.innerWidth/2 + 150 + 'px';

}
