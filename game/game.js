const GridData = [];

class Grid {
    constructor(x,y,p) {
        this.x=x;
        this.y=y;
        this.p=p;
        this.grid=[];
        for(let i=0;i<Math.floor(x/p);i++){
            this.grid[i]=[];
        };
        for(let i=0;i<Math.floor(x/p);i++){
            for(let j=0;j<Math.floor(y/p);j++){
                this.grid[i][j]=false;
            };
        };
        this.minx=0;
        this.maxx=0;
        this.miny=0;
        this.maxy=0;
    };
    SetGridLayout(table) {
        for(let i=0;i<table.length;i++){
            let xpos = (table[i].x||i);
            this.grid[xpos]=[];
            for(let j=0;j<table[i].length;j++){
                let ypos = (table[xpos][j].y||j);
                this.grid[xpos][ypos]={load:table[xpos][ypos].img||table[xpos][ypos],await:true};
            };
        };
    };
    GetObjectOnGrid(x,y) {
        return this.grid[x][y];
    };
    SetObjectOnGrid(x,y,t) {
        this.grid[x][y]=t;
    };
    RemoveObjectOnGrid(x,y) {
        this.grid[x][y]=false;
    };
    SetReferencePoint(x,y) {
        this.minx=x-5>-1?x-5:0;
        this.maxx=x+5<this.grid.length?x+5:this.grid.length-1;
        this.miny=y-5>-1?y-5:0;
        this.maxy=y+5<this.grid[0].length?y+5:this.grid[0].length-1;
    };
    get GetClosestObjects() {
        let values = [];
        for(let i=this.minx;i<=this.maxx;i++){
            for(let j=this.miny;j<=this.maxy;j++){
                if(this.grid[i][j]){
                    values[this.grid[i][j]]=true;
                };
            };
        };
        return values
    };
};