class SingleCell {
    constructor(index){
       
        this.isEmtpy=false;
        this.index = index;

        this.cell = document.createElement("div");
        this.cell.id = "cellContainer"    
        this.cell.innerHTML = index;
        this.cell.addEventListener("click",()=> {
            gameCells.Move(this.index);
        });
       
        if(index == 0 ){
            this.cell.innerHTML = "";
            this.isEmtpy = true;
            this.cell.id = "EmptyCell";
        }

    } 
}

class GameManager{

    
    constructor(){
        this.moveCount = 0;
        this.isMoved = false;
        this.CurrentState = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
        this.WinState = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
        
        this.cells =[];
        
        for(var i=0;i<16;i++){
            this.cells[i] = new SingleCell(i);
        }
    }
        
    tryDirection(pos,dir){
        try{
            if((pos%4 == 3 && (pos+dir)%4 ==0) || (pos%4 == 0 && (pos+dir)%4 ==3) )
            return;
            
            if(this.cells[this.CurrentState[pos+dir]].index == 0){
                
                var temp = this.CurrentState[pos+dir];
                this.CurrentState[pos+dir] = this.CurrentState[pos];
                this.CurrentState[pos] = temp;
                
                console.log(this.CurrentState);
                this.isMoved = true;
            }
        }
         catch(error){}   
    }

    Move(index){
            
            for(var pos = 0; pos<16;pos++){
                if(this.CurrentState[pos] == index){
                    break;
                }
            }

            this.tryDirection(pos,1);
            this.tryDirection(pos,-1);
            this.tryDirection(pos,4);
            this.tryDirection(pos,-4);

            if(this.isMoved){
            
                this.Refresh();
                this.moveCount++;
                this.isMoved = false;
                document.getElementById("moves").innerHTML = this.moveCount;
                this.CheckGameState();
            }


    }
        
    Refresh(){
        for(var i=0;i<16;i++){
            this.cells[i].cell.style.animation = "";
            document.querySelector(".playGround").appendChild(this.cells[this.CurrentState[i]].cell);
        } 
    }
    GenerateRandDir(){
        var rand= Math.floor(Math.random() * 4 + 1)
        switch (rand) {
            case 1:     return 1;
            case 2:     return -1;
            case 3:     return 4;
            case 4:     return -4;
            default:    return 0;        
        }
    }

    Shuffle(array) {
        var currentIndex=15;
        var randArray = array;
        for(var i = 0 ; i<100;i++)
        {
            var a = this.GenerateRandDir();
            var move = currentIndex + a;
            console.log(currentIndex +" + " + a + " = " + move );

            if(move >15 || move <0){
                move = currentIndex;
            }
        
            if((currentIndex%4 == 3 && move%4 ==0) || (currentIndex%4 == 0 && move%4 ==3) ){
                continue;
            }
            var temp= randArray[currentIndex];
            randArray[currentIndex] = randArray[move];
            randArray[move]=temp;
            currentIndex =move;
        }
            return randArray;
    }

    RandomizeCells(){       
        this.CurrentState = this.Shuffle(this.CurrentState);        
        this.Refresh();
    }
    CheckGameState(){
        var rightCells=0;
        for(var i=0;i<16;i++){
            if(this.cells[this.CurrentState[i]].cell.id == "EmptyCell"){
                continue;
            }
            if(this.WinState[i]==this.CurrentState[i]){
                this.cells[this.CurrentState[i]].cell.id = "RigthPosition";
                rightCells++;
            }
            else{
                this.cells[this.CurrentState[i]].cell.id = "cellContainer";
            }
        }
        if(rightCells == 15){
            this.cells.forEach(element => {
                element.cell.style.animationName = "winAnim";
                element.cell.style.animationDuration = "2s";
                element.cell.style.animationIterationCount = "3";
                
            });
            alert("Oyunu Yedin Yedin");
            start_stop = false;
        }
    }
    
}


/*=====================*/
let minute = 00;
let second = -1;
var start_stop = false;
function timer(){
    if(start_stop == false)
        return;

    second++;

    if (second == 60) {
        minute++;
        second = 0;
    }
 
    let minString = minute;
    let secString = second;
 
    if (minute < 10) {
        minString = "0" + minString;
    }
 
    if (second < 10) {
        secString = "0" + secString;
    }

    document.getElementById("time").innerHTML = minString + ":" + secString;
    setTimeout(timer, 1000);   
}

var timerEnabled= false;
let gameCells = new GameManager();
gameCells.Refresh();

function StartGame(button){
    button.innerHTML = "Restart";
    start_stop = true;
    if(timerEnabled==false){
        timer();
        timerEnabled = true;
    }
    else{
        second = -1;
        minute = 0;
    }
    gameCells.moveCount = 0;
    gameCells.RandomizeCells();
}
