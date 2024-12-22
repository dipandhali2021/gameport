import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { CameraToggle } from './components/ui/CameraToggle';
import { useState, useEffect } from 'react';
import { UIContext } from './contexts/UIContext';
import { UI } from './components/UI';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'toggleView', keys: ['KeyV'] },
  { name: 'interact', keys: ['KeyE'] },
];

function App() {
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [showInteract, setShowInteract] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Handle keyboard view toggle
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'KeyV') {
        setIsFirstPerson(prev => !prev);
      }
      if (event.code === 'KeyE' && showInteract && !showDialog) {
        setShowDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showInteract, showDialog]);

  return (
    <UIContext.Provider value={{ showInteract, setShowInteract, showDialog, setShowDialog }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <Experience isFirstPerson={isFirstPerson} />
        </Canvas>
        <CameraToggle onToggle={setIsFirstPerson} isFirstPerson={isFirstPerson} />
        <UI />
      </KeyboardControls>
    </UIContext.Provider>
  );
}
export default App;