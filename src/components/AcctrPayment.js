import React from 'react';
import AcctrForm from './AcctrForm';

const AcctrPayment = (props) => {
  return (
    <div className="content-container">
      <h2 className="page-header__title">Nový prevod medzi účtami</h2>
      <div className="page-header__tagline">
        <p>
          Preneste si peniaze medzi svojimi účtami rýchlo a bez overovania.
        </p>
      </div>
      <AcctrForm />
    </div>
  );
};

export default AcctrPayment;
