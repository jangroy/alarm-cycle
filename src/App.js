import React, { Component } from 'react';
import ReactHowler from 'react-howler'
import FaClockO from 'react-icons/lib/fa/clock-o'
import FaCaretUp from 'react-icons/lib/fa/caret-up'
import FaCaretDown from 'react-icons/lib/fa/caret-down'
import FaGithub from 'react-icons/lib/fa/github'
import './App.css';

const OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true
}

function Title() {
  return (
  <div className="title fadeIn"> 
    <FaClockO className="icon" />
    <h1>Alarm Cycle</h1>
  </div>
  )
}
function Info() {
  return (
    <div className="info fadeIn">
      <FaGithub className="icon-small" />
      <a className="borBot" href="http://github.com/jangroy/alarm-cycle">github</a>
    </div>
  )
}
function SleepInfo() {
  return (
    <div className="fadeIn">
      <h4>A good night's sleep consists of <span className="highlight">5-6</span> complete sleep cycles.</h4>
      <h4>1 sleep cycle is about <span className="highlight">1</span> hour <span className="highlight">30</span> minutes.</h4>
      <h4>You shold go to sleep <span className="highlight">7.5</span> or <span className="highlight">9</span> hours before the alarm for best results.</h4>
    </div>
  )
}

function AlarmNotify(props) {
  const alarm = props.alarm
  const isRinging = props.isRinging

  if (!alarm) {
    return null
  } else {
    if (alarm && !isRinging) {
      return (
        <div className="fadeIn">
          <SleepInfo />
          <h2> Alarm set: <span className="highlight">
          {alarm.length === 11 ? ` ${alarm.slice(0, 5)} ${alarm.slice(8, alarm.legnth)}` 
                                : ` ${alarm.slice(0, 4)} ${alarm.slice(7, alarm.legnth)}`}
          </span></h2>
          <button id="submit" onClick={() => props.cancel()}>Cancel</button>
        </div>
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
      hour: "8",
      min: "30",
      sec: '00',
      am: 'AM',
      alarm: null,
      isRinging: false,
      clock: new Date().toLocaleTimeString('en-US', OPTIONS)
    }
    
    this.handleHours = this.handleHours.bind(this)
    this.handleMins = this.handleMins.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleHUp = this.handleHUp.bind(this)
    this.handleMUp = this.handleMUp.bind(this)
    this.handleHDown = this.handleHDown.bind(this)
    this.handleMDown = this.handleMDown.bind(this)
    this.handleAM = this.handleAM.bind(this)
  }
  
  handleHours(event) {
    if ((event.target.value <= 12 && event.target.value >= 1) || event.target.value === '') {
      this.setState({ hour:  event.target.value })
    }
  }
  handleMins(event) {
    if ((event.target.value <= 59 && event.target.value >= 0) || event.target.value === '') {
      this.setState({ min: this.state.min === "0" ? "00" : ('0' + event.target.value).slice(-2) })
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ 
      alarm: `${this.state.hour}:${this.state.min}:${this.state.sec} ${this.state.am}`,
      isRinging: false
    })
  }
  handleRinging() {
    if ((this.state.alarm != null) && (this.state.clock === this.state.alarm)) {
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

  handleHUp() {
    const {hour} = this.state
    if ( hour > 1) {
      this.setState({
        hour: hour - 1
      })
    }
  }
  handleHDown() {
    const {hour} = this.state
    if (hour < 12) {
      this.setState({
        hour: parseInt(hour,10) + 1
      })
    }
  }
  handleMUp() {
    const {min} = this.state
    if ( min > 1) {
      this.setState({
        min: ('0' + (min - (min % 5 === 0 ? 5 : min % 5))).slice(-2)
      })
    }
  }
  handleMDown() {
    const {min} = this.state
    if ( min < 56) {
      this.setState({
        min: ('0' + (parseInt(min,10) - (min % 5 === 0 ? -5 : (min % 5) - 5))).slice(-2)
      })
    }
  }
  handleAM() {
    const {am} = this.state
    am === "AM" ? this.setState({ am: "PM"}) : this.setState({ am: "AM"})
  }
  // when tick is called, setState to the new Date
  tick() {
    this.setState({
      clock: new Date().toLocaleTimeString('en-US', OPTIONS)
    })
  }
  componentDidMount() {
    this.timerRing = setInterval(
     () => this.handleRinging(),
     1 
    )
    this.timerTick = setInterval(
     () => this.tick(),
     1
    )
  }
  componentWillUnmount() {
    clearInterval(this.timerRing)
    clearInterval(this.timerTick)
  }

  render(){
    const { isRinging, alarm, hour, min, am, clock } = this.state;
    return (
      <div>
        { alarm && 
          <h1 className="clock fadeIn">{clock}</h1>
        }
        <AlarmNotify alarm={alarm} isRinging={isRinging} cancel={this.handleCancel} />
        
        { isRinging &&
        <div className="fadeIn">
          <ReactHowler 
            src="alarm.mp3"
            playing={isRinging}
            loop={true}
          />
          <button id="submit" onClick={() => this.handleSound()}>Wake Up!</button>
        </div>
        }

        { !alarm &&
          <div className="fadeIn">
          <form className="form" onSubmit={this.handleSubmit}>
            
            <div className="col-anim box">
              {hour > 1 ? <FaCaretUp className="col-anim" onClick={this.handleHUp} /> : '' }
              <span className="col-anim" onClick={this.handleHUp}>
              {hour !== '' && hour > 1 ? hour - 1 : ''}
              </span>
            </div>
            <div className="col-anim box">
              {min > 5  ? <FaCaretUp className="col-anim" onClick={this.handleMUp} />  : '' }
              <span className="col-anim" onClick={this.handleMUp}>
              {min !== '' && min > 4 ? ('0' + (min - (min % 5 === 0 ? 5 : min % 5))).slice(-2) : ''}
              </span>
            </div>
            <div className="col-anim box">
              {am === 'PM' ? <FaCaretUp className="col-anim" onClick={this.handleAM} /> : '' } 
             <span className="col-anim" onClick={this.handleAM}>
              {am === "PM" ? "AM" : '' }
              </span>
            </div>
            
            <div>
              <input 
                type="text" 
                value={hour} 
                required="true" 
                min="1" 
                max="12" 
                className="col-anim col-left col-mid" 
                onChange={this.handleHours} />
              
              <span className="col-anim colon">:</span>
            </div> 
            <div>
              <input 
                type="text" 
                value={min} 
                required="true" 
                min="0" 
                max="59" 
                className="col-anim col-mid" 
                onChange={this.handleMins} />
            </div> 
            <div>
              <span className="col-anim col-mid">{am}</span>
            </div>

            <div className="col-anim box">
              <span className="col-anim" onClick={this.handleHDown}>
              {hour !== '' && hour < 12 ? parseInt(hour, 10) + 1 : ''}
              </span>
              {parseInt(hour, 10) < 12  ? <FaCaretDown className="col-anim" onClick={this.handleHDown}/> : '' }
            </div>
            <div className="col-anim box">
              <span className="col-anim" onClick={this.handleMDown}>
              {min !== '' && min < 55 ? ('0' + (parseInt(min, 10) - (min % 5 === 0 ? 0 : min % 5) + 5)).slice(-2) : ''}
              </span>
              {parseInt(min, 10) < 55 ? <FaCaretDown className="col-anim" onClick={this.handleMDown}/> : '' }
            </div>
            <div className="col-anim box">
              <span className="col-anim" onClick={this.handleAM}>
              {am === "AM" ? "PM" : ''}
              </span>
              {am === 'AM' ? <FaCaretDown className="col-anim" onClick={this.handleAM} /> : '' } 
            </div>
            
            <span />
            <div>
              <input type="submit" id="submit" value="Set Alarm" />
            </div>

          </form>
        </div>
        }
        
      </div>
    )}
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <Info />
        <Title />
        <Alarm />
      </div>
    );
  }
}

export default App;