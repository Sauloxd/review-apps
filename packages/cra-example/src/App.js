import React from 'react';
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';
import multishine from './assets/fox-multishine.gif';
import waveshine from './assets/fox-waveshine.gif';
import combo1 from './assets/fox-combo-1.gif';

function App() {
  const basename = process.env.PUBLIC_URL;
  console.log(basename)
  return (
    <>
      <Router basename={basename}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <Navbar />
          </div>
          <Switch>
            <Route path={['/wave-shine']}>
              <img alt="waveshine" src={waveshine}/>
            </Route>
            <Route path="/multi-shine">
              <img alt="multishine" src={multishine}/>
            </Route>
            <Route path="/combos">
              <img alt="combo1" src={combo1}/>
            </Route>
          </Switch>
        </div>
      </Router>
      <HashRouter>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <Navbar />
          </div>
          <Switch>
            <Route path={['/wave-shine']}>
              <img alt="waveshine" src={waveshine}/>
            </Route>
            <Route path="/multi-shine">
              <img alt="multishine" src={multishine}/>
            </Route>
            <Route path="/combos">
              <img alt="combo1" src={combo1}/>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </>
  );
}

function Navbar () {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'green'
  };
  const style={ marginRight: 24 };
  return (
    <div>
      <NavLink
        to="/wave-shine"
        activeStyle={activeStyle}
        style={style}
      >
        Wave Shine
      </NavLink>
      <NavLink
        to="/multi-shine"
        activeStyle={activeStyle}
        style={style}
      >
        Multi-shine
      </NavLink>
      <NavLink
        to="/combos"
        activeStyle={activeStyle}
      >
        Combos
      </NavLink>
    </div>
  );
}

export default App;
