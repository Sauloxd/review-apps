import React from 'react';
import multishine from '../assets/fox-multishine.gif';
import { withNavbar } from '../components/navbar';

function Multishine() {
  return (
    <img src={multishine}/>
  );
}

export default withNavbar(Multishine);
