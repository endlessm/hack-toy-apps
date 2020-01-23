import { Facade, Observant } from "@koreez/mvcx";
import { SceneEvents } from "../constants/EventNames";
import { BallType, IMatterBody, IMatterCollisionPair, SceneKey } from "../constants/types";
import { BallView } from "../views/balls/BallView";

export class CollisionObservant extends Observant {
  public onRegister(facade: Facade): void {
    super.onRegister(facade);

    const scene = window.fizzicsGame.scene.getScene(SceneKey.Game);
    scene.matter.world.on("collisionstart", this._onCollisionStart, this);
  }

  private _onCollisionStart(event: { pairs: IMatterCollisionPair[] }): void {
    event.pairs.forEach((pair: IMatterCollisionPair) => {
      if (this._checkForBallWallCollision(pair)) {
        return;
      }

      this._checkForMainBallBallCollision(pair);
    });
  }

  private _checkForBallWallCollision(pair: IMatterCollisionPair): boolean {
    const { bodyA, bodyB } = pair;
    let wallBody;
    let ballBody;

    if (isMatterWall(bodyA)) {
      wallBody = bodyA;
      ballBody = bodyB;
    } else if (isMatterWall(bodyB)) {
      wallBody = bodyB;
      ballBody = bodyA;
    }

    if (wallBody !== undefined) {
      const ballView = <BallView>ballBody.gameObject;
      const { id, species } = ballView;
      if (isMainBall(species)) {
        this.facade.sendNotification(SceneEvents.WallCollision, id);
      }

      return true;
    }

    return false;
  }

  private _checkForMainBallBallCollision(pair: IMatterCollisionPair): boolean {
    const { bodyA, bodyB } = pair;
    const viewA = <BallView>bodyA.gameObject;
    const viewB = <BallView>bodyB.gameObject;
    const { species: species1 } = viewA;
    const { species: species2 } = viewB;

    if (species1 !== species2 && (isMainBall(species1) || isMainBall(species2))) {
      let mainView;
      let ballView;

      if (isMainBall(species1)) {
        mainView = viewA;
        ballView = viewB;
      } else {
        mainView = viewB;
        ballView = viewA;
      }

      let notification: SceneEvents;
      switch (ballView.species) {
        case BallType.DIAMOND:
          notification = SceneEvents.DiamondCollision;
          break;
        case BallType.ROCK:
          notification = SceneEvents.RockCollision;
          break;
        case BallType.BOMB:
          notification = SceneEvents.BombCollision;
          break;
        case BallType.STAR:
          notification = SceneEvents.StarCollision;
          break;
        default:
      }

      this.facade.sendNotification(notification, mainView.id, ballView.id);

      return true;
    }

    return false;
  }
}

function isMatterWall(body: IMatterBody): boolean {
  return body.gameObject === null;
}

function isMainBall(ballType: BallType): boolean {
  return ballType === BallType.MAIN;
}

function orderIDs(id1: number, id2: number, mainID: number): { id1: number; id2: number } {
  return id1 === mainID ? { id1, id2 } : { id2, id1 };
}
