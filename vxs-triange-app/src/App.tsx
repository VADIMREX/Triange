import React from 'react';
import './App.css';

import { newEngine } from '@vxs/triange-lib';

enum TriangleType {
  IsoscelesUp = "isoscelesUp",
  IsoscelesDown = "isoscelesDown",
}

function drawPoly(
  coords: number[],
  scol: string | CanvasGradient | CanvasPattern = "#808080",
  fcol: string | CanvasGradient | CanvasPattern = "#FFFFFF"
) {
  let canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 30;
  let ctx = canvas.getContext("2d");

  if (null == ctx) return "";

  ctx.beginPath();
  ctx.strokeStyle = scol;
  ctx.fillStyle = fcol;

  ctx.moveTo(coords[0], coords[1]); // `

  for (let i = 1; i < coords.length / 2; i++) {
    ctx.lineTo(coords[i * 2], coords[i * 2 + 1]);
  }

  ctx.lineTo(coords[0], coords[1]);

  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  return canvas.toDataURL();
}

interface TriangleProps {
  type: TriangleType,
  scol?: string | CanvasGradient | CanvasPattern,
  fcol?: string | CanvasGradient | CanvasPattern,
}

function makeTriangeCoords(type: TriangleType, width: number, height: number) {
  switch (type) {
    case TriangleType.IsoscelesDown:
      return [0, 0, width / 2, height, width, 0];
    case TriangleType.IsoscelesUp:
      return [0, height, width / 2, 0, width, height];
  }
  return [0, 0];
}

function Triangle(props: TriangleProps) {
  const type = props.type;
  const scol = undefined === props.scol ? "#808080" : props.scol;
  const fcol = undefined === props.fcol ? "#FFFFFF" : props.fcol;
  const mapName = props.useMap;

  let altText = "";
  const areaCoords = makeTriangeCoords(type, 50, 30);
  switch (type) {
    case TriangleType.IsoscelesDown:
      altText = '\\/';
      break;
    case TriangleType.IsoscelesUp:
      altText = '/\\';
      break;
  }

  const dataUrl = drawPoly(areaCoords, scol, fcol);

  return (
    <img src={dataUrl} alt={altText} style={{ marginRight: "-25px" }} useMap={mapName} />
  )
}

function App() {
  let engine = newEngine();

  engine.GenerateFiled(0)

  function onClick(ev: any, x: number, y: number) {
    console.log(ev, x, y);
  }

  function make() {
    let w = 50;
    let h = 30;
    let res = [];
    for (let i = 0; i < engine.Width + 2; i++) {
      for (let j = 0; j < engine.Heigh + 4; j++) {
        let type = (j % 2 + (i + 1) % 2) % 2 === 0 ? TriangleType.IsoscelesDown : TriangleType.IsoscelesUp;
        // let ch = engine.GetTraingle(i, j);
        let areaCoords = makeTriangeCoords(type, w, h).map((v, k) => k % 2 === 0 ? v + h * j : v + w * i);
        res.push((
          <area shape="poly" coords={areaCoords.join(",")} onClick={ev=>onClick(ev, j, i)} href="#" alt="" />
        ));
      }
    }

    return res;
  }

  return (
    <div>
      <map name="map">
        {make()}
      </map>
      <div>
        <Triangle type={TriangleType.IsoscelesUp} />
        <Triangle type={TriangleType.IsoscelesDown} />
        <Triangle type={TriangleType.IsoscelesUp} />
      </div>
      <img width={(engine.Width + 2) * 50} height={(engine.Heigh + 2) * 30} useMap="#map"/>
    </div>
  );
}

export default App;
