import { Color, Engine, DisplayMode } from 'excalibur'
import { PlayerShip } from './playerShip';

const game = new Engine({
  width: 900,
  height: 600,
  backgroundColor: Color.Black,
  displayMode: DisplayMode.Fixed
});

game.screen.antialiasing = true;

const playerShip = new PlayerShip()

game.add(playerShip);

game.start()