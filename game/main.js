var scene = new SceneCreator(Math.floor(1200/64)*64,Math.floor(1200/64)*64,64)
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
const StaticValues = [];
StaticValues[borders[0]]=true;
StaticValues[borders[1]]=true;
StaticValues[borders[2]]=true;
StaticValues[borders[3]]=true;
StaticValues[steve]=true;

var PhysicsObjects = StaticValues;

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

window.addEventListener('keydown', function(e) {
    if(e.code=='Space'){
        e.preventDefault();
        scene.LastObject.gravity = -13;
    } else if(e.code=='KeyA') {
        l=true;
    } else if(e.code=='KeyD'){
        r=true;
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

var mov = new Movement(background);

const Move = () => {
    if(l) {
        mov.MoveLeft(scene.LastObject, PhysicsObjects, 5);
    };
    if(r) {
        mov.MoveRight(scene.LastObject, PhysicsObjects, 5);
    };
    setTimeout(Move,10);
};
setTimeout(Move,10);

const GF = () =>{
    if(scene.LastObject.gravity<9){
        scene.LastObject.gravity++;
    };
};
setInterval(GF,20)

scene.object.FocusOnElement(steve);

const gridAdd = (x,y) => {
    let obj = scene.CreateObject(x*64,y*64,64,64,false);
    gr.SetObjectOnGrid(x,y,obj);
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

const inv = new Inventory(scene);
inv.PreparePersonalInventory();

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
inv.AddItemToSlot('stone');
$('body').bind('click', function(e) {
    let [x,y] = GetXYOfClick(e);
    let obj = gr.GetObjectOnGrid(x,y);
    if(obj){
        let img = scene.object.GetImage(obj);
        gridRemove(x,y);
        inv.AddItemToSlot(img);
    };
});