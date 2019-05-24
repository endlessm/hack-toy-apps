import { inject } from "@robotlegsjs/core";
import { GAME } from "../../constants/constants";
import { SceneKey } from "../../constants/types";
import { GameScene } from "../../scenes/GameScene";
import { AbstractCommand } from "../AbstractCommand";

export class InitializePhysicsCommand extends AbstractCommand {
  @inject(GAME)
  private _game: Phaser.Game;

  private _scene: GameScene;
  public execute(): void {
    super.execute();

    this._scene = this._game.scene.getScene(SceneKey.Game) as GameScene;

    this._scene.matter.world.setBounds();
    this._scene.matter.world.setGravity(0, 5);
    // this._scene.matter.add.pointerConstraint({});

    // PATCHING MATTER BODY UPDATE LOOP TO SUPPORT PER BODY GRAVITY
    // @ts-ignore
    const Bounds = Phaser.Physics.Matter.Matter.Bounds;
    // @ts-ignore
    const Body = Phaser.Physics.Matter.Matter.Body;
    // @ts-ignore
    const Vector = Phaser.Physics.Matter.Matter.Vector;
    // @ts-ignore
    const Vertices = Phaser.Physics.Matter.Matter.Vertices;
    // @ts-ignore
    const Axes = Phaser.Physics.Matter.Matter.Axes;

    Body.update = function(
      body: any,
      deltaTime: number,
      timeScale: number,
      correction: number
    ) {
      var deltaTimeSquared = Math.pow(
        deltaTime * timeScale * body.timeScale,
        2
      );

      // from the previous step
      var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
        velocityPrevX = body.position.x - body.positionPrev.x,
        velocityPrevY = body.position.y - body.positionPrev.y;

      // update velocity with Verlet integration
      body.velocity.x =
        velocityPrevX * frictionAir * correction +
        ((body.force.x * body.gravityScale) / body.mass) * deltaTimeSquared;
      body.velocity.y =
        velocityPrevY * frictionAir * correction +
        ((body.force.y * body.gravityScale) / body.mass) * deltaTimeSquared;

      body.positionPrev.x = body.position.x;
      body.positionPrev.y = body.position.y;
      body.position.x += body.velocity.x;
      body.position.y += body.velocity.y;

      // update angular velocity with Verlet integration
      body.angularVelocity =
        (body.angle - body.anglePrev) * frictionAir * correction +
        (body.torque / body.inertia) * deltaTimeSquared;
      body.anglePrev = body.angle * 0;
      body.angle += body.angularVelocity * 0;

      // track speed and acceleration
      body.speed = Vector.magnitude(body.velocity);
      body.angularSpeed = Math.abs(body.angularVelocity);

      // transform the body geometry
      for (var i = 0; i < body.parts.length; i++) {
        var part = body.parts[i];

        Vertices.translate(part.vertices, body.velocity);

        if (i > 0) {
          part.position.x += body.velocity.x;
          part.position.y += body.velocity.y;
        }

        if (body.angularVelocity !== 0) {
          Vertices.rotate(part.vertices, body.angularVelocity, body.position);
          Axes.rotate(part.axes, body.angularVelocity);
          if (i > 0) {
            Vector.rotateAbout(
              part.position,
              body.angularVelocity,
              body.position,
              part.position
            );
          }
        }
        Bounds.update(part.bounds, part.vertices, body.velocity);
      }
    };
  }
}

// import { inject } from '@robotlegsjs/core';
// import { TRANSFORM } from '../..';
// import { GAME } from '../../constants/constants';
// import { SceneKey } from '../../constants/types';
// import { FizzicsGame } from '../../FizzicsGame';
// import { GameScene } from '../../scenes/GameScene';
// import { AbstractCommand } from '../AbstractCommand';

// export class InitializePhysicsCommand extends AbstractCommand {
//   @inject(GAME)
//   private _game: FizzicsGame;

//   private _scene: GameScene;

//   public execute(): void {
//     super.execute();

//     this._scene = this._game.scene.getScene(SceneKey.Game) as GameScene;

//     const { width, height } = TRANSFORM;
//     this._scene.matter.world.setBounds(0, 0, width, height);
//     this._scene.matter.world.setGravity(0, 5);

//     if (__ENV__ === 'development') {
//       this._scene.matter.add.mouseSpring({});
//     }

//     // PATCHING MATTER BODY UPDATE LOOP TO SUPPORT PER BODY GRAVITY AND MINOR OPTIMIZATION TO SKIP ANGLE AND ANGULAR VELOCITY CALCULATION
//     // @ts-ignore
//     const { Bounds, Body, Vector, Vertices } = Phaser.Physics.Matter.Matter;

//     Body.update = function(body: any, deltaTime: number, timeScale: number, correction: number) {
//       var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);

//       var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
//         velocityPrevX = body.position.x - body.positionPrev.x,
//         velocityPrevY = body.position.y - body.positionPrev.y;

//       body.velocity.x =
//         velocityPrevX * frictionAir * correction + ((body.force.x * body.gravityScale) / body.mass) * deltaTimeSquared;
//       body.velocity.y =
//         velocityPrevY * frictionAir * correction + ((body.force.y * body.gravityScale) / body.mass) * deltaTimeSquared;

//       body.positionPrev.x = body.position.x;
//       body.positionPrev.y = body.position.y;
//       body.position.x += body.velocity.x;
//       body.position.y += body.velocity.y;

//       body.anglePrev = 0;
//       body.angle = 0;

//       body.speed = Vector.magnitude(body.velocity);

//       for (var i = 0; i < body.parts.length; i++) {
//         var part = body.parts[i];

//         Vertices.translate(part.vertices, body.velocity);

//         if (i > 0) {
//           part.position.x += body.velocity.x;
//           part.position.y += body.velocity.y;
//         }

//         Bounds.update(part.bounds, part.vertices, body.velocity);
//       }
//     };
//   }
// }
