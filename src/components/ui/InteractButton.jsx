import '../../styles/InteractButton.css';

export const InteractButton = ({ onClick }) => {
  return (
    <button className="interact-button" onClick={onClick}>
      Press E to Interact
    </button>
  );
};