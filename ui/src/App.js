import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          hits: "",
        };
      }
    componentDidMount() {
    fetch("http://127.0.0.1:5000/")
      .then(response => response.json())
      .then(data => {
          console.log("data",data);
          this.setState({ hits: data.data })
      });
  }
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
              {"+++++++++++"+this.state.hits}
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

}

export default App;
