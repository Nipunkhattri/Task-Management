import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/features/themeSlice.js';

function ToggleButton() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <button onClick={() => dispatch(toggleTheme())} className='bg-blue-400 py-3 px-3 '>
      Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

export default ToggleButton;