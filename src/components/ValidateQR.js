import React from 'react';
import authenticator from 'authenticator';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup';
import moment from 'moment';


class ValidateQR extends React.Component {
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

  setQR = () => {
    this.props.setValues({
      ...this.props.values,
      qrKey: authenticator.generateToken(this.props.secret).toString()
    });
  };

  render() {
    const { errors, touched, isSubmitting } = this.props;

    return (
      <Form className="validate-QR">
        <h3>Skontrolujte si zadané údaje</h3>
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
        <div className="justify-content-space-between">
          <button onClick={this.setQR} type="submit" className="button button__submit button--qr" disabled={isSubmitting}>Pošli platbu</button>
          <button onClick={this.props.onReset} type="button" className="button button__cancel button--qr" disabled={isSubmitting}>Zruš platbu</button>
        </div>
      </Form>
    );
  }
}

const schema = {
  totp: Yup.string().required('Povinné pole')
};

const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      totp: ''
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    const {
      resetForm, setErrors, setSubmitting, props
    } = formikBag;
    if (values.qrKey !== values.totp) {
      setSubmitting(false);
      setErrors({ totp: 'QR kódy sa nezhodujú' });
    } else {
      props.onSubmit();
      resetForm();
    }
  }
})(ValidateQR);

export default FormikApp;
