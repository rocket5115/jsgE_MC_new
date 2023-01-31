const Scenes = {};
const SceneObjects = {}; // Used as physics reference

class SceneCreator {
    constructor(x,y,h) {
        this.x = x||1920;
        this.y = y||1080;
        this.id = Math.floor((this.x/this.y)*Math.random()*10);
        this.h;
        if(h){
            this.h = h;
        };
        this.lobj = new MiscObject(this.id);
        this.lastid;
    };
    get object() {
        return this.lobj;
    };
    get size() {
        return {x:this.x,y:this.y,h:this.h};
    };
    get GetId() {
        return this.id;
    };
    CreateScene() {
        $("#ScenesContainer").append(`<container id="SceneElement${this.id}" class="Scene" style="position:absolute;width:${this.x}px;height:${this.y}px;max-width:${this.x}px;max-height:${this.y}px"></container>`);
        SceneObjects[this.id]={};
        return this.id;
    };
    CreateObject(x,y,w,h,s) {
        console.log('Called')
        let objid = "SE"+(Math.random()*5).toFixed(10);
        $("#SceneElement"+this.id).append(`<div id="${objid}" style="position:absolute;width:${w}px;height:${h}px;left:${x}px;top:${y}px"></div>`);
        SceneObjects[this.id][objid]={
            id: objid,
            walls: [
                {x1:x,x2:x+w,y1:y,y2:y},
                {x1:x+w,x2:x+w,y1:y,y2:y+h},
                {x1:x,x2:x+w,y1:y+h,y2:y+h},
                {x1:x,x2:x,y1:y,y2:y+h}
            ],
            collisions: [],
            collided: [],
            attached: [],
            disabled: false,
            static: s!=undefined?s:false,
            gravity: 9
        };
        return objid;
    };
    DeleteObject(id) {
        delete(SceneObjects[this.id][id]);
        document.getElementById(id).remove();
    };
    CreateBorders(p1,p2,p3,p4) {
        let objs = [1,1,1,1]
        if(typeof(p1)==='number'){
            p1=p1>0?p1:1;
            objs[0]=p1;objs[1]=p1;objs[2]=p1;objs[3]=p1;
        };
        if(typeof(p2)==='number'){
            p2=p2>0?p2:1;
            objs[1]=p2;objs[3]=p2;
        };
        if(typeof(p3)==='number'){
            p3=p3>0?p3:1;
            objs[2]=p3;
        };
        if(typeof(p4)==='number'){
            p4=p4>0?p4:1;
            objs[3]=p4;
        };
        p1 = this.CreateObject(0,0,this.x,objs[0]);
        p2 = this.CreateObject(this.x-objs[1],0,objs[1],this.y);
        p3 = this.CreateObject(0,this.y,this.x,objs[2]);
        p4 = this.CreateObject(0,0,objs[3],this.y);
        return [p1,p2,p3,p4];
    };
    get LastObject() {
        return SceneObjects[this.id][this.lastid]||{};
    };
    /**
     * @param {string} obj
    */
    set SetLastObject(obj) {
        this.lastid=obj;
    };
};

// 0 - north, 1 - east, 2 - south, 3 - west || góra, prawo, dół, lewo

const GetDirections = (pw,cw) => {
    let right = (pw[1].x1<=cw[3].x1);
    let left = (pw[3].x1>=cw[1].x1);
    let down = (pw[0].y1>=cw[2].y1);
    let top = (pw[2].y1<=cw[0].y1);
    return {left:left,right:right,top:top,down:down,inside:left&&right,between:!left&&!right,ldif:(left&&pw[3].x1-cw[1].x1)||0,rdif:(right&&cw[3].x1-pw[1].x1)||0,tdif:(top&&cw[0].y1-pw[2].y1)||0,ddif:(down&&pw[0].y1-cw[2].y1)};
};

class Physics {
    constructor(id) {
        this.id = id;
    };
    Next(obj) {
        let statics = [];
        let dynamics = [];
        for(let id in obj) {
            if(!SceneObjects[this.id][id])continue;
            if(SceneObjects[this.id][id].static===true&&!SceneObjects[this.id][id].disabled){dynamics[dynamics.length]=SceneObjects[this.id][id];continue;};
            statics[statics.length]=SceneObjects[this.id][id];continue;
        };
        dynamics.forEach(obj=>{
            let tdif = 100;
            if(obj.gravity>0){
                for(let i=0;i<statics.length;i++){
                    let dist = GetDirections(obj.walls, statics[i].walls);
                    if(dist.top&&dist.between){
                        let dif=(dist.tdif-obj.gravity>0);
                        if(dif) {
                            if(tdif>obj.gravity){
                                tdif=obj.gravity;
                            };
                        } else {
                            if(tdif>dist.tdif){
                                tdif=dist.tdif;
                            };
                        };
                    };
                };
                if(tdif==100)return;
                if(FocusOn[0]!=undefined&&FocusOn[0].id==obj.id){
                    FocusOnElement();
                };
                let doc = document.getElementById(obj.id);
                doc.style.top = Number(doc.style.top.replace('px', ''))+tdif+'px';
                for(let i=0;i<4;i++) {
                    obj.walls[i].y1=obj.walls[i].y1+tdif;
                    obj.walls[i].y2=obj.walls[i].y2+tdif;
                };
                if(obj.attached.length>0){
                    obj.attached.forEach(obj=>{
                        let doc = document.getElementById(obj.id);
                        doc.style.top=Number(doc.style.top.replace('px',''))+tdif+'px';
                        for(let j=0;j<4;j++) {
                            obj.walls[j].y1=obj.walls[j].y1+tdif;
                            obj.walls[j].y2=obj.walls[j].y2+tdif;
                        };
                    });
                };
            } else if(obj.gravity<0) {
                for(let i=0;i<statics.length;i++){
                    let dist = GetDirections(obj.walls, statics[i].walls);
                    if(dist.down&&dist.between){
                        if(tdif>dist.ddif){
                            tdif=dist.ddif
                        };
                    };
                };
                if(-tdif<obj.gravity){
                    tdif=obj.gravity;
                }else {
                    tdif=-tdif;
                };
                if(tdif>=0){obj.gravity=-1;return;};
                FocusOnElement();
                let doc = document.getElementById(obj.id);
                doc.style.top = Number(doc.style.top.replace('px', ''))+tdif+'px';
                for(let i=0;i<4;i++) {
                    obj.walls[i].y1=obj.walls[i].y1+tdif;
                    obj.walls[i].y2=obj.walls[i].y2+tdif;
                };
                if(obj.attached.length>0){
                    obj.attached.forEach(obj=>{
                        let doc = document.getElementById(obj.id);
                        doc.style.top=Number(doc.style.top.replace('px',''))+tdif+'px';
                        for(let j=0;j<4;j++) {
                            obj.walls[j].y1=obj.walls[j].y1+tdif;
                            obj.walls[j].y2=obj.walls[j].y2+tdif;
                        };
                    });
                };
            };
        });
    };
};

class Movement {
    constructor(id) {
        this.id = id;
    };
    MoveLeft(obj,objs,num) {
        let statics = [];
        for(let id in objs) {
            if(!SceneObjects[this.id][id])continue;
            if(SceneObjects[this.id][id].disabled)continue;
            statics[statics.length]=SceneObjects[this.id][id];
        };
        let tdif = 100;
        for(let i=0;i<statics.length;i++) {
            let dist = GetDirections(obj.walls, statics[i].walls);
            if(dist.left&&!dist.right&&!dist.top&&!dist.down){
                let dif=(dist.ldif-num>0);
                if(dif){
                    if(tdif>num){
                        tdif=num;
                    };
                } else {
                    tdif=dist.ldif;
                };
            };
        };
        if(tdif==100)return;
        if(tdif>num)tdif=num;
        let doc = document.getElementById(obj.id);
        doc.style.left = Number(doc.style.left.replace('px', ''))-tdif+'px';
        for(let i=0;i<4;i++) {
            obj.walls[i].x1=obj.walls[i].x1-tdif;
            obj.walls[i].x2=obj.walls[i].x2-tdif;
        };
        if(FocusOn[0]!=undefined&&FocusOn[0].id==obj.id){
            FocusOnElement();
        };
        if(obj.attached.length>0){
            obj.attached.forEach(obj=>{
                let doc = document.getElementById(obj.id);
                doc.style.left=Number(doc.style.left.replace('px',''))-tdif+'px';
                for(let j=0;j<4;j++) {
                    obj.walls[j].x1=obj.walls[j].x1-tdif;
                    obj.walls[j].x2=obj.walls[j].x2-tdif;
                };
            });
        };
    };
    MoveRight(obj,objs,num) {
        let statics = [];
        for(let id in objs) {
            if(!SceneObjects[this.id][id])continue;
            if(SceneObjects[this.id][id].disabled)continue;
            statics[statics.length]=SceneObjects[this.id][id];
        };
        let tdif = 100;
        for(let i=0;i<statics.length;i++) {
            let dist = GetDirections(obj.walls, statics[i].walls);
            if(dist.right&&!dist.left&&!dist.top&&!dist.down){
                let dif=(dist.rdif-num>0);
                if(dif){
                    if(tdif>num){
                        tdif=num;
                    };
                } else {
                    tdif=dist.rdif;
                };
            };
        };
        if(tdif==100)return;
        if(tdif>num)tdif=num;
        let doc = document.getElementById(obj.id);
        doc.style.left = Number(doc.style.left.replace('px', ''))+tdif+'px';
        for(let i=0;i<4;i++) {
            obj.walls[i].x1=obj.walls[i].x1+tdif;
            obj.walls[i].x2=obj.walls[i].x2+tdif;
        };
        if(FocusOn[0]!=undefined&&FocusOn[0].id==obj.id){
            FocusOnElement();
        };
        if(obj.attached.length>0){
            obj.attached.forEach(obj=>{
                let doc = document.getElementById(obj.id);
                doc.style.left=Number(doc.style.left.replace('px',''))+tdif+'px';
                for(let j=0;j<4;j++) {
                    obj.walls[j].x1=obj.walls[j].x1+tdif;
                    obj.walls[j].x2=obj.walls[j].x2+tdif;
                };
            });
        };
    };
};

const FocusOn = [];

class MiscObject {
    constructor(id) {
        this.id = id;
    };
    SetImage(id,name) {
        if(!SceneObjects[this.id][id])return;
        let doc = document.getElementById(id);
        doc.style.backgroundImage='url("./images/'+name+'.png")';
        return true;
    };
    GetImage(id) {
        if(!SceneObjects[this.id][id])return;
        let doc = document.getElementById(id);
        return(doc.style.backgroundImage.replace('url("./images/','').replace('.png")',''));
    };
    FocusOnElement(obj) {
        FocusOn[0]=document.getElementById(obj);
        return true;
    };
    ClearFocus() {
        FocusOn[0]=undefined;
        return true;
    };
    DisablePhysics(id) {
        if(!SceneObjects[this.id][id])return;
        SceneObjects[this.id][id].disabled=true;
    };
    EnablePhysics(id) {
        if(!SceneObjects[this.id][id])return;
        SceneObjects[this.id][id].disabled=false;
    };
    AttachElementToElement(p,c) {
        SceneObjects[this.id][p].attached.push(SceneObjects[this.id][c]);
    };
};

const FocusOnElement = () =>{
    if(FocusOn[0]!=undefined){
        let elementRect=FocusOn[0].getBoundingClientRect();
        window.scrollTo((elementRect.left + window.pageXOffset) - (1920/2), (elementRect.top + window.pageYOffset) - (1080 / 4));
    };
};