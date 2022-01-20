import { Actor, Vector, ActorArgs } from 'excalibur';


export class ShipClone extends Actor {
  public constructor(public readonly offset: Vector, config?: ActorArgs) {
    super(config)
  }
}