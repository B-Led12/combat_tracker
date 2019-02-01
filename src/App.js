import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      fighters: [],
      add: "0",
      track: "start",
      selectedChar: {},
      clicked: {},
      round: 1
    }
  }

  componentWillMount(){
    localStorage.getItem('fighters') && this.setState({
      fighters: JSON.parse(localStorage.getItem('fighters'))
    });
  }

  componentDidUpdate(prevProps, prevState){
    localStorage.setItem('fighters', JSON.stringify(this.state.fighters));
    if(prevState.clicked !== this.state.clicked && this.state.add !== "2"){
      this.setState({
        add: "2"
      });
    }
  }

  renderAdder = () => {
    if(this.state.add === "1"){
      return(
        <div id="adder">
         <button id="cancel" onClick={() => this.cancel()}>X</button>
          <table id="atable">
            <tr>
              <td>Name: </td><td><input type="text" id="aname"/></td>
            </tr>
            <tr>
              <td>Initiative: </td><td><input type="text" id="ainitiative"/></td>
            </tr>
            <tr>
              <td>Type: </td><td><select id="atype" onChange={() => this.setValue("atype")}>
                <option value=""></option>
                <option value="player">Player</option>
                <option value="enemy">Enemy</option>
                <option value="ally">Ally</option>
                <option value="boss">Boss</option>
              </select></td>
            </tr>
            <tr>
              <button id="add" onClick={() => this.add()}>Add</button>
            </tr>
          </table>
          {this.acHP()}
        </div>
      );
    }
    else{
      return;
    }
  }

  setValue = (id) => {
    if(document.getElementById(id).value === "player"){
      this.setState({select: "player"});
    }
    else if(document.getElementById(id).value === "enemy" || document.getElementById(id).value === "boss" || document.getElementById(id).value === "ally"){
      this.setState({select: "npc"});
    }
    else{
      this.setState({select: null});
    }
  }

  acHP = () => {
    if(this.state.select === "npc"){
      return(
        <table id="npc">
          <tr>
            <td>AC: </td><td><input type="text" id="aac"/></td>
          </tr>
          <tr>
            <td>HP: </td><td><input type="text" id="ahp"/></td>
          </tr>
        </table>
      );
    }
  }

  add = () => {
    if(this.state.select === "npc"){
      if(document.getElementById("aname").value === "" ||
        document.getElementById("ainitiative").value === "" ||
        document.getElementById("aac").value === "" ||
        document.getElementById("ahp").value === "" ||
        document.getElementById("atype").value === ""){
          window.confirm("All fields must have a value");
        }

      else if(isNaN(parseInt(document.getElementById("ainitiative").value)) ||
              isNaN(parseInt(document.getElementById("aac").value)) ||
              isNaN(parseInt(document.getElementById("ahp").value))){
                window.confirm("Invalid input");
              }
      
      else{
        this.setState({
          fighters: [...this.state.fighters,
          {name: document.getElementById("aname").value,
          initiative: parseInt(document.getElementById("ainitiative").value),
          ac: parseInt(document.getElementById("aac").value),
          maxHP: parseInt(document.getElementById("ahp").value),
          hp: parseInt(document.getElementById("ahp").value),
          type: document.getElementById("atype").value}
        ].sort(function(a,b){return(b.initiative - a.initiative);
        }),
          add: "0",
          select: null
        });
      }
    }

    else if(this.state.select === "player"){
      if(document.getElementById("aname").value === "" ||
          document.getElementById("ainitiative").value === "" ||
          document.getElementById("atype").value === ""){
            window.confirm("All fields must have a value");
          }

        else if(isNaN(parseInt(document.getElementById("ainitiative").value))){
                  window.confirm("Invalid input");
                }
        
        else{
          this.setState({
            fighters: [...this.state.fighters,
            {name: document.getElementById("aname").value,
            initiative: parseInt(document.getElementById("ainitiative").value),
            type: document.getElementById("atype").value}
          ].sort(function(a,b){return(b.initiative - a.initiative);
          }),
            add: "0"
          });
        }
      }
    }

  renderButton = () => {
    if(this.state.track === "start"){
      return(
        <button id="start" onClick={() => {this.start()}}>Start</button>
      );
    }

    else{
      return(
        <div id="nextEnd">
          <button id="next" onClick={() => {this.next()}}>Next</button>
          <button id="end" onClick={() => this.setState({track: "start", selectedChar: {}, round: 1})}>End</button>
        </div>
      )
    }
  }

  start = () => {
    if(this.state.fighters.length > 0){
    this.setState({
      track: "next",
      selectedChar: this.state.fighters[0]
    });
  }
    else{
      return;
    }
  }

  next = () => {
    if((this.state.fighters.indexOf(this.state.selectedChar)) < (this.state.fighters.length) - 1){
      var i = (this.state.fighters.indexOf(this.state.selectedChar)) + 1;
      var round = this.state.round;
    }
    else{
      i = 0;
      round = this.state.round + 1;
    }
    this.setState({
      selectedChar: this.state.fighters[i],
      round: round
    });
  }

  remove = (key) => {
    this.setState({
      fighters: this.state.fighters.filter(fighter => this.state.fighters.indexOf(fighter) !== key)
    });
  }

  renderEdit = () => {
    if(this.state.add === "2"){
      return(
        <div id="editor">
        <button id="cancel" onClick={() => this.cancel()}>X</button>
          <table id="etable">
            <tr>
              <td>Name: </td><td><input type="text" id="ename" defaultValue={this.state.clicked.name}/></td>
            </tr>
            <tr>
              <td>Initiative: </td><td><input type="text" id="einitiative" defaultValue={this.state.clicked.initiative}/></td>
            </tr>
            <tr>
              <td>Type: </td><td><select id="etype" defaultValue={this.state.clicked.type}  onChange={() => this.setValue("etype")}>
                <option value=""></option>
                <option value="player">Player</option>
                <option value="enemy">Enemy</option>
                <option value="ally">Ally</option>
                <option value="boss">Boss</option>
              </select></td>
            </tr>
            <tr>
              <button id="edit" onClick={() => this.edit()}>Edit</button>
            </tr>
          </table>
          {this.eacHP()}
        </div>
      );
    }
  }

  eacHP = () => {
    if((this.state.select !== "player" && this.state.clicked.type !== "player") || (this.state.select === "npc" && this.state.clicked.type === "player")){
      return(
        <div id="npc">
          <table id="a">
            <tr>
              <td>AC: </td><td><input type="text" id="eac" defaultValue={this.state.clicked.ac}/></td>
            </tr>
            <tr>
              <td>HP: </td><td><input type="text" id="ehp" defaultValue={this.state.clicked.maxHP}/></td>
            </tr>
          </table>
          <table id="b">
            <tr>
              <td colSpan="2" id="hd"><input type="text" id="dmg"/></td>
            </tr>
            <tr>
              <td id="h"><button id="heal" onClick={() => this.hitpoints("heal")}>Heal</button></td><td><button id="damage" onClick={() => this.hitpoints("damage")}>Damage</button></td>
            </tr>
          </table>
        </div>
      );
    }
  }

  edit = () => {
    var fighter = this.state.clicked;
    if(fighter.type !== "player"){
    this.state.fighters.splice(this.state.fighters.indexOf(fighter), 1, {name: document.getElementById("ename").value,
                                                                        initiative: parseInt(document.getElementById("einitiative").value),
                                                                        ac: parseInt(document.getElementById("eac").value),
                                                                        maxHP: parseInt(document.getElementById("ehp").value),
                                                                        hp: parseInt(document.getElementById("ehp").value),
                                                                        type: document.getElementById("etype").value});
    }
    else{
      this.state.fighters.splice(this.state.fighters.indexOf(fighter), 1, {name: document.getElementById("ename").value,
                                                                        initiative: parseInt(document.getElementById("einitiative").value),
                                                                        type: document.getElementById("etype").value});
    }
    var spliced = this.state.fighters;                                                    
    this.setState({
      fighters: spliced.sort(function(a,b){return(b.initiative - a.initiative)}),
      add: "0",
    });
  }

  hitpoints = (id) => {
    if(isNaN(parseInt(document.getElementById("dmg").value))){
      return;
    }
    var fighter = this.state.clicked;
    var i = this.state.fighters.indexOf(fighter);
    if(id === "heal"){
      var total = parseInt(this.state.clicked.hp) + parseInt(document.getElementById("dmg").value);
      if(total > fighter.maxHP){
        total = fighter.maxHP;
      }
    }
    else if(id === "damage"){
      total = parseInt(this.state.clicked.hp) - parseInt(document.getElementById("dmg").value);
      if(total < 0){
        total = 0;
      }
    }
    this.state.fighters.splice(this.state.fighters.indexOf(fighter), 1, {name: document.getElementById("ename").value,
                                                                        initiative: parseInt(document.getElementById("einitiative").value),
                                                                        ac: parseInt(document.getElementById("eac").value),
                                                                        maxHP: parseInt(document.getElementById("ehp").value),
                                                                        hp: parseInt(total),
                                                                        type: document.getElementById("etype").value});
    var spliced = this.state.fighters;
    this.setState({
      fighters: spliced,
      clicked: this.state.fighters[i]
    });
  }

  cancel = () => {
    this.setState({
      add: "0",
      clicked: "",
      select: null
    });
  }

  renderRound = () => {
    if(this.state.track === "next"){
      return(
        <div id="round">
          Round: {this.state.round}
        </div>
      );
    }
  }

  renderACHP = (fighter) => {
    if(fighter.type !== "player"){
      return(
      <div id="acHP">
        <b>AC: {fighter.ac}</b><br/>
        <b>HP: {fighter.hp}</b>
      </div>
      );
    }
  }

  setColor = () => {
    if(this.state.selectedChar.type === "player"){
      document.getElementById("current").style.color = "blue";
    }
    else if(this.state.selectedChar.type === "enemy"){
      document.getElementById("current").style.color = "red";
    }
    else if(this.state.selectedChar.type === "ally"){
      document.getElementById("current").style.color = "lightgray";
    }
    else if(this.state.selectedChar.type === "boss"){
      document.getElementById("current").style.color = "gold";
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderAdder()}
        {this.renderEdit()}
        {this.renderButton()}
        {this.renderRound()}
          <div id="current">
            {this.state.selectedChar.name}
            {this.setColor()}
          </div>
          <div id="list">
            <button id="new" onClick={() => this.setState({add: "1"})}>New</button>
            <button id="clear" onClick={() => this.setState({fighters: [], selectedChar: {}, track: "start", add: "0", round: 1})}>Clear</button>
            {this.state.fighters.map((fighter, i) => 
            <div id="fighter" key={i}>
              <button className="nameInit" id={fighter.type} onClick={() => this.setState({clicked: fighter, add: "0"})}>
                <b id="n">{fighter.name}</b><br/>
                <b id="init">{fighter.initiative}</b>
              </button>
              <button id="remove" onClick={() => this.remove(i)}>X</button>
              {this.renderACHP(fighter)}
            </div>)}
          </div>
      </div>
    );
  }
}

export default App;
