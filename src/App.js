import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactHowler from 'react-howler'
import FaClockO from 'react-icons/lib/fa/clock-o'
import FaCaretUp from 'react-icons/lib/fa/caret-up'
import './App.css';

const OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true
}

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
    
    this.state = { 
      dateFIX: new Date().toLocaleTimeString('en-US', OPTIONS)
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
    this.setState({
      dateFIX: new Date().toLocaleTimeString('en-US', OPTIONS)
    })
  }

  render() {
    const {dateFIX} = this.state
    return (
      <div>
        <h1 className="clock clock-small">{dateFIX}</h1>
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
            <h3 className="form">Alarm will ring at 
            {alarm.length === 11 ? ` ${alarm.slice(0, 5)} ${alarm.slice(8, alarm.legnth)}` 
                                 : ` ${alarm.slice(0, 4)} ${alarm.slice(7, alarm.legnth)}`}
            </h3>
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
      hour: "9",
      min: "00",
      sec: '00',
      am: 'AM',
      alarm: null,
      isRinging: false
     }
    this.handleHours = this.handleHours.bind(this)
    this.handleMins = this.handleMins.bind(this)
    this.handleAM = this.handleAM.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleUp = this.handleUp.bind(this)
    this.handleDown = this.handleDown.bind(this)
  }
  
  handleHours(event) {
    if ((event.target.value <= 12 && event.target.value >= 1) || event.target.value === '') {
      this.setState({ hour:  event.target.value })
    }
    
  }
  handleMins(event) {
    if ((event.target.value <= 59 && event.target.value >= 0) || event.target.value === '') {
      this.setState({ min: ('0' + event.target.value).slice(-2) })
    }
  }
  handleAM(event) {
    if (event.target.value === "AM" || event.target.value === "PM" || event.target.value === "M" ||event.target.value === "A"||event.target.value === "P" ||event.target.value === "")
    this.setState({ am: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ 
      alarm: `${this.state.hour}:${this.state.min}:${this.state.sec} ${this.state.am}`,
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

  handleUp() {
    const {hour, min, am} = this.state
    if ( hour > 1) {
      this.setState({
        hour: hour - 1
      })
    }
  }
  handleDown() {
    const {hour, min, am} = this.state
    if (hour < 12)
    this.setState({
      hour: parseInt(hour,10) + 1
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
    const { isRinging, alarm, hour, min, am } = this.state;
    const selHours = [...Array(12).keys()];
    const selMins = [...Array(60).keys()];
    const selAM = ["AM", "PM"]
    return (
      <div>
        <AlarmNotify alarm={alarm} isRinging={isRinging} cancel={this.handleCancel} />
        { isRinging &&
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
          <div>
          <form className="form border" onSubmit={this.handleSubmit}>
            
            <span className="col-top border" onClick={this.handleUp}> {hour !== '' && hour > 1 ? hour - 1 : ''}</span>
            <span className="col'-top border" onClick={this.handleUp}>{min !== '' && min > 0 ? ('0' + (min - 1)).slice(-2) : ''}</span>
            <span className="col-top border" onClick={this.handleUp}>{am === "PM" ? "AM" : '' }</span>
            
            <div>
              <input 
              type="text" 
              value={hour} 
              required="true" 
              min="1" 
              max="12" 
              className="col-mid textBox border" 
              onChange={this.handleHours} />
              <span className="colon col-mid border">:</span>
            </div>  
            <div>
              <input 
              type="text" 
              value={min} 
              required="true" 
              min="0" 
              max="59" 
              className="col-mid textBox border" 
              onChange={this.handleMins} />
            </div>  
            <div>
              <input 
              type="text" 
              value={am} 
              pattern="(AM|PM)" 
              className="col-mid textBox border" 
              onChange={this.handleAM}/>
            </div>  

            <span className="col-bot border" hh={"1"} onClick={this.handleDown}>{hour !== '' && hour < 12 ? parseInt(hour, 10) + 1 : ''}</span>
            <span className="col-bot border">{min !== '' && min >= 0 && min < 59 ? ('0' + (parseInt(min, 10) + 1)).slice(-2) : ''}</span>
            <span className="col-bot border">{am === "AM" ? "PM" : ''}</span>
    
            
              <div className="border">
                <input type="submit" className="textBox border" id="submit" value="Set Alarm" />
              </div>
            </form>
            </div>
        }
        { isRinging &&
          <form className="form" onSubmit={this.handleSubmit}>
            <input type="number" placeholder="Hour" required="true" min="1" max="12" className="textBox" onChange={this.handleHours} />
            <input type="number" placeholder="Mins" required="true" min="0" max="59" className="textBox" onChange={this.handleMins} />
            <select className="textBox" id="amPmBox" pattern="[AM, PM]" onChange={this.handleAM}>
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