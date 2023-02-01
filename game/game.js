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
        this.chunks=[];
        for(let i=0;i<this.grid.length;i+=5){
            this.chunks[this.chunks.length]={xmin:i,xmax:(i+4<this.grid.length?i+4:this.grid.length-1),ypos:[]};
        };
        for(let i=0;i<this.chunks.length;i++){
            for(let j=0;j<this.grid[0].length;j+=5){
                this.chunks[i].ypos[this.chunks[i].ypos.length]={ymin:j,ymax:(j+4<this.grid[0].length?j+4:this.grid[0].length-1)};
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
                if(!table[i][j])continue;
                let ypos = (table[xpos][j].y||j);
                gridAdd(xpos,ypos,table[xpos][ypos].img||table[xpos][ypos]);
            };
        };
        this.LoadChunk(0,17);
    };
    GetObjectOnGrid(x,y) {
        return this.grid[x][y];
    };
    SetObjectOnGrid(x,y,t,await) {
        this.grid[x][y]=!await?t:{load:t,await:true};
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
    LoadChunk(x,y) {
        x=Math.floor(x/5);
        y=Math.floor(y/5);
        for(let i=this.chunks[x].xmin;i<=this.chunks[x].xmax;i++){
            for(let j=this.chunks[x].ypos[y].ymin;j<=this.chunks[x].ypos[y].ymax;j++){
                if(this.grid[i][j]&&this.grid[i][j].load){
                    let img = this.grid[i][j].load;
                    let obj = gridAdd(i,j)
                    scene.object.SetImage(obj,img);
                    this.grid[i][j] = obj;
                };
            };
        };
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