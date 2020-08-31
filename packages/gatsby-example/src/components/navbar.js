import React from 'react';
import { Link } from 'gatsby';

function Navbar () {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'green'
  };
  const style={ marginRight: 24 };
  return (
    <div>
      <Link
        to="/wave-shine"
        activeStyle={activeStyle}
        style={style}
      >
        Wave Shine
      </Link>
      <Link
        to="/multi-shine"
        activeStyle={activeStyle}
        style={style}
      >
        Multi-shine
      </Link>
      <Link
        to="/combos"
        activeStyle={activeStyle}
      >
        Combos
      </Link>
    </div>
  );
}

export const withNavbar = (Component) => props => (
  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <Navbar/>
    </div>
    <Component {...props}/>
  </div>
);

export default Navbar;
