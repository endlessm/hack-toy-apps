import { TRANSFORM } from "../..";
import { SceneKey } from "../../constants/types";
import { GameScene } from "../../scenes/GameScene";

export function initializePhysicsCommand(e: string): void {
  const game = window.fizzicsGame;
  const scene = <GameScene>game.scene.getScene(SceneKey.Game);

  const { width, height } = TRANSFORM;

  scene.matter.world.setBounds(0, 0, width, height, 2);
  scene.matter.world.setGravity(0, 5);

  // PATCHING MATTER BODY UPDATE LOOP:
  // TO SUPPORT PER BODY GRAVITY,
  // TO PREVENT OUT OF BOUNDS BODIES ON HIGH VELOCITY

  // @ts-ignore
  const Bounds = Phaser.Physics.Matter.Matter.Bounds;
  // @ts-ignore
  const Body = Phaser.Physics.Matter.Matter.Body;
  // @ts-ignore
  const Vector = Phaser.Physics.Matter.Matter.Vector;
  // @ts-ignore
  const Vertices = Phaser.Physics.Matter.Matter.Vertices;
  // // @ts-ignore
  // const Axes = Phaser.Physics.Matter.Matter.Axes;

  // THIS FUNCTION PATCHED TO FIT GAME REQUIREMENTS:
  // implemented "gravityScale" property for single body,
  // removed angularity: (angularSpeed, rotation, angle etc),
  // prevented out of bounds bodies, ...ets

  Body.update = (body: any, deltaTime: number, timeScale: number, correction: number) => {
    const deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);

    // from the previous step
    const frictionAir = 1 - body.frictionAir * timeScale * body.timeScale;
    const velocityPrevX = body.position.x - body.positionPrev.x;
    const velocityPrevY = body.position.y - body.positionPrev.y;

    // SETTING GRAVITY SCALE FACTOR ON VELOCITY: MATTER.JS DOES NOT HAVE "gravityScale" FOR SINGLE BODY
    let velX =
      velocityPrevX * frictionAir * correction + ((body.force.x * body.gravityScale) / body.mass) * deltaTimeSquared;
    let velY =
      velocityPrevY * frictionAir * correction + ((body.force.y * body.gravityScale) / body.mass) * deltaTimeSquared;

    const x = <number>body.position.x + <number>body.velocity.x;
    const y = <number>body.position.y + <number>body.velocity.y;

    // DISABLES OUT FO BOUNDS BODIES:
    // SETTING REVERSED VELOCITY IF ANY
    if (x < 0 || x > width) {
      velX *= -1;
    }
    if (y < 0 || y > height) {
      velY *= -1;
    }

    body.velocity.x = velX;
    body.velocity.y = velY;

    body.positionPrev.x = body.position.x;
    body.positionPrev.y = body.position.y;
    body.position.x += body.velocity.x;
    body.position.y += body.velocity.y;

    // DISABLES ANY TYPE OF ANGULAR VALUES
    body.angularVelocity = body.angularSpeed = body.anglePrev = body.angle = 0;

    body.speed = Vector.magnitude(body.velocity);

    for (let i = 0; i < body.parts.length; i += 1) {
      const part = body.parts[i];

      Vertices.translate(part.vertices, body.velocity);

      if (i > 0) {
        part.position.x += body.velocity.x;
        part.position.y += body.velocity.y;
      }

      Bounds.update(part.bounds, part.vertices, body.velocity);
    }
  };
}
