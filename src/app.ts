import {
  Actor, Color, Engine, vec, Input,
  Polygon, Vector, ActorArgs, DisplayMode
} from 'excalibur'

const actor = new Actor()

const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.Black,
  displayMode: DisplayMode.Fixed
});

game.screen.antialiasing = true;

const playerShip = new Actor({
  x: game.drawWidth / 2,
  y: game.drawHeight / 2,
  color: Color.White,
})

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
const triangleGraphic = new Polygon({
  points: trianglePoints,
  color: Color.Transparent,
  strokeColor: Color.White,
  lineWidth: 2,
  smoothing: true,
})
playerShip.graphics.use(triangleGraphic)

const shipPositions = [
  vec(-1, -1), vec(0, -1), vec(1, -1),
  vec(-1, 0), vec(1, 0),
  vec(-1, 1), vec(0, 1), vec(1, 1),
]

class ShipClone extends Actor {
  public constructor(public readonly offset: Vector, config?: ActorArgs) {
    super(config)
  }
}

const ships = shipPositions.map(x => {
  const newShip = new ShipClone(x, {
    color: Color.White,
  })
  newShip.graphics.use(triangleGraphic)
  return newShip
})

ships.forEach(x => {
  game.add(x)
})

const shipThrusterVisual = new Actor({
  x: 0,
  y: 23,
})

playerShip.addChild(shipThrusterVisual)

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

const turnSpeed = 0.005
const maxVel = 500
const acceleration = 0.3

playerShip.on('postupdate', ({ delta }) => {
  if (game.input.keyboard.isHeld(Input.Keys.W)) {
    playerShip.body.vel = playerShip.body.vel.add(vec(0, -acceleration * delta).rotate(playerShip.body.rotation))
    shipThrusterVisual.graphics.visible = true
  } else {
    shipThrusterVisual.graphics.visible = false
  }
  if (game.input.keyboard.isHeld(Input.Keys.A)) {
    playerShip.body.rotation -= turnSpeed * delta
  }
  if (game.input.keyboard.isHeld(Input.Keys.D)) {
    playerShip.body.rotation += turnSpeed * delta
  }
  if (playerShip.pos.y > game.drawHeight) {
    playerShip.pos.y = 0
  }
  if (playerShip.pos.y < 0) {
    playerShip.pos.y = game.drawHeight
  }
  if (playerShip.pos.x > game.drawWidth) {
    playerShip.pos.x = 0
  }
  if (playerShip.pos.x < 0) {
    playerShip.pos.x = game.drawWidth
  }

  if (playerShip.vel.size > maxVel) {
    playerShip.vel.size = maxVel;
  }

  ships.forEach(x => {
    x.pos = playerShip.pos.add(vec(game.drawWidth * x.offset.x, game.drawHeight * x.offset.y))
    x.rotation = playerShip.rotation
  })
})

game.add(playerShip);

game.start()