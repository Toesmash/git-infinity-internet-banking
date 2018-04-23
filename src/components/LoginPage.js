import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import authenticator from 'authenticator';
import { startLogin } from '../actions/authActions';
import LoginForm from './LoginForm';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrKey: authenticator.generateToken('S5FM4FGSV5RKJ5LDWZBWDUUX4RAEQJEY').toString()
    };
  }

  componentDidMount() {
    this.update = setInterval(() => {
      const epoch = Math.round(moment().valueOf() / 1000.0);
      const countDown = 30 - (epoch % 30);
      if (countDown === 30) { this.setState({ qrKey: authenticator.generateToken('S5FM4FGSV5RKJ5LDWZBWDUUX4RAEQJEY').toString() }); }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.update);
  }

  render() {
    return (
      <div>
        <Link to="/register" className="button button--login">Registrácia</Link>
        <div className="demo">
          <div className="demo__data">
            <p>DEMO</p>
            <p>Password1</p>
            <p>{this.state.qrKey}</p>
          </div>
        </div>
        <LoginForm />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
