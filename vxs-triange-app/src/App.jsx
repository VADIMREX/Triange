import React from 'react';
import './App.css';

import { newEngine } from '@vxs/triange-lib';
var $ = window.$

var engine = newEngine(),
  scale = 1,
  w = 25,
  h = 30,
  b = false;

function toDiv(s) {
  s = s.replace(/\n/g, '<br>');
  s = s.replace(/ /g, '&nbsp;');
  document.getElementById('console').innerHTML = s;
}

/**
 * Определение позиции треугольника
 */
function detectTriangle(X, Y) {
  var ctga, pX, pY, dir, a;
  if (engine.GameStatus != 1) return;

  ctga = w / h;

  // определение треугольника в который щёлкнули
  pY = Math.floor(Y / h / scale);
  pX = Math.floor(X / w / scale);

  dir = (pX % 2 + (pY + 1) % 2) % 2;

  if (dir == 0) {
    a = Y - pY * h * scale;
  }
  else {
    a = (pY + 1) * h * scale - Y;
  }

  var pX1 = pX * w * scale + Math.floor(a * ctga);

  if (X > pX1) pX++;

  return new function () {
    this.x = pX;
    this.y = pY;
    this.dir = dir;
  };
}

/**
 * Инициализация на загрузке документа
 */
document.onreadystatechange = function () {

  /**
  * Нажатие мыши на треугольник
  */
  //$('#canvas').click(function(e){
  $('#canvas').mousedown(function (e) {
    // Обрабатывать только 1 нажатие вместо 2х
    if (b) {
      b = false;
      return;
    }
    b = true;

    var X, Y, coord, pX, pY;

    X = e.pageX - $(this).offset().left;
    Y = e.pageY - $(this).offset().top;

    if (engine.GameStatus != 1) return;

    coord = detectTriangle(X, Y);

    pX = coord.x;
    pY = coord.y;

    // ЛКМ
    if (e.button == 0) {
      // открыть область
      if (pX > 0 && pY > -1) engine.Open(pX - 1, pY);
    }
    // ПКМ
    else if (e.button == 2) {
      if (pX > 0 && pY > -1) engine.SetFlag(pX - 1, pY);
    }

    toCanvas(this);

    document.getElementById('status').innerHTML = engine.Checked + ' / ' + engine.Total;
    if (engine.GameStatus == 2) document.getElementById('status').innerHTML = "Вы выиграли!";
    if (engine.GameStatus == 3) document.getElementById('status').innerHTML = "Вы проиграли:(";
  });

  /**
   * Убераем контекстное меню на ПКМ
   */
  $('#canvas').bind('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });
}

/**
 * Рисование треугольника
 */
function drawTriangle(ctx, scol, fcol, dir, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = scol;
  ctx.fillStyle = fcol;
  if (dir == 0) { //  \/
    ctx.moveTo(x * w * scale, y * h * scale); // `
    ctx.lineTo((x + 1) * w * scale, (y + 1) * h * scale); //  \
    ctx.lineTo((x + 2) * w * scale, y * h * scale); //   /
    ctx.lineTo(x * w * scale, y * h * scale); //  -
  }
  else { //        /\
    ctx.moveTo(x * w * scale, (y + 1) * h * scale); // .
    ctx.lineTo((x + 1) * w * scale, y * h * scale); //  /
    ctx.lineTo((x + 2) * w * scale, (y + 1) * h * scale); //   \
    ctx.lineTo(x * w * scale, (y + 1) * h * scale); //  _
  }
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}
/**
 * Рисование текста
 */
function drawText(ctx, scol, fcol, val, dir, x, y) {
  ctx.beginPath();
  ctx.strokeStyle = scol;
  ctx.fillStyle = fcol;
  x = ((x + 1) * w - 3) * scale;
  if (dir == 0) y = (y * h + 15) * scale;
  else y = (y * h + 25) * scale;
  ctx.strokeText(val, x, y);
  ctx.fillText(val, x, y);
  ctx.closePath();
}
/**
 * Рисование мины
 */
function drawMine(ctx, dir, x, y) {
  var rad1 = 55;
  var rad2 = 50;
  var rad3 = 12;
  var rad4 = 5;

  var xoff1 = Math.sin(Math.PI * 1 / 18) * rad1;
  var yoff1 = Math.sqrt(rad3 * rad3 - xoff1 * xoff1);

  var yoff2 = dir == 0 ? 10 : 0;

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.fillStyle = "green";

  ctx.moveTo(((x + 1) * w - xoff1) * scale, ((y + 1) * h - 10 - yoff2) * scale);
  ctx.arc((x + 1) * w * scale, ((y - 1) * h - yoff2) * scale, rad1 * scale, Math.PI * 10 / 18, Math.PI * 8 / 18, true);
  ctx.lineTo(((x + 1) * w + xoff1) * scale, ((y + 1) * h - 10 - yoff2) * scale);

  ctx.arc((x + 1) * w * scale, ((y + 1) * h - 10 + yoff1 - yoff2) * scale, rad3 * scale, 2 * Math.PI - Math.acos(xoff1 / rad3), Math.PI + Math.acos(xoff1 / rad3), true);

  ctx.fill();
  ctx.stroke();

  ctx.closePath();
  ctx.beginPath();

  ctx.closePath();
  ctx.beginPath();

  ctx.fillStyle = "red";
  ctx.arc((x + 1) * w * scale, ((y + 0.5) * h - 1.5 - yoff2) * scale, rad4 * scale, Math.PI * 5 / 6, Math.PI * 1 / 6, true);
  ctx.arc((x + 1) * w * scale, ((y + 0.5) * h + 3.5 - yoff2) * scale, rad4 * scale, Math.PI * 11 / 6, Math.PI * 7 / 6, true);

  ctx.fill();
  ctx.stroke();

  ctx.closePath();
}

/**
 * Рисование флага
 */
function drawFlag(ctx, dir, x, y) {
  var yoff = dir == 0 ? 0 : 7;
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.moveTo(((x + 1) * w - 2) * scale, (y * h + 5 + yoff) * scale);
  ctx.lineTo(((x + 1) * w + 10) * scale, (y * h + 8 + yoff) * scale);
  ctx.lineTo(((x + 1) * w - 2) * scale, (y * h + 11 + yoff) * scale);
  ctx.stroke()
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "Black";
  ctx.fillStyle = "Sienna";
  ctx.moveTo(((x + 1) * w - 2) * scale, (y * h + 5 + yoff) * scale);
  ctx.lineTo(((x + 1) * w - 5) * scale, (y * h + 5 + yoff) * scale);
  ctx.lineTo(((x + 1) * w - 5) * scale, (y * h + 18 + yoff) * scale);
  ctx.lineTo(((x + 1) * w - 2) * scale, (y * h + 18 + yoff) * scale);
  ctx.lineTo(((x + 1) * w - 2) * scale, (y * h + 5 + yoff) * scale);
  ctx.stroke()
  ctx.fill();
  ctx.closePath();
}
/**
 * Рисование треугольника поля
 */
function drawCellTriangle(ctx, val, dir, x, y) {
  var tcl = ["white",
    "blue", "green", "red",
    "purple", "maroon", "aqua",
    "teal", "purple", "navy"];
  tcl['A'] = "lime";
  tcl['B'] = "olive";
  tcl['C'] = "fuchsia";
  tcl[13] = "red";

  switch (val) {
    case '#': drawTriangle(ctx, "#808080", "#000000", dir, x, y); break;
    case '%': drawTriangle(ctx, "#808080", "#CCCCCC", dir, x, y); break;
    case ' ': drawTriangle(ctx, "#808080", "#FFFFFF", dir, x, y); break;
    case '1': case '2': case '3':
    case '4': case '5': case '6':
    case '7': case '8': case '9': drawTriangle(ctx, "#808080", "#FFFFFF", dir, x, y); drawText(ctx, tcl[val], tcl[val], val, dir, x, y); break;
    case 'A': case 'B': case 'C': drawTriangle(ctx, "#808080", "#FFFFFF", dir, x, y); drawText(ctx, tcl[val], tcl[val], val, dir, x, y); break;
    case 'X': drawTriangle(ctx, "#808080", "#FFAAAA", dir, x, y); drawMine(ctx, dir, x, y); break;
    case 'b': drawTriangle(ctx, "#808080", "#404040", dir, x, y); drawMine(ctx, dir, x, y); break;
    case 'f': case 'm': drawTriangle(ctx, "#808080", "#CCCCCC", dir, x, y); drawFlag(ctx, dir, x, y); break;
    case '?': drawTriangle(ctx, "#808080", "#CCCCCC", dir, x, y); drawText(ctx, "#000018", "#000018", val, dir, x, y); break;
    default: drawTriangle(ctx, "#808080", "#000000", dir, x, y); break;
  }
};
function toCanvas(c) {
  var ctx = c.getContext('2d'),
    i, j, dir, ch;

  if (engine.GameStatus < 1) return;

  c.height = (engine.Heigh + 2) * h * scale;
  c.width = (engine.Width + 5) * w * scale;

  ctx.font = "bold " + (13 * scale) + "px sans-serif";

  // Заливка и отрисовка занчений
  for (i = 0; i < engine.Heigh + 2; i++) {
    for (j = 0; j < engine.Width + 4; j++) {
      dir = (j % 2 + (i + 1) % 2) % 2;
      ch = engine.GetTraingle(j, i);
      drawCellTriangle(ctx, ch, dir, j, i);
    }
  }
}

function btn_click(a) {
  var canvas = document.getElementById('canvas');
  if (a.value == "Новичок") {
    engine.GenerateFiled(0);
    engine.GameStart();
    toCanvas(canvas);
  }
  if (a.value == "Любитель") {
    engine.GenerateFiled(1);
    engine.GameStart();
    toCanvas(canvas);
  }
  if (a.value == "Профессионал") {
    engine.GenerateFiled(2);
    engine.GameStart();
    toCanvas(canvas);
  }
  if (a.value == "Эксперт") {
    engine.GenerateFiled(3);
    engine.GameStart();
    toCanvas(canvas);
  }
  if (a.value == "Особые") {
    engine.GenerateFiled(document.getElementById('h').value,
      document.getElementById('w').value,
      document.getElementById('c').value);
    engine.GameStart();
    toCanvas(canvas);
  }
  else if (a.value == "btn2") {
    let s = engine.SimpleConsoleView();
    toDiv(s);
  }
  else if (a.value == "btn3") {
    let s = engine.SimpleConsoleViewNotOpen();
    toDiv(s);
  }
  else if (a.value == "btn4") {
    var ctx = canvas.getContext('2d');
    var v_scale = scale;
    scale = 10;
    canvas.width *= 10;
    canvas.height *= 10;
    drawTriangle(ctx, "#808080", "#CCCCCC", 0, 0, 0);
    drawMine(ctx, 0, 0, 0);
    scale = v_scale;
  }
};
function setScale(a) {
  scale = a;
  document.getElementById('cur_scale').innerHTML = a;
  if (document.getElementById('scale').innerHTML != a) scale.value = a;
}
function useq(a) {
  engine.SetUseQuestion(a);
}

function App() {
  return (
    <div>
      <div>
        Количество мин <span id="status" style={{fontWeight: "bold"}}>0 / 0</span><br />
        <input type="button" id="btn_nov" value={"Новичок"} onClick={(ev)=>btn_click(ev.target)} />
        <input type="button" id="btn_hob" value={"Любитель"} onClick={(ev)=>btn_click(ev.target)} />
        <input type="button" id="btn_pro" value={"Профессионал"} onClick={(ev)=>btn_click(ev.target)} />
        <input type="button" id="btn_exp" value={"Эксперт"} onClick={(ev)=>btn_click(ev.target)} /><br />
      </div>
      <canvas id="canvas" style={{border: "1px solid"}} width={50} height={30}>
      </canvas><br />
      <div>
        Ширина <input type="text" id="w" name="w" style={{width: "30pt"}} value="11" />
        Высота <input type="text" id="h" name="h" style={{width: "30pt"}} value="11" />
        Количество мин <input type="text" id="c" name="c" style={{width: "30pt"}} value="10" /><br />
        <input type="button" id="btn_cus" value="Особые" onClick={(ev)=>btn_click(ev.target)} /><br />
        Масштаб <input type="range" id="scale" min="0.5" value="1" max="10" step="0.1" onChange={(ev)=>setScale(ev.target.value)} />
        <span id="cur_scale">1</span>
        <input type="button" id="def_scale" value="Сбросить" onClick={()=>setScale(1)} /><br />
        <input type="checkbox" id="useq" onChange={(ev)=>useq(ev.target.checked)} /><label htmlFor="useq">Использовать "?"</label>
        <div id="console" style={{fontFamily: "Consolas, Courier New, Courier;"}}></div>
      </div>
    </div>
  );
}

export default App;
