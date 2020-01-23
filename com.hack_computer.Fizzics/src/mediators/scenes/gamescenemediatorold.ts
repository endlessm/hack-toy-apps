
  //   @inject(GameScenePointerDownSignal)
  //   private _gameSceneDownSignal: GameScenePointerDownSignal;

  //   @inject(GameScenePointerUpSignal)
  //   private _gameSceneUpSignal: GameScenePointerUpSignal;

  //   public sceneCreated(): void {
  //     super.sceneCreated();

  //     this.scene.build();

  //     this.addReaction(() => this._gameModel.state, this._checkViewState);
  //     this.addReaction(() => this._playableModel.level, this._prepareNewLevel);

  //     this.scene.input.on('pointerdown', this._onSceneDown, this);
  //     this.scene.input.on('pointerup', this._onSceneUp, this);
  //   }

  //   private _checkViewState(state: GameState): void {
  //     switch (state) {
  //       case GameState.GAME:
  //         this.scene.scene.wake(SceneKey.Game);
  //         break;
  //       default:
  //         this.scene.scene.sleep(SceneKey.Game);
  //         break;
  //     }
  //   }

  //   private _prepareNewLevel(level: LevelModel): void {
  //     this.scene.cleanup();
  //     this.scene.buildBalls(level.balls.values);

  //     this.removeReaction(this._updateBalls);
  //     this.addReaction(() => this._playableModel.level.balls.keys.length, this._updateBalls);
  //   }

  //   private _onSceneDown(pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]): void {
  //     pointer.leftButtonDown() && this._gameSceneDownSignal.dispatch(targets);
  //   }

  //   private _onSceneUp(pointer: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]): void {
  //     this._gameSceneUpSignal.dispatch(targets);
  //   }

  //   private _updateBalls(): void {
  //     const viewBallsIDs = this.scene.balls.keys;
  //     const modelBallsIDs = this._playableModel.level.balls.keys;

  //     this._addBalls(_difference(modelBallsIDs, viewBallsIDs));
  //     this._removeBalls(_difference(viewBallsIDs, modelBallsIDs));
  //   }

  //   private _addBalls(ballsIDs: number[]): void {
  //     ballsIDs.forEach((ballID: number) => {
  //       const ballModel = this._playableModel.level.balls.get(ballID);
  //       const { id, species } = ballModel;
  //       this.scene.addBall(id, species);
  //     });
  //   }

  //   private _removeBalls(ballsIDs: number[]): void {
  //     ballsIDs.forEach((ballID: number) => {
  //       this.scene.removeBall(ballID);
  //     });
  //   }