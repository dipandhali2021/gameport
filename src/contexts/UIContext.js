import { createContext } from 'react';

export const UIContext = createContext({
  showInteract: false,
  setShowInteract: (show) => {},
  showDialog: false,
  setShowDialog: (show) => {},
});