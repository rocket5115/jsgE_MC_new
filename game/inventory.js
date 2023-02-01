class Inventory {
    constructor(map) {
        this.map = map;
        this.personalInventory = [];
        this.invObject = [];
        this.selected = 0;
    };
    PreparePersonalInventory() {
        this.invObject = new SceneCreator(this.map.size.x,this.map.size.y);
        this.invObject.CreateScene();
        let x=(64*9)+(10*10);
        let y=84;
        let inv = document.getElementById(this.invObject.CreateObject(Math.floor(window.innerWidth-x)/2,Math.floor(window.innerHeight-(y+20)),x,y));
        inv.style.position = "fixed";
        inv.style.zIndex = 2;
        inv.className = "inventory";
        inv.innerHTML = '<div id="Inv0"></div><div id="Inv1"></div><div id="Inv2"></div><div id="Inv3"></div><div id="Inv4"></div><div id="Inv5"></div><div id="Inv6"></div><div id="Inv7"></div><div id="Inv8"></div>';
        for(let i=0;i<=8;i++) {
            this.personalInventory[i]=false;
        };
        this.MoveTo(0);
    };
    MoveTo(id) {
        this.selected=id>=0&&id<9?id:0;
        document.documentElement.style.setProperty('--inv-left', this.selected*74+'px');
    };
    UpdateInventory(slot) {
        if(slot<0||slot>8)return;
        if(this.personalInventory[slot]){
            document.documentElement.style.setProperty('--inv-'+slot,'"'+this.personalInventory[slot].amount+'"');
            document.getElementById('Inv'+slot).style.backgroundImage = `url("./images/${this.personalInventory[slot].item}.png")`
        } else {
            document.documentElement.style.setProperty('--inv-'+slot,'""');
            document.getElementById('Inv'+slot).style.backgroundImage = ``;
        };
    };
    RemoveItemFromSlot(slot,num) {
        if(slot<0||slot>8)return;
        num=num||-1;
        if(num>0){
            if(this.personalInventory[slot]){
                this.personalInventory[slot].amount--;
                if(this.personalInventory[slot].amount<=0){
                    this.personalInventory[slot]=false;
                };
                this.UpdateInventory(slot);
            };
        } else {
            if(this.personalInventory[slot]){
                this.personalInventory[slot]=false;
                this.UpdateInventory(slot);
            };
        };
    };
    GetFirstFreeSlot(item,num){
        if(item){
            num=num||1;
            let selected=-1;
            for(let i=0;i<=8;i++){
                if(this.personalInventory[i]&&this.personalInventory[i].item==item){
                    if(this.personalInventory[i].amount+num<=this.personalInventory[i].stack){
                        selected=i;
                        break;
                    };
                };
            };
            if(selected==-1){
                for(let i=0;i<=8;i++){
                    if(!this.personalInventory[i]){
                        return i;
                    };
                };
            } else {
                return selected
            };
        } else {
            for(let i=0;i<=8;i++){
                if(!this.personalInventory[i]){return i;};
            };
        };
        return -1;
    };
    AddItemToSlot(item,slot,options){
        if(!item)return;
        options=options||[];
        slot=slot||this.GetFirstFreeSlot(item,options.amount||1);
        if(slot==-1)return;
        options.amount=options.amount||1;
        if(!this.personalInventory[slot]){
            this.personalInventory[slot]={item:item,amount:options.amount,stack:options.stack||64};
        } else {
            this.personalInventory[slot].amount=this.personalInventory[slot].amount+options.amount;
        };
        this.UpdateInventory(slot);
    };
    get GetSelectedItem() {
        return [this.personalInventory[this.selected],this.selected];
    };
};