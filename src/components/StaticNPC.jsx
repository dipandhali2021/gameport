import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';

export function StaticNPC(props) {
  const group = useRef();
  const { scene } = useGLTF('/models/avatar1.glb');
  const { animations } = useGLTF('/models/avatar1animations.glb');
  const { actions } = useAnimations(animations, group);
  const { showInteract } = useContext(UIContext);
  const prevInteractState = useRef(false);

  useEffect(() => {
    // Only play animation when interaction state changes
    if (showInteract !== prevInteractState.current) {
      if (showInteract) {
        // Entering interaction range
        actions['bow']?.reset().fadeIn(2).play();
        setTimeout(() => {
          actions['bow']?.fadeOut(2);
          actions['idle']?.reset().fadeIn(0.5).play();
        }, 2000);
      } else {
        // Leaving interaction range
        actions['bow']?.reset().fadeIn(2).play();
        setTimeout(() => {
          actions['bow']?.fadeOut(2);
          actions['idle']?.reset().fadeIn(0.5).play();
        }, 2000);
      }
      prevInteractState.current = showInteract;
    }
  }, [showInteract, actions]);

  // Play idle animation on mount
  useEffect(() => {
    actions['idle']?.reset().fadeIn(0.5).play();
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}