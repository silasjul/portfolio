export type EdgeBendConfig = {
  strength: number
  start: number
  curve: number
  squareness: number
}

export const EDGE_BEND_DEFAULTS: EdgeBendConfig = {
  strength: 0.23,
  start: 0.47,
  curve: 2.95,
  squareness: 5,
}
