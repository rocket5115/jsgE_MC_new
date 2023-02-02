var scene = new SceneCreator(Math.floor(1920/64)*64,Math.floor(1080/64)*64,64)
let background = scene.CreateScene();
document.getElementById('SceneElement'+background).style.backgroundColor = 'transparent';
let sky = scene.CreateObject(0,0,scene.size.x,scene.size.y);
scene.object.DisablePhysics(sky);
scene.object.SetImage(sky, 'sky');
sky=document.getElementById(sky);

const RandomNumber = (min,max) => {
    return Math.floor((Math.random()*(max-min))+min);
};

let borders = scene.CreateBorders(1);
let steve = scene.CreateObject(164, 500, 32, 128, true);
scene.SetLastObject = steve;
var stdoc = document.getElementById(steve);
scene.object.SetImage(steve,'body');
stdoc.classList.add('SteveBody');
stdoc.classList.add('StevePart');
if(!scene.LastObject.gravity){
    steve=document.querySelectorAll('SteveBody')[0].id;
    scene.SetLastObject = steve;
};
//BodyParts
let head = scene.CreateObject(164, 500, 32, 32);
var stdoc = document.getElementById(head);
stdoc.classList.add('SteveHead');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,head);
let arms = scene.CreateObject(164+8, 532, 16, 48);
var stdoc = document.getElementById(arms);
stdoc.classList.add('SteveArms');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,arms);
let legs = scene.CreateObject(164+8, 532+48, 16, 48);
var stdoc = document.getElementById(legs);
stdoc.classList.add('SteveLegs');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,legs);
delete(stdoc);

var PhysicsObjects = [];
PhysicsObjects[borders[0]]=true;
PhysicsObjects[borders[1]]=true;
PhysicsObjects[borders[2]]=true;
PhysicsObjects[borders[3]]=true;
PhysicsObjects[steve]=true;

const gr = new Grid(scene.size.x,scene.size.y,64)
gr.SetReferencePoint(5,5)

setInterval(()=>{
    PhysicsObjects=gr.GetClosestObjects||[];
    PhysicsObjects[borders[0]]=true;
    PhysicsObjects[borders[1]]=true;
    PhysicsObjects[borders[2]]=true;
    PhysicsObjects[borders[3]]=true;
    PhysicsObjects[steve]=true;
    gr.SetReferencePoint(stdoc.style.left,stdoc.style,top);
},200)

var physics = new Physics(background);
const PhysicsFunc = () => {
    physics.Next(PhysicsObjects);
    setTimeout(PhysicsFunc, 10);
};
setTimeout(PhysicsFunc, 10);

let l = false
let r = false

const inv = new Inventory(scene);
inv.PreparePersonalInventory();
let lastinv = 0;

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        if(lastinv<8) {
            lastinv++;
        } else {
            lastinv=0;
        };
    } else {
        if(lastinv>0) {
            lastinv--;
        } else {
            lastinv=8;
        };
    };
    inv.MoveTo(lastinv);
});

window.addEventListener('keydown', function(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            let init = scene.LastObject.walls[3].y1
            setTimeout(()=>{
                if(init==scene.LastObject.walls[3].y1&&scene.LastObject.gravity>0){
                    scene.LastObject.gravity = -13;
                };
            },20);
            break;
        case 'KeyA':
            l=true;
            break;
        case 'KeyD':
            r=true;
            break;
        case 'Digit1':
            inv.MoveTo(0);
            lastinv=0;
            break;
        case 'Digit2':
            inv.MoveTo(1);
            lastinv=1;
            break;
        case 'Digit3':
            inv.MoveTo(2);
            lastinv=2;
            break;
        case 'Digit4':
            inv.MoveTo(3);
            lastinv=3;
            break;
        case 'Digit5':
            inv.MoveTo(4);
            lastinv=4;
            break;
        case 'Digit6':
            inv.MoveTo(5);
            lastinv=5;
            break;
        case 'Digit7':
            inv.MoveTo(6);
            lastinv=6;
            break;
        case 'Digit8':
            inv.MoveTo(7);
            lastinv=7;
            break;
        case 'Digit9':
            inv.MoveTo(8);
            lastinv=8;
            break;
    };
});

window.addEventListener('keyup', e => {
    if(e.code=='KeyA')l=false;
    if(e.code=='KeyD')r=false;
});

$(document).bind("mouseleave", function() {
    l=false;
    r=false;
});

$(window).blur(function() {
    l=false;
    r=false;
});

const Positions = [{min:-45,max:45},{min:-45,max:45}];
let finished = false;

const MoveLegs = () => {
    let rot = Number(getComputedStyle(document.documentElement).getPropertyValue('--rot1').replace('deg',''));
    if(rot-5>=Positions[0].min&&!finished){
        document.documentElement.style.setProperty('--rot1', rot-5+'deg');
        document.documentElement.style.setProperty('--rot2', -rot+5+'deg');
        if(rot-5<=Positions[0].min){
            finished=true;
        };
    } else {
        document.documentElement.style.setProperty('--rot1', rot+5+'deg');
        document.documentElement.style.setProperty('--rot2', -rot-5+'deg');
        if(rot+5>=Positions[0].max){
            finished=false;
        };
    };
};

const MoveLegsNormal = () => {
    document.documentElement.style.setProperty('--rot1', '0deg');
    document.documentElement.style.setProperty('--rot2', '0deg');
};

var mov = new Movement(background);
let lastmov = 0;

const Move = () => {
    if(l) {
        mov.MoveLeft(scene.LastObject, PhysicsObjects, 5);
    };
    if(r) {
        mov.MoveRight(scene.LastObject, PhysicsObjects, 5);
    };
    if(l&&!r){
        if(lastmov!=1){
            lastmov=1;
            document.documentElement.style.setProperty('--head', "url('../images/slh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srll.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slrl.png')");
            document.documentElement.style.setProperty('--roth', '0deg');
        };
        MoveLegs();
    } else if(r&&!l) {
        if(lastmov!=2){
            lastmov=2;
            document.documentElement.style.setProperty('--head', "url('../images/srh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srrl.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slll.png')");
            document.documentElement.style.setProperty('--roth', '179deg');
        };
        MoveLegs();
    } else if(lastmov!=3) {
        MoveLegsNormal();
        lm=lastmov;
        lastmov=3;
    };
    setTimeout(Move,10);
};
setTimeout(Move,10);

let LoadedChunks = [];
setInterval(()=>{
    let [x,y] = [Math.floor(Number(stdoc.style.left.replace('px',''))/64),Math.floor(Number(stdoc.style.top.replace('px',''))/64)];
    for(let i=x-2>0?x-2:0;i<=x+2;i++){
        for(let j=y-2>0?y-2:0;j<=y+2;j++){
            gr.LoadChunk(i,j);
            gr.LoadChunk(i+6,j);
            gr.LoadChunk(i-6,j);
            gr.LoadChunk(i+6,j+6);
            gr.LoadChunk(i-6,j+6);
            gr.LoadChunk(i+6,j-6);
            gr.LoadChunk(i-6,j-6);
            gr.UnloadChunk(i-15,j);
            gr.UnloadChunk(i+15,j);
            gr.UnloadChunk(i-15,j+9);
            gr.UnloadChunk(i+15,j+9);
            gr.UnloadChunk(i-15,j-9);
            gr.UnloadChunk(i+15,j-9);
        };
    };
},100);

const GF = () =>{
    if(scene.LastObject.gravity<9){
        scene.LastObject.gravity++;
    };
};
setInterval(GF,20)

scene.object.FocusOnElement(steve);

const gridAdd = (x,y,t) => {
    if(t){
        gr.SetObjectOnGrid(x,y,t,true);
        return true;
    };
    let obj = scene.CreateObject(x*64,y*64,64,64,false);
    gr.SetObjectOnGrid(x,y,obj,false);
    return obj;
};

const gridRemove = (x,y) => {
    let obj = gr.GetObjectOnGrid(x,y);
    if(obj) {
        gr.RemoveObjectOnGrid(x,y);
        scene.DeleteObject(obj);
    };
};

const GetXYOfClick = (e) => {
    let rect = sky.getBoundingClientRect();
    let x = Math.floor((e.clientX-rect.left)/64);
    let y = Math.floor((e.clientY-rect.top)/64);
    return [x,y]
};

$('body').bind('contextmenu', function(e) {
    let [x,y] = GetXYOfClick(e);
    if(!gr.GetObjectOnGrid(x,y)){
        let [item,slot] = inv.GetSelectedItem;
        if(item) {
            let doc = gridAdd(x,y);
            scene.object.SetImage(doc,item.item);
            inv.RemoveItemFromSlot(slot,1);
        };
    };
    return false;
});

$('body').bind('click', function(e) {
    let [x,y] = GetXYOfClick(e);
    let obj = gr.GetObjectOnGrid(x,y);
    if(obj){
        let img = scene.object.GetImage(obj);
        gridRemove(x,y);
        inv.AddItemToSlot(img);
    };
});

/* 
    Funkcja Procedural Generator
*/

var MaxTable = [];

for(let i=0;i<scene.size.x/64;i++){
    MaxTable[i]=MaxTable[i]!=undefined?MaxTable[i]:[];
    for(let j=0;j<scene.size.y/64;j++){
        MaxTable[i][j]=false;
        if(j==scene.size.y/64-1){
            MaxTable[i][j]={img:'bedrock'};
            continue;
        };
    };
};

gr.SetGridLayout(MaxTable)