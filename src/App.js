import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactHowler from 'react-howler'
import FaClockO from 'react-icons/lib/fa/clock-o'
import FaCaretUp from 'react-icons/lib/fa/caret-up'
import './App.css';

function Title() {
  return (
  <div className="title"> 
    <FaClockO className="icon" />
    <h1>Alarm Cycle</h1>
  </div>
  )
}

class Clock extends Component {
  constructor(props) { 
    super(props) // base constructor
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }
    this.state = { 
      dateFIX: new Date().toLocaleTimeString('en-US', options)
    } // initial state
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
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }
    this.setState({
      dateFIX: new Date().toLocaleTimeString('en-US', options)
    })
  }

  render() {
    const {dateFIX} = this.state
    return (
      <div>
        <h1 className="clock">{dateFIX}</h1>
        <Alarm date={dateFIX} />        
      </div>
    )
  }
}


function AlarmNotify(props) {
  const alarm = props.alarm
  const isRinging = props.isRinging

  if (!alarm) {
    return null
  } else {
    if (alarm && !isRinging) {
      return (
        <ReactCSSTransitionGroup 
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}> 
        <div>
          <h3 className="form">Alarm will ring at {alarm.slice(0, 4) + alarm.slice(7, alarm.legnth) }</h3>
          <button className="textBox" id="submit" onClick={() => props.cancel()}>Cancel</button>
        </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      return null
    }
  }
}

class Alarm extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hour: null,
      min: null,
      sec: "00",
      am: 'AM',
      alarm: null,
      isRinging: false
     }

    this.handleHours = this.handleHours.bind(this)
    this.handleMins = this.handleMins.bind(this)
    this.handleAM = this.handleAM.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

  }
  
  handleHours(event) {
    this.setState({ hour: event.target.value })
  }
  handleMins(event) {
    this.setState({ min: ('0' + event.target.value).slice(-2) })
  }
  handleAM(event) {
    this.setState({ am: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ 
      alarm: this.state.hour + ":" + this.state.min + ":" + this.state.sec + " " + this.state.am,
      isRinging: false
    })
  }
  handleRinging() {
    if ((this.state.alarm != null) && (this.props.date === this.state.alarm)) {
      this.setState({
        isRinging: true
      })
    }
  }
  handleSound() {
    this.setState({
      isRinging: false,
      alarm: null
    })
  }
  handleCancel() {
    this.setState({
      alarm: null
    })
  }

  componentDidMount() {
    this.timerID = setInterval(
     () => this.handleRinging(),
     1 
    )
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }


  render(){
    const { isRinging, alarm } = this.state;
    return (
      <div>
        <AlarmNotify alarm={alarm} isRinging={isRinging} cancel={this.handleCancel} />
        { isRinging === true &&
        <div className="form">
          <ReactHowler 
            src="alarm.mp3"
            playing={isRinging}
            loop={true}
          />
          <button className="textBox" id="submit" onClick={() => this.handleSound()}>Turn Off</button>
        </div>
        }
        { !alarm &&
          <form className="form" onSubmit={this.handleSubmit}>
            <input type="number" placeholder="Hour" required="true" min="1" max="12" className="textBox" onChange={this.handleHours} />
            <input type="number" placeholder="Mins" required="true" min="0" max="59" className="textBox" onChange={this.handleMins} />
            <select className="textBox" id="amPmBox" onChange={this.handleAM}>
              <option className="textOpt">AM</option>
              <option className="textOpt">PM</option>
            </select>
            <div>
            <input type="submit" className="textBox" id="submit" value="Set Alarm" />
            </div>
          </form>
        }
      </div>
    )}
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <Title />
        <Clock />
      </div>
    );
  }
}

export default App;