export interface CTXAttributes extends CanvasRenderingContext2D {
  dash: number[];
}
export type PointDrawOptions = {
  size?: number;
  outline?: boolean;
  fillPoint?: boolean;
} & Partial<CTXAttributes>;
export type SegmentDrawOptions = { width?: number } & Partial<CTXAttributes>;
export type PolygonDrawOptions = { width?: number } & Partial<CTXAttributes>;
export type EnvelopeDrawOptions = Partial<CTXAttributes>;

export type TPoint = { x: number; y: number };
export type InterSection =
  | { x: number; y: number; offset: number }
  | null
  | undefined;

export type GraphInfo = {
  points: TPoint[];
  segments: { p1: TPoint; p2: TPoint }[];
};

// --------------TYPE FOR LOADING LOCALSTORAGE DATA--------------

export type InfoGraph = {
  points: InfoPoint[];
  segments: InfoLaneGuide[];
};

export type InfoRoadBorder = {
  p1: InfoPoint;
  p2: InfoPoint;
};

export type InfoPoint = {
  x: number;
  y: number;
};

export type InfoLaneGuide = {
  p1: InfoPoint;
  p2: InfoPoint;
};

export type InfoEnvelope = {
  skeleton: InfoLaneGuide;
  poly: InfoGraph;
};

export type InfoTree = {
  center: InfoPoint;
  size: number;
  height: number;
  base: InfoGraph;
};
export type InfoPoly = {
  points: InfoPoint[];
  segments: InfoSegment[];
};
export type InfoSegment = {
  p1: InfoPoint;
  p2: InfoPoint;
};

export type InfoImage = {};
// --------------TYPE FOR LOADING LOCALSTORAGE DATA--------------
