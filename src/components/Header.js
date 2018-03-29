import React from 'react';
import { connect } from 'react-redux';
import GlyphLogout from 'react-icons/lib/fa/power-off';
import { startLogout } from '../actions/authActions';

const Header = ({ username, startLogout }) => {
  return (
    <header className="header">
      <div className="content-container header__content">
        <h1 className="header__title">INFINITY<span>bank</span></h1>
        <div className="header__user">
          <p>Vitaj, <span>{username}</span></p>
          <button
            className="button button--logout"
            onClick={startLogout}
          >
            <GlyphLogout className="glyph--logout" />
          </button>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (reduxStore) => ({
  username: reduxStore.auth.firstName
});

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
