import React from 'react';
import moment from 'moment';
import Clock from './Clock';

moment.locale('sk');

const DashboardClockOverview = () => {
  const now = moment();
  return (
    <div className="dashboard__widget dashboard__widget--right">
      <div className="dashboard__header">
        <span>{now.format('dddd, D.MMMM.YYYY')}</span>
      </div>
      <Clock />
    </div>
  );
};

export default DashboardClockOverview;
