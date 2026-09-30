// Mutable stage cues written by ScrollTrigger and read every frame by the 3D scene.
// Kept outside React so scroll never re-renders the tree.
export const stage = {
  intro: 0, // 0 = MacBook parked at the stage edge (hero), 1 = centered under the spot
  work: 0, // 0..1 across every project in the pinned sequence
  exit: 0, // 0..1 as the machine leaves after the last project
  visible: true, // false once the stage is far off screen: the canvas stops drawing
  count: 1,
  // where the machine stands, so the key light can keep it in its pool
  rig: {
    x: 0,
    y: -2,
    set(x, y) {
      this.x = x
      this.y = y
    },
  },
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const range = (v, a, b) => clamp01((v - a) / (b - a))
export const smooth = (t) => t * t * (3 - 2 * t)
