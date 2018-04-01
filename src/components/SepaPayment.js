import React from 'react';
import SepaForm from './SepaForm';

const SepaPayment = (props) => {
  return (
    <div className="content-container">
      <h2 className="page-header__title">Nová SEPA platba</h2>
      <div className="page-header__tagline">
        <p>
          Jednotná oblasť platieb pre Európsku úniu.
          Rovnaké poplatky. Rovnaký čas. Rovnaké tlačivá.
        </p>
      </div>
      <SepaForm />
    </div>
  );
};

export default SepaPayment;
