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
    value: value  
  })
}
const addTime= (value)=>{
  return ({
    type: ADD_TIME  
  })
}

//reducer
const reducer = (state='x', action)=>{
  switch(action.type){   
    case ADD_INTERVALS:
      state = action.value;
      return state;
      break;
    default: 
      return state;
  }
}
const store= createStore(reducer);
console.log(store.getState());

//React
class MyClock extends React.Component{
  constructor(props){
    super(props)
    this.state={
      condition: true,
      switch: 1
    }
  this.handleDecreaseChange = this.handleDecreaseChange.bind(this);
    this.handleIncreaseChange = this.handleIncreaseChange.bind(this);
    
    this.handleReset = this.handleReset.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleZero = this.handleZero.bind(this);
      }
  
  handleZero(time){
    if(time < "10"){
     return "0" + time
    }
    else{
      return time;
    }
  }
  
  handleDecreaseChange(e){
    let a = e.target.id
    let p = document.getElementById(a).parentElement.parentElement.id
    let z = $(`#${p} span`).attr('id');
    //console.log(z)
    let i =  document.getElementById(z).innerText;
    
    if(i > 1){
      i--;
     console.log(i);    
      document.getElementById(z).innerText= i;
    }
    
    if (z==="session-length"){
        if(i < 10){
        $("#time-left").text( this.handleZero(i)+":00");  
      }
      else{
          $("#time-left").text( i+":00");  
      }
      }
  }
  
  handleIncreaseChange(e){
    let a = e.target.id
    let p = document.getElementById(a).parentElement.parentElement.id
    let z = $(`#${p} span`).attr('id');
    console.log(z)
    let i =  document.getElementById(z).innerText;
    if(i<60){
      i++;
      document.getElementById(z).innerText=i;
    }
    if (z==="session-length"){
      if(i < 10){
        $("#time-left").text( this.handleZero(i)+":00");  
      }
      else{
          $("#time-left").text( i+":00");  
      }
    }
  }
  /*handleCheck(){
    setInterval(()=>{
      if($("#time-left").text() === $("#session-length").text()){
      handlePlay($("#session-length").text())
    }
    else if($("#time-left").text() === $("#break-length").text()){
      handlePlay($("#break-length").text())
    }
    }, 1000)
    
  }*/
  
  
  handlePlay(){
    
    if(this.state.condition){
      this.setState({
        condition: false
      })
      $(".in-de").hide();
      let con = false;
      let switched = "session";
      let a = $("#time-left").text()
       let c = a.match(/.$/);
        c = Number(c[0]);
      if(a !== "60:00"){
        a = a.replace(/.$/, c+1);
      }else{
        a="59:59"
      }
      
 
    console.log(a);
    let counter = new Date(`Jan 5, 2024 00:${a}`).getTime()+ new Date().getTime();
    //console.log(counter);
    
    this.props.addNewInterval(setInterval( function(){
      let now = new Date().getTime()
      let diff = counter - now;
      //console.log(diff);
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if(minutes<10){
        minutes = "0" + minutes
      }
      if(seconds < 10){
        seconds = "0" + seconds
      }
      
      if(con){
        
        $("#time-left").text(`${a}:00`);
        con = false;
        counter = new Date(`Jan 5, 2024 00:${a}:00`).getTime()+ new Date().getTime();
      }else{
        $("#time-left").text(`${minutes}:${seconds}`);
      }
      
      //this.props.addNewInterval(x);
      if(minutes === "00" && seconds === "00") {
        //$("#time-left").text("00:00");
        document.getElementById("beep").play();
        //$("#time-left").text("0" + a +":00");
    //clearInterval(this.props.interval);
        if(switched === "session"){
          a = $("#break-length").text();
          if (a < 10){
            a = "0" + a
          }
        counter = new Date(`Jan 5, 2024 00:${a}:00`).getTime()+ new Date().getTime();
          $("#time-left").css("color", "red")
          $("#timer-label").text("Break")
          switched = "break"
          con = true;
        }
         else if(switched === "break"){
           a = $("#session-length").text();
            if (a < 10){
            a = "0" + a
          }
           //$("#time-left").text("00:00");
        counter = new Date(`Jan 5, 2024 00:${a}:00`).getTime()+ new Date().getTime();
           $("#time-left").css("color", "black")
           $("#timer-label").text("Session")
           switched = "session"
           con = true
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
      $(".in-de").show();
    }
    
    }
  
  handlePause(){
    console.log(this.props.interval);
    clearInterval(this.props.interval);
    //this.props.setTime($("#time-left").text());
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
    $(".in-de").show();
    this.setState({
        condition: true
      })
  }
  
  render(){
    return(
      <div>
        <div id="box1">
          <h1>25 + 5 Clock</h1>
          <div id="break-label">
            <p>Break Length</p>
            <button className="in-de" onClick={this.handleDecreaseChange}><FaArrowDown className="icon" id="break-decrement"></FaArrowDown></button>
            <span id="break-length">5</span>
            <button className="in-de" onClick={this.handleIncreaseChange}><FaArrowUp className="icon" id="break-increment"></FaArrowUp></button>
            </div>
          <div id="session-label">
            <p>Session Length</p>
            <button className="in-de" onClick={this.handleDecreaseChange}><FaArrowDown className="icon" id="session-decrement"></FaArrowDown></button>
            <span id="session-length">25</span>
            <button className="in-de" onClick={this.handleIncreaseChange}><FaArrowUp className="icon" id="session-increment"></FaArrowUp></button> 
          </div>
          <div id="timer">
            <div id="timer-label">Session</div>
            <div id="time-left">25:00</div>
          </div>
          <div>
            <button id="start_stop"  onClick={this.handlePlay}>
              <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
              <FaPlay className="icon"></FaPlay></button>
            {/*<button onClick={this.handlePause}><i class="fa fa-pause fa-2x"></i></button>*/}
            <button id="reset" onClick={this.handleReset}><FaRedo className="icon"></FaRedo></button>
          </div>
        </div>
      </div>
    )
  }
}
//React-Redux
//const connect= ReactRedux.connect;
//const Provider = ReactRedux.Provider;

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