import React from 'react';
import moment from 'moment';

export default class Clock extends React.Component {
  constructor() {
    super();
    this.state = {
      time: moment()
    };
  }
  componentDidMount() { // create the interval once component is mounted
    this.update = setInterval(() => {
      this.setState({ time: moment() });
    }, 1000);
  }

  componentWillUnmount() { // delete the interval just before component is removed
    clearInterval(this.update);
  }

  setTime = () => {
    this.setState(() => ({
      time: moment()
    }));
  }

  render() {
    const { time } = this.state;
    return (
      <div className="clock">
        <h1>{time.format('LTS')}</h1>
      </div>
    );
  }
}
