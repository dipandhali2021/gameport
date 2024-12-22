import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { CameraToggle } from './components/ui/CameraToggle';
import { useEffect, useState } from 'react';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'toggleView', keys: ['KeyV'] },
];

function App() {
  const [isFirstPerson, setIsFirstPerson] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'KeyV') {
        setIsFirstPerson(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <CameraToggle onToggle={setIsFirstPerson} isFirstPerson={isFirstPerson} />
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
          style={{
            touchAction: 'none',
          }}
        >
          <color attach="background" args={['#ececec']} />
          <Experience isFirstPerson={isFirstPerson} />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;