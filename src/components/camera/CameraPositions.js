import { Vector3 } from 'three';

// Constants for camera positioning
export const CAMERA_POSITIONS = {
  firstPerson: {
    position: new Vector3(0, 0.2, 0), // Lowered from 1.5 to 1.1 to match avatar's eye level
    lookAt: new Vector3(0, 0.2, 3), // Adjusted to maintain horizontal view
  },
  thirdPerson: {
    position: new Vector3(0, 4, -4),
    lookAt: new Vector3(0, 0, 1.5),
  },
} ;