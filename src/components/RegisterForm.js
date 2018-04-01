import React from 'react';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup';
import moment from 'moment';
import authenticator from 'authenticator';
import database, { firebase } from '../firebase/firebase';


class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secret: authenticator.generateKey(),
      loginID: moment().valueOf().toString(36).slice(2),
      memberSince: moment().valueOf(),
      qrTimeLeft: '-'
    };

    this.props.setValues({
      ...this.props.values,
      secret: this.state.secret,
      loginID: this.state.loginID,
      memberSince: this.state.memberSince
    });
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

  setQR = () => {
    this.props.setValues({
      ...this.props.values,
      qrKey: authenticator.generateToken(this.state.secret).toString()
    });
  }
  generateQr = (lastName, loginID) => {
    const key = (this.state.secret).replace(/ /g, '').toUpperCase();
    const diacritics = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const accountName = `${diacritics}:${loginID}@infinity.sk`;
    const issuer = 'InfinityBank';
    const algorithm = 'SHA1';
    const digits = 6;
    const period = 30;

    const uri = `otpauth://totp/${issuer}%3A${accountName}%3Fsecret%3D${key}%26issuer%3D${issuer}&algorithm=${algorithm}&digits=${digits}&period=${period}`;
    const url = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${uri}`;
    return <img alt="QRcode" className="form-qr-image" src={url} />;
  }


  render() {
    const {
      values, errors, touched, isSubmitting, handleReset, dirty
    } = this.props;

    return (
      <div className="box-layout">
        <div className="box-layout__box">
          <Form>
            <h1 className="box-layout__title">INFINITY<span>bank</span></h1>
            <h2 className="box-layout__title">Registrácia</h2>
            <div className="form-group">
              <label>Krstné meno</label>
              <Field
                name="firstName"
                placeholder="Zadajte svoje meno"
                type="text"
                className={errors.firstName && touched.firstName ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.firstName && touched.firstName && <div className="text-input--feedback">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label>Priezvisko</label>
              <Field
                name="lastName"
                placeholder="Zadajte svoje priezvisko"
                type="text"
                className={errors.lastName && touched.lastName ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.lastName && touched.lastName && <div className="text-input--feedback">{errors.lastName}</div>}
            </div>
            <div className="form-group">
              <label>Heslo</label>
              <Field
                name="password"
                placeholder="Zadajte prihlasovacie heslo"
                type="password"
                className={errors.password && touched.password ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.password && touched.password && <div className="text-input--feedback">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label>Overenie hesla</label>
              <Field
                name="passwordCheck"
                placeholder="Zadajte heslo ešte raz"
                type="password"
                className={errors.passwordCheck && touched.passwordCheck ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.passwordCheck && touched.passwordCheck && <div className="text-input--feedback">{errors.passwordCheck}</div>}
            </div>
            <div className="form-group">
              <label>Telefón</label>
              <Field
                name="phone"
                placeholder="Zadajte telefónne číslo (nepovinné)"
                type="tel"
                className={errors.phone && touched.phone ? 'text-input text-input--error' : 'text-input'}
              />
              {errors.phone && touched.phone && <div className="text-input--feedback">{errors.phone}</div>}
            </div>
            <div className="form-button">
              <div className="form-group">
                <label className="form-group__qr-label">QR verifikácia ({this.state.qrTimeLeft})</label>
                <Field
                  name="totp"
                  placeholder="123 456"
                  type="text"
                  className={errors.totp && touched.totp ? 'text-input text-input__QR text-input--error' : 'text-input text-input__QR'}
                />
                {errors.totp && touched.totp && <div className="text-input--feedback form-group__qr-label">{errors.totp}</div>}
              </div>
              <button onClick={this.setQR} type="submit" className="button button__submit" disabled={isSubmitting}>Registruj sa</button>
            </div>
            <div className="form-button-reset">
              <button onClick={handleReset} type="button" className="button button__reset" disabled={!dirty || isSubmitting}>Vymaž formulár</button>
            </div>
          </Form>
        </div>
        {
          values.lastName &&
          <div className="form-qr">
            {this.generateQr(values.lastName, values.loginID)}
          </div>
        }

      </div>
    );
  }
}

const generateAcc = () => {
  const base = Math.random().toString().slice(2, 11);
  const account = `SK${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}77770000001${base}`;
  return account;
};

const firebaseRequest = (values) => {
  const {
    loginID, firstName, password, lastName, memberSince, phone, secret
  } = values;

  const account = generateAcc();

  firebase.auth()
    .createUserWithEmailAndPassword(`${loginID}@infinity.sk`, password);
  database.ref('users')
    .child(loginID)
    .set({
      firstName,
      lastName,
      memberSince,
      phone,
      secret: secret.replace(/ /g, '').toUpperCase()
    })
    .then(() => {
      database.ref(`users/${loginID}/accounts`)
        .child(account)
        .set({
          balance: 0,
          type: 'bežný účet',
          name: 'hlavný účet',
          ccy: 'EUR'
        });
    })
    .then(() => {
      database.ref('accounts')
        .child(account)
        .set(loginID);
    });
};


const schema = {
  firstName: Yup.string()
    .required('Povinné pole'),
  lastName: Yup.string()
    .required('Povinné pole'),
  password: Yup.string()
    .min(8, 'Heslo musí mať aspoň 8 znakov')
    .required('Povinne pole')
    .matches(/[a-z]/, 'musí obsahovať malé písmeno')
    .matches(/[A-Z]/, 'musí obsahovať malé písmeno')
    .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'musí obsahovať jedno číslo alebo špeciálny znak (@,!,#, atď)'),
  passwordCheck: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Heslá sa nezhodujú')
    .required('Povinné pole'),
  totp: Yup.string()
    .required('Povinné pole')
};

const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      firstName: props.firstName || '',
      lastName: props.lastName || '',
      password: props.password || 'Password1',
      passwordCheck: props.passwordCheck || 'Password1',
      phone: props.phone || '',
      totp: ''
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    const { resetForm, setErrors, setSubmitting } = formikBag;
    if (values.qrKey !== values.totp) {
      setSubmitting(false);
      setErrors({ totp: 'QR kódy sa nezhodujú' });
    } else {
      firebaseRequest(values);
      resetForm();
    }
  }

})(RegisterForm);

export default FormikApp;
