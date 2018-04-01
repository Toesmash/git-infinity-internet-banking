import React from 'react';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup';
import { connect } from 'react-redux';
import moment from 'moment';
import IBAN from 'fast-iban';
import numeral from 'numeral';

import { startAddTransaction } from '../actions/txnActions';

const AcctrForm = (props) => {
  const {
    values, errors, accounts, touched, isSubmitting, handleReset
  } = props;
  let accBalance = 0;
  accounts.map((element) => {
    if (values.ibanFrom === element.iban) {
      accBalance = element.balance / 100;
    }
    return null;
  });

  const setData = () => {
    let accBalance = 0;
    props.accounts.map((element) => {
      if (props.values.ibanFrom === element.iban) {
        accBalance = element.balance / 100;
      }
      return null;
    });
    props.setValues({
      ...props.values,
      accBalance
    });
  };

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
                type="text"
                disabled
                className="text-input text-input__currency"
              />
            </div>
            {errors.amount && touched.amount && <div className="text-input--feedback">{errors.amount}</div>}
          </div>
        </div>
        <div className="sepa-form__splitter" />
        <div className="sepa-form__creditor">
          <h3 className="sepa-form__title">Prijímateľ</h3>
          <div className="form-group">
            <label>Účet prijímateľa</label>
            <Field
              component="select"
              name="ibanTo"
              value={values.ibanTo}
              disabled={isSubmitting}
              className={errors.ibanTo && touched.ibanTo ? 'iban-font text-input__select text-input--error' : 'iban-font text-input__select'}
            >
              <option key="0" value="" defaultValue hidden >-</option>
              {
                accounts.map((item) => {
                  if (item.iban === values.ibanFrom) {
                    return (
                      <option
                        key={item.iban}
                        value={item.iban}
                        disabled
                      >
                        {IBAN.formatIBAN(item.iban)}
                      </option>
                    );
                  }
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
            {errors.ibanTo && touched.ibanTo && <div className="text-input--feedback">{errors.ibanTo}</div>}
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
            <button onClick={setData} type="submit" className="button button__submit button__fastpayment" disabled={isSubmitting}>Skontroluj platbu</button>
          </div>
        </div>
      </Form>
    </div>
  );
};


const schema = {
  ibanFrom: Yup.string().required('Povinné pole'),
  ibanTo: Yup.string().required('Povinné pole'),
  amount: Yup.string().required('Povinné pole').matches(/^\d{1,}(\.?,?\d{0,2})?$/, 'Suma je zadaná v zlom formáte')
};


const FormikApp = withFormik({
  mapPropsToValues(props) {
    return {
      ibanFrom: '',
      ibanTo: '',
      currency: 'EUR',
      amount: '',
      note: ''
    };
  },
  validationSchema: Yup.object().shape(schema),
  handleSubmit(values, formikBag) {
    const {
      resetForm, setErrors, setSubmitting, props
    } = formikBag;
    let correctAmount = values.amount.replace(/,/g, '.');
    correctAmount = parseFloat(correctAmount, 10);
    if (correctAmount > values.accBalance) {
      setErrors({
        amount: 'Suma je väčšia ako zostatok na účte'
      });
    } else if (values.ibanFrom === values.ibanTo) {
      setErrors({
        ibanTo: 'Účty sa nemôžu zhodovať'
      });
    } else {
      const payment = {
        type: 'acctr',
        flow: 'debit',
        status: 'sent',
        charges: '',
        paymentDate: moment().valueOf(),
        ibanFrom: values.ibanFrom,
        ibanTo: values.ibanTo,
        amount: correctAmount * 100,
        currency: values.currency,
        note: values.note
      };
      props.startAddTransaction(payment).then(() => {
        resetForm();
      });
    }
    setSubmitting(false);
  }
})(AcctrForm);

const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts
});

const mapDispatchToProps = (dispatch) => ({
  startAddTransaction: (payment) => dispatch(startAddTransaction(payment))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormikApp);
