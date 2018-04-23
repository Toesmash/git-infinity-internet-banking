import React from 'react';
import moment from 'moment';
import Yup from 'yup';
import IBAN from 'fast-iban';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { withFormik, Form, Field } from 'formik';
import { startAddTransaction } from '../actions/txnActions';
import { history } from '../routers/AppRouter';

class FastPayment extends React.Component {
  setBalance = () => {
    let accBalance = 0;
    this.props.accounts.map((element) => {
      if (this.props.values.ibanFrom === element.iban) {
        accBalance = element.balance / 100;
      }
      return null;
    });
    this.props.setValues({
      ...this.props.values,
      accBalance
    });
  }

  render() {
    const {
      values, errors, touched, accounts, isSubmitting
    } = this.props;
    let accBalance = 0;

    accounts.map((element) => {
      if (values.ibanFrom === element.iban) {
        accBalance = element.balance / 100;
      }
      return null;
    });

    return (
      <Form>
        <div className="form-group">
          <label>Účet odosielateľa</label>
          <Field
            component="select"
            name="ibanFrom"
            value={values.ibanFrom}
            className={errors.ibanFrom && touched.ibanFrom ? 'iban-font text-input__select text-input--error' : 'iban-font text-input__select'}
          >
            <option key="0" value="" defaultValue hidden >-</option>
            {
              accounts.map((item) => {
                return (
                  <option key={item.iban} value={item.iban}>{IBAN.formatIBAN(item.iban)}</option>
                );
              })
            }
          </Field>
          {values.ibanFrom && <label className="text-input__balance">Tvoj zostatok na účte je <span>{numeral(accBalance).format('0,0[.]00')} EUR</span></label>}
          {errors.ibanFrom && touched.ibanFrom && <div className="text-input--feedback">{errors.ibanFrom}</div>}
        </div>
        <div className="form-group">
          <label>Účet prijímateľa</label>
          <Field
            name="ibanTo"
            placeholder="Vyplňte IBAN účet prijímateľa"
            type="text"
            className={errors.ibanTo && touched.ibanTo ? 'iban-font text-input text-input--error' : 'iban-font text-input'}
          />
          {errors.ibanTo && touched.ibanTo && <div className="text-input--feedback">{errors.ibanTo}</div>}
        </div>
        <div className="form-group">
          <label>Suma</label>
          <Field
            name="amount"
            placeholder="Suma"
            type="text"
            className={errors.amount && touched.amount ? 'text-input text-input--error' : 'text-input'}
          />
          {errors.amount && touched.amount && <div className="text-input--feedback">{errors.amount}</div>}
        </div>
        <button onClick={this.setBalance} type="submit" className="button button__submit button__fastpayment" disabled={isSubmitting}>Pošli platbu</button>
      </Form>
    );
  }
}

const schema = {
  ibanFrom: Yup.string().required('Povinné pole'),
  ibanTo: Yup.string().required('Povinné pole').matches(/[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?\d{4}$/, 'Zadajte platný IBAN'),
  amount: Yup.string().required('Povinné pole').matches(/^\d{1,}(\.?,?\d{0,2})?$/, 'Suma je zadaná v zlom formáte')
};


const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      ibanFrom: '',
      ibanTo: 'SK00 7777 0000 0000 0000 0000',
      amount: ''
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    const {
      setErrors, setSubmitting, props
    } = formikBag;
    let correctAmount = values.amount.replace(/,/g, '.');

    correctAmount = parseFloat(correctAmount, 10);
    if (correctAmount > values.accBalance) {
      if (correctAmount > 50) {
        setErrors({
          amount: ['Limit pre rýchle platby je 50 euro.', <br key="0" />, 'Suma je väčšia ako zostatok na účte']
        });
      } else {
        setErrors({
          amount: 'Suma je väčšia ako zostatok na účte'
        });
      }
    } else if (correctAmount > 50) {
      setErrors({
        amount: 'Limit pre rýchle platby je 50 euro.'
      });
    } else {
      const payment = {
        type: 'sepa',
        flow: 'debit',
        status: 'sent',
        charges: 'SHA',
        currency: 'EUR',
        ibanFrom: values.ibanFrom,
        ibanTo: values.ibanTo.replace(/ /g, ''),
        amount: correctAmount * 100,
        paymentDate: moment().valueOf()
      };
      props.startAddTransaction(payment).then(() => {
        history.push(`/accounts/${payment.ibanFrom}/success`);
      });
    }
    setSubmitting(false);
  }
})(FastPayment);


const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts
});

const mapDispatchToProps = (dispatch) => ({
  startAddTransaction: (payment) => dispatch(startAddTransaction(payment))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikApp);
