import React from 'react';
import SwiftForm from './SwiftForm';

const SwiftPayment = (props) => {
  return (
    <div className="content-container">
      <h2 className="page-header__title">Nová medzinárodná platba</h2>
      <div className="page-header__tagline">
        <p>
          SWIFT - Globálny poskytovateľ bezpečných finančných správ.
        </p>
      </div>
      <SwiftForm />
    </div>
  );
};

export default SwiftPayment;
