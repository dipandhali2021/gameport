import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import { useControls } from 'leva';
import { useContext, useEffect, useRef, useState } from 'react';
import { MathUtils, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { CAMERA_POSITIONS } from './camera/CameraPositions';
import { Character } from './Character';
import {  StaticNPC } from './StaticNPC';
import { InteractButton } from './ui/InteractButton';
import { DialogBox } from './ui/DialogBox';
import { UIContext } from '../contexts/UIContext';


const INTERACTION_DISTANCE = 1;
const NPC_POSITION = new Vector3(2.44, -2.11, -2.04);


const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = ({ isFirstPerson }) => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, JUMP_FORCE } = useControls(
    'Character Control',
    {
      WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      JUMP_FORCE: { value: 5, min: 1, max: 10, step: 0.1 },
    }
  );

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const { rapier, world } = useRapier();

  const [animation, setAnimation] = useState('idle');
  const [isGrounded, setIsGrounded] = useState(true);
  const jumpPressed = useRef(false);
  const isRunning = useRef(false);

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  const { setShowInteract } = useContext(UIContext);

  // Ground detection ray
  const checkIsGrounded = () => {
    if (!rb.current) return false;
    const origin = rb.current.translation();
    origin.y -= 0.15; // Adjusted for better ground detection
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 0.3, true);
    return hit !== null;
  };

  useEffect(() => {
    const logPosition = () => {
      if (rb.current) {
        const pos = rb.current.translation();
        console.log('Player position:', {
          x: pos.x.toFixed(2),
          y: pos.y.toFixed(2),
          z: pos.z.toFixed(2),
        });
      }
    };



    // Log every 2 seconds when dev tools are open
    const interval = setInterval(() => {
      if (window.devtools?.isOpen) {
        logPosition();
      }
    }, 2000);


   

    const onMouseDown = (e) => {
      isClicking.current = true;
    };
    const onMouseUp = (e) => {
      isClicking.current = false;
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      () => clearInterval(interval);
      () => window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if (rb.current) {
      const position = rb.current.translation();
      // Log position every frame
      console.log('Player Position:', {
        x: Math.round(position.x * 100) / 100,
        y: Math.round(position.y * 100) / 100,
        z: Math.round(position.z * 100) / 100,
      });
    }
    if (rb.current) {
      const position = rb.current.translation();
      const playerPosition = new Vector3(position.x, position.y, position.z);
      const distanceToNPC = playerPosition.distanceTo(NPC_POSITION);
      
      setShowInteract(distanceToNPC < INTERACTION_DISTANCE);

    }
    
    if (rb.current) {
      const vel = rb.current.linvel();
      const currentlyGrounded = checkIsGrounded();
      setIsGrounded(currentlyGrounded);

      // Handle jumping
      if (get().jump && currentlyGrounded && !jumpPressed.current) {
        jumpPressed.current = true;
        vel.y = JUMP_FORCE;
        setAnimation('run'); // Using 'run' animation for jump
      } else if (!get().jump) {
        jumpPressed.current = false;
      }

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }
      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      // Update running state
      isRunning.current = get().run;
      let speed = isRunning.current ? RUN_SPEED : WALK_SPEED;

      // Reduce air control
      if (!currentlyGrounded) {
        speed *= 0.8;
      }

      if (isClicking.current) {
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      // Update movement and animation
      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;

        // Only update movement animation if grounded
        if (currentlyGrounded) {
          setAnimation(isRunning.current ? 'run' : 'walk');
        }
      } else if (currentlyGrounded && !jumpPressed.current) {
        setAnimation('idle');
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      rb.current.setLinvel(vel, true);
    }

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    const targetPosition = isFirstPerson
      ? CAMERA_POSITIONS.firstPerson.position
      : CAMERA_POSITIONS.thirdPerson.position;

    const targetLookAt = isFirstPerson
      ? CAMERA_POSITIONS.firstPerson.lookAt
      : CAMERA_POSITIONS.thirdPerson.lookAt;

    // Smoothly interpolate camera position with easing
    cameraPosition.current.position.lerp(targetPosition, 0.05);
    cameraTarget.current.position.lerp(targetLookAt, 0.05);

    // Update world positions
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <>
      <RigidBody
        colliders={false}
        lockRotations
        ref={rb}
        mass={1}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} />
          <group ref={character}>
            <Character
              scale={0.18}
              position-y={-0.25}
              animation={animation}
              visible={!isFirstPerson}
            />
          </group>
        </group>
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>

      <RigidBody type="fixed" position={[2.44, -2.11, -2.04]}>
        <StaticNPC
          scale={0.3}
          position-y={-0.25}
          rotation-y={Math.PI * 2}
        />
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>
    </>
  );
};