import React from 'react';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup';
import { connect } from 'react-redux';
import moment from 'moment';
import authenticator from 'authenticator';
import database from '../firebase/firebase';

import { startLogin } from '../actions/authActions';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrTimeLeft: '-'
    };
  }

  componentDidMount() {
    this.update = setInterval(() => {
      const epoch = Math.round(moment().valueOf() / 1000.0);
      const countDown = 30 - (epoch % 30);
      this.setState({ qrTimeLeft: countDown });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  render() {
    const {
      errors, touched, isSubmitting
    } = this.props;


    return (
      <div className="box-layout">
        <div className="box-layout__box">
          <Form>
            <h1 className="box-layout__title">INFINITY<span>bank</span></h1>
            <h2 className="box-layout__title">Prihlásenie</h2>
            {errors.login && <div className="form-credentials-error">{errors.login}</div>}
            <div className="form-group">
              <label>Prihlasovacie ID</label>
              <Field
                name="user"
                placeholder="Zadajte 6-miestne číslo"
                type="text"
                className={errors.user && touched.user ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.user && touched.user && <div className="text-input--feedback">{errors.user}</div>}
            </div>
            <div className="form-group">
              <label>Heslo</label>
              <Field
                name="password"
                placeholder="Zadajte heslo"
                type="password"
                className={errors.password && touched.password ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.password && touched.password && <div className="text-input--feedback">{errors.password}</div>}
            </div>
            <div className="form-button">
              <div className="form-group">
                <label className="form-group__qr-label">QR verifikácia ({this.state.qrTimeLeft})</label>
                <Field
                  name="totpInput"
                  placeholder="123 456"
                  type="text"
                  className={errors.totpInput && touched.totpInput ? 'text-input text-input__QR text-input--error' : 'text-input text-input__QR'}
                />
                {errors.totpInput && touched.totpInput && <div className="text-input--feedback form-group__qr-label">{errors.totpInput}</div>}
              </div>
              <button type="submit" className="button button__submit" disabled={isSubmitting}>Prihlás sa</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}


const schema = {
  user: Yup.string()
    .required('Zadajte prihlasovacie ID'),
  password: Yup.string()
    .required('Zadajte heslo'),
  totpInput: Yup.string()
    .required('Zadajte QR kód')
};

const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      user: props.user || '',
      password: '',
      totpInput: ''
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    let totpKey = '';
    const { user, password, totpInput } = values;
    const { setSubmitting, setErrors } = formikBag;

    database.ref('/users').once('value').then((snapshot) => {
      if (!snapshot.hasChild(user)) {
        setSubmitting(false);
        setErrors({ login: 'Zlé prihlasovacie údaje' });
        return false;
      }
      return true;
    }).then((data) => {
      if (data) {
        database.ref(`/users/${user}`).once('value').then((snapshot) => {
          totpKey = authenticator.generateToken(snapshot.val().secret).toString();
        }).then(() => {
          if (totpKey !== totpInput) {
            setSubmitting(false);
            setErrors({ login: 'Zlé prihlasovacie údaje' });
            return false;
          }
          setSubmitting(false);
          startLogin(`${user}@infinity.sk`, password).then((data) => {
            if (!data) {
              setErrors({ login: 'Zlé prihlasovacie údaje' });
            }
          });

          return true;
        });
      }
    });
  }

})(LoginForm);

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(FormikApp);
