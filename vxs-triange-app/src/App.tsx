import React from 'react';
import './App.css';

import { newEngine } from '@vxs/triange-lib';

enum TriangleType {
  IsoscelesUp = "isoscelesUp",
  IsoscelesDown = "isoscelesDown",
}

function drawPoly(
  coords: string,
  scol: string | CanvasGradient | CanvasPattern = "#808080",
  fcol: string | CanvasGradient | CanvasPattern = "#FFFFFF"
) {
  let canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 30;
  let ctx = canvas.getContext("2d");

  if (null == ctx) return "";

  let points = coords.split(',');

  ctx.beginPath();
  ctx.strokeStyle = scol;
  ctx.fillStyle = fcol;

  ctx.moveTo(+points[0], +points[1]); // `

  for (let i = 1; i < points.length / 2; i++) {
    ctx.lineTo(+points[i * 2], +points[i * 2 + 1]);
  }

  ctx.lineTo(+points[0], +points[1]);

  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  return canvas.toDataURL();
}

interface TriangleProps {
  id: any,
  type: TriangleType,
  scol?: string | CanvasGradient | CanvasPattern,
  fcol?: string | CanvasGradient | CanvasPattern,
  onClick?: (...args: any[]) => void
}

function Triangle(props: TriangleProps) {
  const type = props.type;
  const scol = undefined === props.scol ? "#808080" : props.scol;
  const fcol = undefined === props.fcol ? "#FFFFFF" : props.fcol;

  const id = props.id;
  const mapName = `#${id}`;

  function onClick(ev: any) {
    if (undefined === props.onClick) return;
    props.onClick(props.id);
  }

  let altText = "";
  let areaCoords = "";
  switch (type) {
    case TriangleType.IsoscelesDown:
      altText = '\\/';
      areaCoords = "0,0,25,30,50,0";
      break;
    case TriangleType.IsoscelesUp:
      altText = '/\\';
      areaCoords = "0,30,25,0,50,30";
      break;
  }

  const dataUrl = drawPoly(areaCoords, scol, fcol);

  return (
    <>
      <map name={id}>
        <area shape="poly" coords={areaCoords}
          onClick={onClick} href="#" alt="" />
      </map>
      <img src={dataUrl} alt={altText} style={{ marginRight: "-25px" }} useMap={mapName} />
    </>
  )
}

function App() {

  function onclick(ev: any) {
    console.log(ev);
  }

  return (
    <div>
      {/* <img width={100} height={30}/> */}
      <div>
        <Triangle id={0} type={TriangleType.IsoscelesUp} onClick={onclick} />
        <Triangle id={1} type={TriangleType.IsoscelesDown} onClick={onclick} />
        <Triangle id={2} type={TriangleType.IsoscelesUp} onClick={onclick} />
      </div>
    </div>
  );
}

export default App;
