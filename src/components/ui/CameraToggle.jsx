import '../../styles/CameraToggle.css';

export const CameraToggle = ({ onToggle, isFirstPerson }) => {
  return (
    <button 
      className="camera-toggle-btn"
      onClick={() => onToggle(!isFirstPerson)}
      aria-label={`Switch to ${isFirstPerson ? 'third' : 'first'} person view`}
    >
      {isFirstPerson ? 'TPS' : 'FPS'}
    </button>
  );
};