import React from 'react';
import moment from 'moment';
import Yup from 'yup';
import IBAN from 'fast-iban';
import { connect } from 'react-redux';
import { withFormik, Form, Field } from 'formik';
import { SingleDatePicker } from 'react-dates';
import numeral from 'numeral';

import { startAddTransaction } from '../actions/txnActions';
import ValidateQR from './ValidateQR';


class SepaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentDate: moment(),
      calendarFocused: false
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
        <Form className="sepa-form">
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
                  type="text"
                  disabled
                  className="text-input text-input__currency"
                />
              </div>
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
                <div className="sepa-form__datepicker">
                  <Field
                    name="charges"
                    type="text"
                    disabled
                    className="text-input text-input__charges"
                  />
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
            </div>
          </div>
          <div className="sepa-form__splitter" />
          <div className="sepa-form__creditor">
            <h3 className="sepa-form__title">Prijímateľ</h3>
            <div className="form-group">
              <label>Účet prijímateľa</label>
              <Field
                name="ibanTo"
                placeholder="Vyplňte IBAN účet prijímateľa"
                type="text"
                disabled={isSubmitting}
                className={errors.ibanTo && touched.ibanTo ? 'iban-font text-input text-input--error' : 'iban-font text-input'}
              />
              {errors.ibanTo && touched.ibanTo && <div className="text-input--feedback">{errors.ibanTo}</div>}
            </div>
            <div className="form-group">
              <label>Meno prijímateľa</label>
              <Field
                name="creditorName"
                placeholder="Vyplňte meno prijímateľa"
                type="text"
                disabled={isSubmitting}
                className={errors.creditorName && touched.creditorName ? 'iban-font text-input text-input--error' : 'text-input'}
              />
              {errors.creditorName && touched.creditorName && <div className="text-input--feedback">{errors.creditorName}</div>}
            </div>
            <div className="form-group">
              <div className="justify-content-space-between">
                <label className="text-input--symbols">Variabliny symbol</label>
                <label className="text-input--symbols">Specificky symbol</label>
                <label className="text-input--symbols">Konstantny symbol</label>
              </div>
              <div className="justify-content-space-between">
                <Field
                  name="varSymbol"
                  type="text"
                  disabled={isSubmitting}
                  className="text-input text-input--symbols"
                />
                <Field
                  name="specSymbol"
                  type="text"
                  disabled={isSubmitting}
                  className="text-input text-input--symbols"
                />
                <Field
                  name="constSymbol"
                  type="text"
                  disabled={isSubmitting}
                  className="text-input text-input--symbols"
                />
              </div>
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
  ibanTo: Yup.string().required('Povinné pole').matches(/[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?\d{4}$/, 'Zadajte platný IBAN'),
  amount: Yup.string().required('Povinné pole').matches(/^\d{1,}(\.?,?\d{0,2})?$/, 'Suma je zadaná v zlom formáte'),
  creditorName: Yup.string().required('Povinné pole')
};


const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      ibanFrom: '',
      ibanTo: '',
      charges: 'SHA',
      currency: 'EUR',
      creditorName: '',
      amount: '',
      note: '',
      varSymbol: '',
      specSymbol: '',
      constSymbol: '',
      express: false,
      requireQR: true
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
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

      if (correctAmount > values.accBalance) {
        setErrors({
          amount: 'Suma je väčšia ako zostatok na účte'
        });
      } else {
        const payment = {
          type: 'sepa',
          flow: 'debit',
          status: 'sent',
          charges: values.charges,
          ibanFrom: values.ibanFrom,
          ibanTo: values.ibanTo.replace(/ /g, ''),
          creditorName: values.creditorName,
          amount: correctAmount * 100,
          currency: values.currency,
          paymentDate: values.paymentDate,
          constSymbol: values.constSymbol,
          specSymbol: values.specSymbol,
          varSymbol: values.varSymbol,
          note: values.note,
          express: values.express
        };
        props.startAddTransaction(payment).then(() => {
          resetForm();
        });
      }
      setSubmitting(false);
    }
  }
})(SepaForm);


const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts,
  userSecret: reduxStore.auth.secret
});

const mapDispatchToProps = (dispatch) => ({
  startAddTransaction: (payment) => dispatch(startAddTransaction(payment))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikApp);
