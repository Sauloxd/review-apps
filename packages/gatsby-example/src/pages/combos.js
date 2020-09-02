import React from 'react';
import combo1 from '../assets/fox-combo-1.gif';
import { withNavbar } from '../components/navbar';

function Combos() {
  return (
    <img src={combo1}/>
  );
}

export default withNavbar(Combos);
