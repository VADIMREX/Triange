/*
  JS библиотека треугольного сапёра, Автор VADIMREX
  
  Реализован класс Triangle_minesweeper_lib в котором есть все необходимые методы
  чтобы реализовать игру
*/

t_mine = function()
{
  this.x = 0;
  this.y = 0;
}

Triangle_minesweeper_lib = function(){
  
  this.field = [];
  this.gameStatus = 0;
  this.opened = 0;
  this.remain = 0;
  this.total = 0;
  this.checked = 0;
  this.heigh = 0;
  this.width = 0;
  this.mines = [];
};
/**
 * стандартные 4 режима сложности: <br>
 * 0 - 11х11 и 10 мин              <br>
 * 1 - 18х18 и 40 мин              <br>
 * 2 - 20х40 и 100 мин             <br>
 * 3 - 50х50 и 500 мин             <br>
 */
Triangle_minesweeper_lib.prototype.modes = [[11,11,10],[18,18,40],[20,40,100],[50,50,500]];

Triangle_minesweeper_lib.prototype.simpleConsoleView = function(){
  var c, s = '';
  for(var i = 0; i < this.field.length; i++){
    c = '';
    for(var j = 0; j < this.field[i].length; j++){
      switch(this.field[i][j]){
      case 0                    : c = '  '; break;
      case 1: case 2: case 3    : 
      case 4: case 5: case 6    :
      case 7: case 8: case 9    : c = ' ' + this.field[i][j]; break;
      case 10: case 11: case 12 : c = this.field[i][j]; break;
      case 13                   : c = ' *'; break;
      case 0x1D                 : c = ' X'; break;
      case 127                  : c = '##'; break;
      }
      s += c;
    }
    s += '\n';
  }
  return s;
};
/**
 * Выводит в консоль поле, подходит к ещё не раскрытому полю
 */
Triangle_minesweeper_lib.prototype.simpleConsoleViewNotOpen = function(){
  var c, s = '';
  for(var i=0; i < this.field.length; i++){
    c = "";
    for(var j=0; j < this.field[i].length; j++){
      switch(this.field[i][j])
      {
      case 0x10: c = "  "; break; 
      case 0x11: case 0x12: case 0x13: 
      case 0x14: case 0x15: case 0x16: 
      case 0x17: case 0x18: case 0x19: c = " " + (this.field[i][j]-0x10); break;
      case 0x1A: c = " A"; break;
      case 0x1B: c = " B"; break;
      case 0x1C: c = " C"; break;//String.valueOf((char)(0xe291a00field[i][j])); break;
      case 0x1D: c = " X"; break;
      case 127 : c = '&#9608;&#9608;'; break;
      default : c = "&#9617;&#9617;"; break;
      }
      s += c;
    }
    s += "\n";
  }
  return s;
};
/**
 * Создаёт поле в зависимости от параметров
 * @param {number} a - высота поля
 * @param {number} b - ширина поля
 * @param {number} c - количество мин
 */
Triangle_minesweeper_lib.prototype.field_gen = function(a, b, c){
  /**
   * Создаёт поле в зависимости от сложности
   * @param mode номер сложности в массиве {@link modes}
   * @throws Exception если такой сложности нет
   */
  if(b==undefined&&c==undefined){
    this.field_gen(this.modes[a][0],this.modes[a][1],this.modes[a][2]);
    return;
  };
  
  this.opened = 0;
  this.remain = a * b - c;
  
  this.total = c;
  
  this.heigh = a;
  this.width = b;
  
  var i, j, dir;
  var m = 0;
  
  this.field = [];
  this.mines = [];
  
  for(i=0;i<a+2;i++){
    this.field[i] = [];
    for(j=0;j<b+4;j++)this.field[i][j]=0;
  }
  
  while(m<c){
    var x = Math.floor(Math.random()*b+2);
    var y = Math.floor(Math.random()*a+1);
    if(13 == this.field[y][x])continue;
    this.field[y][x] = 13;
    this.mines[m] = new t_mine()
    this.mines[m].x = x;
    this.mines[m].y = y;
    m++;
  }
  for(i=1;i<a+1;i++)for(j=2;j<b+2;j++)if(13==this.field[i][j]){
    dir = (j%2+(i+1)%2)%2;  
    if(0==dir){
      if(this.field[i-1][j-2]<13)this.field[i-1][j-2]++;
      if(this.field[i-1][j-1]<13)this.field[i-1][j-1]++;
      if(this.field[i-1][j]<13)  this.field[i-1][j]++;
      if(this.field[i-1][j+1]<13)this.field[i-1][j+1]++;
      if(this.field[i-1][j+2]<13)this.field[i-1][j+2]++;
      
      if(this.field[i][j-2]<13)this.field[i][j-2]++;
      if(this.field[i][j-1]<13)this.field[i][j-1]++;
      if(this.field[i][j]<13)  this.field[i][j]++;
      if(this.field[i][j+1]<13)this.field[i][j+1]++;
      if(this.field[i][j+2]<13)this.field[i][j+2]++;
      
      if(this.field[i+1][j-1]<13)this.field[i+1][j-1]++;
      if(this.field[i+1][j]<13)  this.field[i+1][j]++;
      if(this.field[i+1][j+1]<13)this.field[i+1][j+1]++;	
    }
    else{
      if(this.field[i-1][j-1]<13)this.field[i-1][j-1]++;
      if(this.field[i-1][j]<13)  this.field[i-1][j]++;
      if(this.field[i-1][j+1]<13)this.field[i-1][j+1]++;	
  
      if(this.field[i][j-2]<13)this.field[i][j-2]++;
      if(this.field[i][j-1]<13)this.field[i][j-1]++;
      if(this.field[i][j]<13)  this.field[i][j]++;
      if(this.field[i][j+1]<13)this.field[i][j+1]++;
      if(this.field[i][j+2]<13)this.field[i][j+2]++;
  
      if(this.field[i+1][j-2]<13)this.field[i+1][j-2]++;
      if(this.field[i+1][j-1]<13)this.field[i+1][j-1]++;
      if(this.field[i+1][j]<13)  this.field[i+1][j]++;
      if(this.field[i+1][j+1]<13)this.field[i+1][j+1]++;
      if(this.field[i+1][j+2]<13)this.field[i+1][j+2]++;
    }
  }
  for(i=0;i<b+4;i++){
    this.field[0][i] = 127;
    this.field[a+1][i] = 127;
  }
  for(i=1;i<a+1;i++){
    this.field[i][0] = 127;
    this.field[i][1] = 127;
    this.field[i][b+2] = 127;
    this.field[i][b+3] = 127;
  }			
};
/**
 * Открыть поле
 * @param {number} x 
 * @param {number} y 
 */
Triangle_minesweeper_lib.prototype.Open = function(x, y){
  var dir = (x%2+(y+1)%2)%2;
  switch(this.field[y][x]){		
  case 0: 
    this.field[y][x] += 16;
    if(0==dir){
      this.Open(x-2,y-1);
      this.Open(x-1,y-1);
      this.Open(x,  y-1);
      this.Open(x+1,y-1);
      this.Open(x+2,y-1);

      this.Open(x-2,y);
      this.Open(x-1,y);
      this.Open(x,  y);
      this.Open(x+1,y);
      this.Open(x+2,y);

      this.Open(x-1,y+1);
      this.Open(x,  y+1);
      this.Open(x+1,y+1);
    }
    else{
      this.Open(x-1,y-1);
      this.Open(x,  y-1);
      this.Open(x+1,y-1);

      this.Open(x-2,y);
      this.Open(x-1,y);
      this.Open(x,  y);
      this.Open(x+1,y);
      this.Open(x+2,y);

      this.Open(x-2,y+1);
      this.Open(x-1,y+1);
      this.Open(x,  y+1);
      this.Open(x+1,y+1);
      this.Open(x+2,y+1);
    }
    this.opened++;
  break;
  case 1:case 2:case 3:
  case 4:case 5:case 6:
  case 7:case 8:case 9:
  case 10:case 11:case 12: 
    this.field[y][x] += 16; 
    this.opened++; 
  break;
  case 13: 
    this.field[y][x] += 16; 
    this.openFail();
    this.gameStatus = 3; 
  break;
  }
  if(this.opened==this.remain)
  {
    this.gameStatus = 2;
    this.openWin();
  }
};

Triangle_minesweeper_lib.prototype.getTraingle = function(x, y){
  var c;
  switch(this.field[y][x]){
  case 0x10 : c = ' '; break;
  case 0x11: case 0x12: case 0x13:
  case 0x14: case 0x15: case 0x16:
  case 0x17: case 0x18: case 0x19: c = "" + (this.field[y][x]-0x10); break;
  case 0x1A: c = 'A'; break;
  case 0x1B: c = 'B'; break; 
  case 0x1C: c = 'C'; break;
  case 0x1D: c = 'X'; break;
  case 0x2D: c = 'm'; break;
  case 0x3D: c = 'b'; break;
  case 0x7F: c = '#'; break;
  default:
      if(this.field[y][x] >= 0x50) c = '?';
        else if(this.field[y][x] >= 0x40) c = 'f';
        else c = '%';
    break;
  }
  return c;
};
/**
 * Получить массив в котором хранятся данные по полю
 * @return поле в виде массива из byte
 */
Triangle_minesweeper_lib.prototype.getfield = function(){ return this.field; };

Triangle_minesweeper_lib.prototype.gameStart = function(){ this.gameStatus = 1; };

Triangle_minesweeper_lib.prototype.gameEnd = function(){ this.gameStatus = 3; };

Triangle_minesweeper_lib.prototype.getGameStatus = function(){ return this.gameStatus; };

Triangle_minesweeper_lib.prototype.getOpened = function(){ return this.opened; }; 

Triangle_minesweeper_lib.prototype.getTotal = function(){ return this.total; }; 

Triangle_minesweeper_lib.prototype.getChecked = function(){ return this.checked; }; 

Triangle_minesweeper_lib.prototype.getHeigh = function(){ return this.heigh; }; 

Triangle_minesweeper_lib.prototype.getWidth = function(){ return this.width; }; 

Triangle_minesweeper_lib.prototype.openFail = function(){ 
  var i;
  for(i=0; i<this.mines.length; i++){
    if(this.field[this.mines[i].y][this.mines[i].x]!=0x1D){
        this.field[this.mines[i].y][this.mines[i].x] = 0x3D;
      }
  }
}; 

Triangle_minesweeper_lib.prototype.openWin = function(){
  var i;
  for(i=0; i<this.mines.length; i++)this.field[this.mines[i].y][this.mines[i].x] = 0x2D;
}; 

Triangle_minesweeper_lib.prototype.setFlag = function(x, y){
  if(this.field[y][x] >= 0x60) return;
  else if(this.field[y][x] >= 0x50)this.field[y][x] -= 0x50;
    else if(this.field[y][x] >= 0x40){
      if(this.checkmode)this.field[y][x] += 0x10;
      else this.field[y][x] -= 0x40;
      this.checked--;
    }
    else if(this.field[y][x] < 0x10){
      this.field[y][x] += 0x40;
      this.checked++;
    }
};

Triangle_minesweeper_lib.prototype.setUseQuestion = function(use){
  this.checkmode = use;
};

function newEngine()
{
  return new Triangle_minesweeper_lib();
}	