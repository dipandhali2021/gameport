import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';
import { InteractButton } from './ui/InteractButton';
import { DialogBox } from './ui/DialogBox';

export const UI = () => {
  const { showInteract, showDialog, setShowDialog } = useContext(UIContext);

  return (
    <>
      {showInteract && !showDialog && (
        <InteractButton onClick={() => setShowDialog(true)} />
      )}
      {showDialog && (
        <DialogBox onClose={() => setShowDialog(false)} />
      )}
    </>
  );
};