export enum FacadeEvents {
  Startup = "FizzicsFacadeStartup"
}

export enum ToyAppEvents {
  GameGlobalParametersUpdate = "GameGlobalParametersUpdate",
  GameReset = "GameReset",
  GameFlip = "GameFlip",
  GameLoadState = "GameLoadState",
  GameSaveState = "GameSaveState"
}

export enum SceneEvents {
  LoadComplete = "LoadComplete",
  WallCollision = "WallCollision",
  DiamondCollision = "DiamondCollision",
  RockCollision = "RockCollision",
  BombCollision = "BombCollision",
  StarCollision = "StarCollision"
}

export enum GameEvents {
  StateUpdate = "GameStateUpdate",
  PointerDown = "ScenePointerDown",
  PointerUp = "ScenePointerUp",
  CanvasOut = "GameCanvasOut",
  FreeSpacePointerDown = "FreeSpacePointerDown"
}

export enum FlingerEvents {
  FlingEnd = "FlingEnd",
  FlingStart = "FlingStart",
  Distance = "Distance",
  BallDistanceReached = "BallDistanceReached",
  Reset = "Reset"
}

export enum UIEvents {
  LevelSwitch = "LevelSwitch",
  NextLevel = "NextLevel",
  ToolSwitch = "ToolSwitch",
  CreateToolOptionSwitch = "CreateToolOptionSwitch"
}

export enum LevelEvents {
  LevelRemoved = "LevelRemoved",
  LevelCreated = "LevelCreated",
  LevelStart = "LevelStart",
  StateUpdate = "LevelStateUpdate",
  DiamondsUpdate = "LevelDiamondsUpdate",
  FlingsUpdate = "LevelFlingsUpdate",
  BgIndexUpdate = "LevelBGIndexUpdate",
  ScoreUpdate = "LevelScoreUpdate"
}

export enum ToolsEvents {
  ActiveToolUpdate = "ActiveToolUpdate",
  CreateToolActiveOptionUpdate = "CreateToolActiveOptionUpdate",
  CreateToolOptionEnableUpdate = "CreateToolOptionEnableUpdate",
  ToolEnableUpdate = "ToolEnableUpdate",
  ToolInUseUpdate = "ToolInUseUpdate"
}

export enum BallsEvents {
  Removed = "BallRemoved",
  Created = "BallCreated",
  RemovedByTool = "BallRemovedByTool",
  CreatedByTool = "BallCreatedByTool",
  MaxCountReached = "BallsMaxCountReached",
  PointerDown = "BallPointerDown",
  PointerUp = "BallPointerUp",
  Draggable = "BallDraggableUpdate",
  Flingable = "BallFlingableUpdate",
  CollisionGroup = "CollisionGroup",
  DragEnabled = "BallsDraggableSwitched"
}

export enum BallTypeEvents {
  Radius = "BallTypeRadiusUpdate",
  Gravity = "BallTypeGravityUpdate",
  Bounce = "BallTypeBounceUpdate",
  Friction = "BallTypeFrictionUpdate",
  Frozen = "BallTypeFrozenUpdate",
  VisualGood = "BallTypeVisualGoodUpdate",
  VisualBad = "BallTypeVisualBadUpdate",
  SoundGood = "BallTypeSoundGoodUpdate",
  SoundBad = "BallTypeSoundBadUpdate",
  FrameIndex = "BallTypeFrameIndexUpdate"
}
