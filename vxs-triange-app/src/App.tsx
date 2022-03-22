import React from 'react';
import './App.css';

import { newEngine } from '@vxs/triange-lib';

enum TriangleType {
  IsoscelesUp = "isoscelesUp",
  IsoscelesDown = "isoscelesDown",
}

function drawTriangle(type: TriangleType,
  scol: string | CanvasGradient | CanvasPattern = "#808080",
  fcol: string | CanvasGradient | CanvasPattern = "#FFFFFF",
  width: number = 50,
  height: number = 30) {
  let canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 30;
  let ctx = canvas.getContext("2d");

  if (null == ctx) return "";

  let scale = 1;

  ctx.beginPath();
  ctx.strokeStyle = scol;
  ctx.fillStyle = fcol;

  switch (type) {
    case TriangleType.IsoscelesDown:
      ctx.moveTo(0, 0); // `
      ctx.lineTo(width / 2 * scale, height * scale); //  \
      ctx.lineTo(width * scale, 0); //   /
      ctx.lineTo(0, 0); //  -
      break;
    case TriangleType.IsoscelesUp:
      ctx.moveTo(0, height * scale); // .
      ctx.lineTo(width / 2 * scale, 0); //  /
      ctx.lineTo(width * scale, height * scale); //   \
      ctx.lineTo(0, height * scale); //  _
      break;
  }

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
  const dataUrl = drawTriangle(type, scol, fcol);
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

  return (
    <>
      <map name={id}>
        <area shape="poly" coords={areaCoords}
          onClick={onClick} href="#" alt="" />
      </map>
      <img src={dataUrl} alt={altText} useMap={mapName} />
    </>
  )
}

function App() {

  function onclick(ev: any) {
    console.log(ev);
  }

  return (
    <div>
      <Triangle id={0} type={TriangleType.IsoscelesUp} onClick={onclick} />
      <Triangle id={1} type={TriangleType.IsoscelesDown} onClick={onclick} />
      <Triangle id={2} type={TriangleType.IsoscelesUp} onClick={onclick} />
    </div>
  );
}

export default App;
