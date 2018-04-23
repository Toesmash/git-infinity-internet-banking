import React from 'react';
import { connect } from 'react-redux';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import GlyphLupa from 'react-icons/lib/fa/search';

import {
  resetFilter,
  setTextFilter,
  sortByDate,
  sortByAmount,
  sortAllCardsTxn,
  sortByATM,
  sortByVendor,
  setStartDate,
  setEndDate,
  setTxnPerPage
} from '../actions/filterActions';

class CardsTransactionFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedFilter: false,
      calendarFocused: null
    };
  }

  componentDidMount() {
    this.props.resetFilter();
  }

  onTextChange = (e) => {
    this.props.setTextFilter(e.target.value);
  };

  onSortChange = (e) => {
    if (e.target.value === 'date') {
      this.props.sortByDate();
    }
    if (e.target.value === 'amount') {
      this.props.sortByAmount();
    }
  };

  onATMchange = (e) => {
    if (e.target.value === 'all') {
      this.props.sortAllCardsTxn();
    }
    if (e.target.value === 'atm') {
      this.props.sortByATM();
    }
    if (e.target.value === 'vendor') {
      this.props.sortByVendor();
    }
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.props.setStartDate(startDate);
    this.props.setEndDate(endDate);
  };

  onFocusChange = (newCalendarFocused) => {
    this.setState(() => ({
      calendarFocused: newCalendarFocused
    }));
  };

  onTxnPerPageChange = (e) => {
    this.props.setTxnPerPage(e.target.value);
  };

  rednerFilter = () => {
    return (
      <div className="filter__content">
        <div className="filter__input__group">
          <div className="filter__search">
            <label><GlyphLupa /> Hľadaj</label>
            <input
              className="text-input"
              type="text"
              value={this.props.filter.text}
              onChange={this.onTextChange}
              placeholder="Nájdem IBAN, poznámku, referenciu, prijímateľa, banku a iné..."
            />
          </div>
          <div className="filter__options">
            <div>
              <label>Radiť podľa</label>
              <select
                className="select"
                value={this.props.filter.sortBy}
                onChange={this.onSortChange}
              >
                <option value="date">Dátum</option>
                <option value="amount">Suma</option>
              </select>
            </div>
            <div>
              <label>Transackcie</label>
              <select
                className="select"
                value={this.props.filter.cardFlow}
                onChange={this.onATMchange}
              >
                <option value="all">Všetky</option>
                <option value="atm">Bankomaty</option>
                <option value="vendor">Obchodníci</option>
              </select>
            </div>
            <div>
              <label>Záznamy</label>
              <select
                className="select"
                value={this.props.filter.txnPerPage}
                onChange={this.onTxnPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
        <div className="filter__input__group">
          <div className="filter__date">
            <label>Rozsah dátumov</label>
            <DateRangePicker
              startDateId={`${moment().valueOf()}`}
              startDate={this.props.filter.startDate}
              endDateId={`${moment().valueOf()}`}
              endDate={this.props.filter.endDate}
              onDatesChange={this.onDatesChange}
              focusedInput={this.state.calendarFocused}
              onFocusChange={this.onFocusChange}
              numberOfMonths={1}
              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
              showClearDates
              showDefaultInputIcon
              hideKeyboardShortcutsPanel
              small
            />
          </div>
        </div>
        <div className="filter__input__group">
          <div className="filter__reset">
            <button
              className="button button__filter button__filter--reset"
              onClick={this.resetFilter}
            >
              Vymaž filter
            </button>
          </div>
        </div>
      </div>
    );
  }

  resetFilter = () => {
    this.props.resetFilter();
  }

  toggleFilter = () => {
    this.setState({
      expandedFilter: !this.state.expandedFilter
    });
  };

  render() {
    return (
      <div>
        <div className="transactions__filter">
          <p>História transackcií: {moment().format('MMMM').toUpperCase()}</p>
          <button
            className="button button__filter"
            onClick={this.toggleFilter}
          >
            {this.state.expandedFilter ? 'Schovaj filter' : 'Zobraz filter'}
          </button>
        </div>
        <div
          className={this.state.expandedFilter ? 'filter filter--show' : 'filter filter--hide'}
        >
          {this.rednerFilter()}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (reduxStore) => ({
  filter: reduxStore.filter,
  transactions: reduxStore.transactions
});

const mapDispatchToProps = (dispatch) => ({
  resetFilter: () => dispatch(resetFilter()),
  setTextFilter: (text) => dispatch(setTextFilter(text)),
  sortByDate: () => dispatch(sortByDate()),
  sortByAmount: () => dispatch(sortByAmount()),
  sortByATM: () => dispatch(sortByATM()),
  sortByVendor: () => dispatch(sortByVendor()),
  sortAllCardsTxn: () => dispatch(sortAllCardsTxn()),
  setStartDate: (date) => dispatch(setStartDate(date)),
  setEndDate: (date) => dispatch(setEndDate(date)),
  setTxnPerPage: (value) => dispatch(setTxnPerPage(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsTransactionFilter);
