import React from 'react'
import $ from'jquery'
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown} from "react-icons/fa";
import { FaPlay} from "react-icons/fa";
import { FaRedo } from "react-icons/fa";

import './timer.css';
import { createStore} from 'redux'
import { Provider, connect } from 'react-redux'

// Redux
const ADD_INTERVALS = "ADD_INTERVALS";
const ADD_TIME = "ADD_TIME";

// actions creator
const addInterval= (value)=>{
  return ({
    type: ADD_INTERVALS,
    value  
  })
}

//reducer
const reducer = (state=0, action)=>{
  switch(action.type){   
    case ADD_INTERVALS:
      return action.value;
      break;
    default: 
      return state;
  }
}
const store= createStore(reducer);

//React
class MyClock extends React.Component{
  constructor(props){
    super(props)
    // The local state of the component
    this.state={
      condition: true,
    }
    this.handleDecreaseChange = this.handleDecreaseChange.bind(this);
    this.handleIncreaseChange = this.handleIncreaseChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.addZero = this.addZero.bind(this);
      }
  
  //Function to add left zero digit to numbers less than ten
  addZero(time){
    if(time < 10){
     return "0" + time
    }
     return time;
  }
  
  //Function to decrease the duration length
  handleDecreaseChange(e){
    //get the parent id of the clicked button
    console.log(e.target)
    let parent = document.getElementById(e.target.id).parentElement.id
    let lengthDurationId = $(`#${parent}>span`).attr('id');
    let lengthDuration = $(`#${lengthDurationId}`).text();
    
    if(lengthDuration > 1){
      lengthDuration--;   
      $(`#${lengthDurationId}`).text(lengthDuration);
      if (lengthDurationId === "session-length"){
        if(lengthDuration < 10){
          $("#time-left").text( this.addZero(lengthDuration)+":00");  
        }
        else{
          $("#time-left").text( lengthDuration+":00");  
        }
      }
    }
    
 }
  
  handleIncreaseChange(e){
    let parent = document.getElementById(e.target.id).parentElement.id
    let lengthDurationId = $(`#${parent}>span`).attr('id');
    let lengthDuration =  $(`#${lengthDurationId}`).text();
    
    if(lengthDuration < 60){
      lengthDuration++;
      $(`#${lengthDurationId}`).text(lengthDuration);
      if (lengthDurationId === "session-length"){
        if(lengthDuration < 10){
          $("#time-left").text( this.addZero(lengthDuration)+":00");  
        }
        else{
          $("#time-left").text( lengthDuration+":00");  
        }
      }
    }
    
  }
  
  handlePlay(){
    
    if(this.state.condition){
      console.log("4444")
      this.setState({
        condition: false
      })
      $(".in-de").attr("disabled", true);
      let switched = "session";
      let a = $("#time-left").text()
      let counter = new Date(`Jan 5, 3000 00:${a}`).getTime()+ new Date().getTime();
    
      this.props.addNewInterval(setInterval( function(){
      let now = new Date().getTime()-1000
      let diff = counter - now;
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);
      minutes < 10 ? minutes = "0" + minutes : minutes=minutes;
      seconds < 10 ? seconds = "0" + seconds : seconds=seconds;  
      $("#time-left").text(`${minutes}:${seconds}`);
  
      if($("#time-left").text() === "00:00") {   
        document.getElementById("beep").play();
      
        if(switched === "session"){
          a = $("#break-length").text();
          a < 10 ? a = "0" + a : a=a;
          counter = new Date(`Jan 5, 2024 00:${a}:00`).getTime()+ new Date().getTime();
          $("#time-left").css("color", "red")
          $("#timer-label").text("Break")
          switched = "break"
        }
        else if(switched === "break"){
          a = $("#session-length").text();
          a < 10 ? a = "0" + a : a=a;
          counter = new Date(`Jan 5, 2024 00:${a}:00`).getTime()+ new Date().getTime();
          $("#time-left").css("color", "black");
          $("#timer-label").text("Session");
          switched = "session";
        }
      }
    },1000)
      )
    }
    else{
      clearInterval(this.props.interval)
      this.setState({
        condition: true
      })
       $(".in-de").attr("disabled", false);
    } 
    }
  
  handleReset(){
    clearInterval(this.props.interval)
    $("#break-length").text("5");
    $("#session-length").text("25");
    $("#timer-label").text("Session")
    $("#time-left").text("25:00");
    $("#time-left").css("color", "black")
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    $(".in-de").attr("disabled", false);
    this.setState(()=>({
        condition: true
      }))
  }
  
  render(){
    return(
      <div>
        <div id="box">
          <h1>25 + 5 Clock</h1>
          <div id="break-label">
            <p>Break Length</p>
            <FaArrowDown id="break-decrement" className="in-de" onClick={this.handleDecreaseChange}></FaArrowDown>
            <span id="break-length">5</span>
            <FaArrowUp id="break-increment" className="in-de" onClick={this.handleIncreaseChange}></FaArrowUp>
            </div>
          <div id="session-label">
            <p>Session Length</p>
            <FaArrowDown id="session-decrement" className="in-de" onClick={this.handleDecreaseChange}></FaArrowDown>
            <span id="session-length">25</span>
            <FaArrowUp id="session-increment" className="in-de" onClick={this.handleIncreaseChange}></FaArrowUp> 
          </div>
          <div id="timer">
            <div id="timer-label">Session</div>
            <div id="time-left">25:00</div>
          </div>
          <div>
            <FaPlay id="start_stop"  onClick={this.handlePlay} className="in-de"></FaPlay>
            <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
            {/*<button onClick={this.handlePause}><i class="fa fa-pause fa-2x"></i></button>*/}
            <FaRedo id="reset" onClick={this.handleReset} className="in-de"></FaRedo>
          </div>
        </div>
      </div>
    )
  }
}
//React-Redux
function mapStateToProps(state){
  return({
    interval: state
  })
}

function mapDispatchToProps(dispatch){
  return({
      addNewInterval: function (value){
        dispatch(addInterval(value))
     },

  })
}

const Container = connect(mapStateToProps, mapDispatchToProps)(MyClock);

class TimerWrapper extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <Container/>
      </Provider>
    )
  }  
}
export default TimerWrapper