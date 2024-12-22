import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { CameraToggle } from './components/ui/CameraToggle';
import { useState, useEffect } from 'react';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'toggleView', keys: ['KeyV'] },
];

function App() {
  const [isFirstPerson, setIsFirstPerson] = useState(false);

  // Handle keyboard view toggle
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
    <KeyboardControls map={keyboardMap}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <Experience isFirstPerson={isFirstPerson} />
      </Canvas>
      <CameraToggle onToggle={setIsFirstPerson} isFirstPerson={isFirstPerson} />
    </KeyboardControls>
  );
}

export default App;