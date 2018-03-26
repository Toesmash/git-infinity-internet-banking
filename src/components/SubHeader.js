import React from 'react';
import { NavLink } from 'react-router-dom';

const SubHeader = () => (
  <div>
    <NavLink to="/payments" className="subheader__leftmenu">PLATBY</NavLink>
    <NavLink to="/dashboard" activeClassName="is-active" >Dashboard</NavLink>
    <NavLink to="/accounts" activeClassName="is-active" >Účty</NavLink>
    <NavLink to="/cards" activeClassName="is-active" >Karty</NavLink>
  </div>
);

export default SubHeader;
