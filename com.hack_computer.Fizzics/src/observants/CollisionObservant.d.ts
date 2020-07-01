import { Facade, Observant } from "@koreez/mvcx";
export declare class CollisionObservant extends Observant {
    onRegister(facade: Facade): void;
    private _onCollisionStart;
    private _checkForBallWallCollision;
    private _checkForMainBallBallCollision;
}
