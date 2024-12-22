import { useState } from 'react';
import '../../styles/DialogBox.css';

const DIALOG_CONTENT = [
  {
    npc: "Hello! I'm excited to tell you about the developer's work!",
    player: "Hi! I'd love to hear about it.",
  },
  {
    npc: "They're skilled in React, Three.js, and WebGL. Would you like to see their projects?",
    player: "Yes, please tell me more!",
  },
  {
    npc: "They've created amazing 3D web experiences and interactive portfolios.",
    player: "That sounds impressive!",
  },
];

export const DialogBox = ({ onClose }) => {
  const [currentDialog, setCurrentDialog] = useState(0);

  const handleNext = () => {
    if (currentDialog < DIALOG_CONTENT.length - 1) {
      setCurrentDialog(prev => prev + 1);
    } else {
      onClose();
      setCurrentDialog(0);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-characters">
          <div className="character-portrait npc">
            <div className="portrait-label">NPC</div>
          </div>
          <div className="character-portrait player">
            <div className="portrait-label">You</div>
          </div>
        </div>
        <div className="dialog-content">
          <div className="dialog-text npc-text">
            {DIALOG_CONTENT[currentDialog].npc}
          </div>
          <div className="dialog-text player-text">
            {DIALOG_CONTENT[currentDialog].player}
          </div>
        </div>
        <button className="dialog-next-btn" onClick={handleNext}>
          {currentDialog === DIALOG_CONTENT.length - 1 ? 'Close' : 'Next'}
        </button>
      </div>
    </div>
  );
};