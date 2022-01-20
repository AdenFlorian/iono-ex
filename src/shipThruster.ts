import { vec, Polygon, Color, Actor } from 'excalibur'



export function createShipThrusterVisual(shipWidthHalf: number, shipHeightHalf: number) {

  const shipThrusterVisual = new Actor({
    x: 0,
    y: 23,
  })

  const thrusterPoints = [
    vec(-shipWidthHalf / 2, -10),
    vec(0, -15),
    vec(shipWidthHalf / 2, -10),
    vec(0, shipHeightHalf / 2),
  ]
  const thrusterGraphic = new Polygon({
    points: thrusterPoints,
    color: Color.Transparent,
    strokeColor: Color.White,
    lineWidth: 2,
    smoothing: true,
  })
  shipThrusterVisual.graphics.use(thrusterGraphic)
  shipThrusterVisual.graphics.visible = false

  return shipThrusterVisual
}