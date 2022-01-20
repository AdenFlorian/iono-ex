import { Actor, Engine, vec, Input, Color, Polygon } from 'excalibur'
import { ShipClone } from './ShipClone'
import { createShipThrusterVisual } from './shipThruster'

const turnSpeed = 0.005
const maxVel = 500
const acceleration = 0.3

const shipClonePositions = [
  vec(-1, -1), vec(0, -1), vec(1, -1),
  vec(-1, 0), vec(1, 0),
  vec(-1, 1), vec(0, 1), vec(1, 1),
]

const shipScale = 1
const shipWidth = 30 * shipScale
const shipWidthHalf = shipWidth / 2
const shipHeight = 40 * shipScale
const shipHeightHalf = shipHeight / 2
const trianglePoints = [
  vec(-shipWidthHalf, shipHeightHalf),
  vec(0, -shipHeightHalf),
  vec(shipWidthHalf, shipHeightHalf),
  vec(0, shipHeightHalf / 2),
]
const shipPolygon = new Polygon({
  points: trianglePoints,
  color: Color.Transparent,
  strokeColor: Color.White,
  lineWidth: 2,
  smoothing: true,
})

export class PlayerShip extends Actor {
  public shipThrusterVisual: Actor
  public shipClones: readonly ShipClone[]

  onInitialize(engine: Engine): void {
    this.pos = vec(engine.drawWidth / 2, engine.drawHeight / 2)

    this.shipThrusterVisual = createShipThrusterVisual(shipWidthHalf, shipHeightHalf)

    this.addChild(this.shipThrusterVisual)

    this.shipClones = shipClonePositions.map(x => {
      const newShip = new ShipClone(x, {
        color: Color.White,
      })
      newShip.graphics.use(shipPolygon)
      engine.add(newShip)
      return newShip
    })


    this.graphics.use(shipPolygon)
  }

  onPostUpdate(engine: Engine, delta: number): void {
    if (engine.input.keyboard.isHeld(Input.Keys.W)) {
      this.body.vel = this.body.vel.add(vec(0, -acceleration * delta).rotate(this.body.rotation))
      this.shipThrusterVisual.graphics.visible = true
    } else {
      this.shipThrusterVisual.graphics.visible = false
    }
    if (engine.input.keyboard.isHeld(Input.Keys.A)) {
      this.body.rotation -= turnSpeed * delta
    }
    if (engine.input.keyboard.isHeld(Input.Keys.D)) {
      this.body.rotation += turnSpeed * delta
    }
    if (this.pos.y > engine.drawHeight) {
      this.pos.y = 0
    }
    if (this.pos.y < 0) {
      this.pos.y = engine.drawHeight
    }
    if (this.pos.x > engine.drawWidth) {
      this.pos.x = 0
    }
    if (this.pos.x < 0) {
      this.pos.x = engine.drawWidth
    }

    if (this.vel.size > maxVel) {
      this.vel.size = maxVel;
    }

    this.shipClones.forEach(x => {
      x.pos = this.pos.add(vec(engine.drawWidth * x.offset.x, engine.drawHeight * x.offset.y))
      x.rotation = this.rotation
    })
  }
}