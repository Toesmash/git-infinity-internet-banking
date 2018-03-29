import React from 'react';
import { NavLink } from 'react-router-dom';

const SubHeader = () => (
  <div className="subheader">
    <div className="content-container subheader__content">
      <div>
        <NavLink to="/payments" className="subheader__leftitem">PLATBY</NavLink>
      </div>
      <div className="subheader__rightmenu">
        <NavLink to="/dashboard" activeClassName="is-active" >Dashboard</NavLink>
        <NavLink to="/accounts" activeClassName="is-active" >Účty</NavLink>
        <NavLink to="/cards" activeClassName="is-active" >Karty</NavLink>
      </div>
    </div>
  </div>
);

export default SubHeader;
