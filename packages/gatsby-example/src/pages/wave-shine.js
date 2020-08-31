import React from 'react';
import waveshine from '../assets/fox-waveshine.gif';
import { withNavbar } from '../components/navbar';

function Waveshine() {
  return (
    <img src={waveshine}/>
  );
}

export default withNavbar(Waveshine) ;
