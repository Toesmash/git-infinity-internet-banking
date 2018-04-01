import React from 'react';
import moment from 'moment';
import Yup from 'yup';
import IBAN from 'fast-iban';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { withFormik, Form, Field } from 'formik';
import { SingleDatePicker } from 'react-dates';

import { startAddSwiftTransaction } from '../actions/txnActions';
import ValidateQR from './ValidateQR';


class SwiftForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentDate: moment(),
      calendarFocused: false,
      rates: {
        EUR: 1,
        CZK: 0.0394542,
        HUF: 0.00318386,
        PLN: 0.236976,
        USD: 0.811420,
        JPY: 0.00763472,
        GBP: 1.13706,
        CHF: 0.850752,
        CAD: 0.629256
      }
    };
  }


  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  };

  onDateChange = (date) => {
    if (date) {
      this.setState(() => ({ paymentDate: date }));
    }
  }

  setDate = () => {
    let accBalance = 0;
    this.props.accounts.map((element) => {
      if (this.props.values.ibanFrom === element.iban) {
        accBalance = element.balance / 100;
      }
      return null;
    });
    this.props.setValues({
      ...this.props.values,
      accBalance,
      exchangeRate: this.state.rates[this.props.values.currency],
      paymentDate: this.state.paymentDate.valueOf()
    });
  };

  handleQRvalidation = (response) => {
    this.props.setValues({ ...this.props.values, requireQR: false });
    this.props.submitForm();
  }


  render() {
    const {
      errors, touched, isSubmitting, accounts, values, handleReset
    } = this.props;
    let accBalance = 0;
    accounts.map((element) => {
      if (values.ibanFrom === element.iban) {
        accBalance = element.balance / 100;
      }
      return null;
    });

    return (
      <div>
        <Form className="sepa-form" id="sepa-payment">
          <div className="sepa-form__debtor">
            <h3 className="sepa-form__title">Odosielateľ</h3>
            <div className="form-group">
              <label>Účet odosielateľa</label>
              <Field
                component="select"
                name="ibanFrom"
                value={values.ibanFrom}
                disabled={isSubmitting}
                className={errors.ibanFrom && touched.ibanFrom ? 'iban-font text-input__select text-input--error' : 'iban-font text-input__select'}
              >
                <option key="0" value="" defaultValue hidden >-</option>
                {
                  accounts.map((item) => {
                    return (
                      <option
                        key={item.iban}
                        value={item.iban}
                      >
                        {IBAN.formatIBAN(item.iban)}
                      </option>
                    );
                  })
                }
              </Field>
              {values.ibanFrom && <label className="text-input__balance">Tvoj zostatok na účte je <span>{numeral(accBalance).format('0,0[.]00')} EUR</span></label>}
              {errors.ibanFrom && touched.ibanFrom && <div className="text-input--feedback">{errors.ibanFrom}</div>}
            </div>
            <div className="form-group">
              <div className="justify-content-space-between">
                <label>Suma</label>
                <label>Mena</label>
              </div>
              <div className="justify-content-space-between">
                <Field
                  name="amount"
                  placeholder="Suma"
                  type="text"
                  disabled={isSubmitting}
                  className={errors.amount && touched.amount ? 'text-input text-input--error' : 'text-input'}
                />
                <Field
                  name="currency"
                  component="select"
                  value={values.currency}
                  disabled={isSubmitting}
                  className="text-input text-input__currency"
                >
                  {
                    Object.keys(this.state.rates).map((key, index) => {
                      return <option key={key} value={key}>{key}</option>;
                    })
                  }
                </Field>
              </div>
              {
                values.amount &&
                values.currency !== 'EUR' &&
                !errors.amount &&
                <label
                  className="text-input__balance"
                >
                  {numeral(values.amount).format('0,0[.]00')} {values.currency} je presne <span>{numeral((values.amount.replace(/,/g, '.') * this.state.rates[values.currency])).format('0,0[.]00')} EUR</span>
                </label>
              }
              {errors.amount && touched.amount && <div className="text-input--feedback">{errors.amount}</div>}
            </div>
            <div className="form-group">
              <label>Dátum platby</label>
              <SingleDatePicker
                block
                date={this.state.paymentDate}
                onDateChange={this.onDateChange}
                focused={this.state.calendarFocused}
                onFocusChange={this.onFocusChange}
                numberOfMonths={1}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <div className="justify-content-space-between">
                <label>Poplatky</label>
                <label>Zrýchlená platba</label>
              </div>
              <div className="justify-content-space-between">
                <div>
                  <Field
                    component="select"
                    name="charges"
                    value={values.charges}
                    disabled={isSubmitting}
                    className={errors.charges && touched.charges ? 'text-input__select text-input--error' : 'text-input__select'}
                  >
                    <option key="0" value="" defaultValue hidden >-</option>
                    <option key="BEN" value="ben">BEN - prijímateľ</option>
                    <option key="SHA" value="sha">SHA - rozdelene</option>
                    <option key="OUR" value="our">OUR - odosielateľ</option>
                  </Field>
                </div>
                <div className="justify-content-space-between">
                  <label>iba po 12:00  </label>
                  <Field
                    type="checkbox"
                    name="express"
                    value={values.express}
                    disabled={isSubmitting}
                    className="text-input sepa-form__express"
                  />
                </div>
              </div>
              {errors.charges && touched.charges && <div className="text-input--feedback">{errors.charges}</div>}
            </div>
          </div>
          <div className="sepa-form__splitter" />
          <div className="sepa-form__creditor">
            <h3 className="sepa-form__title">Prijímateľ</h3>
            <div className="form-group">
              <div className="justify-content-space-between">
                <label>Účet prijímateľa</label>
                <label>BIC banky</label>
              </div>
              <div className="justify-content-space-between">
                <Field
                  name="creditorAcc"
                  placeholder="Vyplňte účet"
                  type="text"
                  disabled={isSubmitting}
                  className={errors.creditorAcc && touched.creditorAcc ? 'iban-font text-input text-input--error' : 'iban-font text-input'}
                />
                <Field
                  name="creditorBIC"
                  placeholder="BIC kód"
                  type="text"
                  disabled={isSubmitting}
                  className={errors.creditorBIC && touched.creditorBIC ? 'iban-font text-input text-input--error text-input--BIC' : 'iban-font text-input text-input--BIC'}
                />
              </div>
              {errors.creditorAcc && touched.creditorAcc && <div className="text-input--feedback">{errors.creditorAcc}</div>}
              {errors.creditorBIC && touched.creditorBIC && <div className="text-input--feedback">{errors.creditorBIC}</div>}
            </div>
            <div className="form-group">
              <label>Meno prijímateľa</label>
              <Field
                name="creditorInfo"
                placeholder="Vyplňte meno"
                type="text"
                disabled={isSubmitting}
                className={errors.creditorInfo && touched.creditorInfo ? 'iban-font text-input text-input--error' : 'text-input'}
              />
              {errors.creditorInfo && touched.creditorInfo && <div className="text-input--feedback">{errors.creditorInfo}</div>}
            </div>
            <div className="form-group">
              <label>Banka prijímateľa</label>
              <Field
                name="creditorBankInfo"
                placeholder="Vyplňte banku"
                type="text"
                disabled={isSubmitting}
                className={errors.creditorBankInfo && touched.creditorBankInfo ? 'iban-font text-input text-input--error' : 'text-input'}
              />
              {errors.creditorBankInfo && touched.creditorBankInfo && <div className="text-input--feedback">{errors.creditorBankInfo}</div>}
            </div>
            <div className="form-group">
              <label>Referencia</label>
              <Field
                name="reference"
                type="text"
                disabled={isSubmitting}
                className="text-input"
              />
            </div>
            <div className="form-group">
              <label>Poznámka pre prijímateľa</label>
              <Field
                name="note"
                type="text"
                disabled={isSubmitting}
                className="text-input"
              />
            </div>
            <div className="sepa-form-buttons">
              <button onClick={handleReset} type="button" className="button button__reset" disabled={isSubmitting}>Vymaž formulár</button>
              <button onClick={this.setDate} type="submit" className="button button__submit button__fastpayment" disabled={isSubmitting}>Skontroluj platbu</button>
            </div>
          </div>
        </Form>
        {
          errors.validate &&
          <ValidateQR
            secret={this.props.userSecret}
            onReset={handleReset}
            onSubmit={this.handleQRvalidation}
          />
        }
      </div>
    );
  }
}

const schema = {
  ibanFrom: Yup.string().required('Povinné pole'),
  amount: Yup.string().required('Povinné pole').matches(/^\d{1,}(\.?,?\d{0,2})?$/, 'Suma je zadaná v zlom formáte'),
  currency: Yup.string().required('Povinné pole'),
  creditorAcc: Yup.string().required('Povinné pole'),
  creditorBIC: Yup.string().required('Povinný BIC identifikátor'),
  creditorInfo: Yup.string().required('Povinné pole'),
  creditorBankInfo: Yup.string().required('Povinné pole'),
  charges: Yup.string().required('Povinné pole')
};


const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      ibanFrom: '',
      creditorAcc: '',
      creditorBIC: '',
      creditorInfo: '',
      creditorBankInfo: '',
      amount: '',
      note: '',
      reference: '',
      currency: 'EUR',
      express: false,
      charges: '',
      requireQR: true
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    console.log(values, formikBag);
    if (values.requireQR) {
      formikBag.setErrors({
        validate: 'Prosím overte platbu zadaním unikátneho QR kódu.'
      });
    } else {
      const {
        resetForm, setErrors, setSubmitting, props
      } = formikBag;
      let correctAmount = values.amount.replace(/,/g, '.');
      correctAmount = parseFloat(correctAmount, 10);
      const originialAmount = correctAmount;
      const amount = Math.round((values.amount * values.exchangeRate) * 100) / 100;


      console.log('AMOUNT: ', amount);
      console.log('ORIGINAL AMOUNT: ', originialAmount);
      console.log('CURRENCY: ', values.currency);

      if (amount > values.accBalance) {
        setErrors({
          amount: 'Suma je väčšia ako zostatok na účte'
        });
      } else {
        const payment = {
          type: 'swift',
          flow: 'debit',
          status: 'sent',
          charges: values.charges,
          ibanFrom: values.ibanFrom,
          creditorAcc: values.creditorAcc,
          creditorBIC: values.creditorBIC,
          creditorInfo: values.creditorInfo,
          creditorBankInfo: values.creditorBankInfo,
          amount: amount * 100,
          originialAmount: originialAmount * 100,
          currency: values.currency,
          paymentDate: values.paymentDate,
          reference: values.reference,
          note: values.note,
          express: values.express
        };
        props.startAddSwiftTransaction(payment).then(() => {
          resetForm();
        });
      }
      setSubmitting(false);
    }
  }
})(SwiftForm);


const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts,
  userSecret: reduxStore.auth.secret
});

const mapDispatchToProps = (dispatch) => ({
  startAddSwiftTransaction: (payment) => dispatch(startAddSwiftTransaction(payment))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikApp);
