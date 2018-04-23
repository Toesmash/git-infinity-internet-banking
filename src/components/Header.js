import React from 'react';
import { connect } from 'react-redux';
import authenticator from 'authenticator';
import moment from 'moment';
import GlyphLogout from 'react-icons/lib/fa/power-off';
import { startLogout } from '../actions/authActions';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      demoQR: authenticator.generateToken('S5FM4FGSV5RKJ5LDWZBWDUUX4RAEQJEY').toString()
    };
  }

  componentDidMount() {
    this.update = setInterval(() => {
      const epoch = Math.round(moment().valueOf() / 1000.0);
      const countDown = 30 - (epoch % 30);
      if (countDown === 30) { this.setState({ demoQR: authenticator.generateToken('S5FM4FGSV5RKJ5LDWZBWDUUX4RAEQJEY').toString() }); }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  render() {
    const { username, startLogout } = this.props;
    return (
      <header className="header">
        <div className="content-container header__content">
          <h1 className="header__title">INFINITY<span>bank</span></h1>
          <div className="header__user">
            <div>
              <p>Vitaj, <span>{username}</span></p>
              {
                username === 'DEMO' && <p className="demo__user">QR: <span>{this.state.demoQR}</span></p>
              }

            </div>
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
  }
}

const mapStateToProps = (reduxStore) => ({
  username: reduxStore.auth.firstName
});

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
