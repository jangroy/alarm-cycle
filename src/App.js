import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';



class Clock extends React.Component {
  constructor(props) { 
    super(props) // base constructor
    this.state = { date: new Date() } // initial state
  }
  // lifecycle hooks
  componentDidMount() {
    this.timerID = setInterval(
     () => this.tick(),
     1000 
    )
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  // when tick is called, setState to the new Date
  tick() {
    this.setState({
      date: new Date()
    })
  }

  render() {
    return (
      <div>
        <h1>{this.state.date.toLocaleTimeString()}</h1>
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <Clock />
      <div>
      I want to wake up at ... 
      </div>
      <div>
      I'm going to sleep at ...
      </div>
      </div>
    );
  }
}

export default App;