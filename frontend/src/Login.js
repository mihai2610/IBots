import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    error: undefined
  };

  handleLogin = e => {
    e.preventDefault();
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(response => {
        if (response.status !== 200) {
          this.setState({ error: "Authentication failed!" });
        }
        return response.json()
      })
      .then(json => {
        const accessToken = json.access_token;
        if (accessToken) {
          this.props.onLogin(accessToken);
        }
      })
      .catch(error => {
        this.props.onLoginError();
      });
  };

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    });
  };

  render() {
    return (
      <div className="container" style={{ width: "500px", paddingTop: "100px" }}>
        <form className="jumbotron">
          <h3>Sign In</h3>
          <p className="text-danger"> {this.state.error} </p>
          <div className="form-group">
            <label>Email address</label>

            <input type="username" className="form-control" value={this.state.username}
              onChange={this.handleUsernameChange} placeholder="username" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" onClick={this.handleLogin}>Submit</button>
          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;
