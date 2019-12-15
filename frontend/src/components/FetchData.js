import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true, selectedTicker: undefined };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://localhost:5000/api/protected', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.accessToken}`
      }
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Access denied');
        }
        return response.json();
      })
      .then(json =>
        this.setState({
          forecasts: json.data,
          loading: false
        })
      )
      .catch(() => this.props.logout());
  };

  renderForecastsTable(tickers) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map(ticker =>
            <tr key={ticker.id}>
              <td>{ticker.name}</td>
              <td>{ticker.description}</td>
              <button className="btn btn-outline-primary" onClick={() => { this.setState({selectedTicker: ticker})}}> Buy </button>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderForecastsTable(this.state.forecasts);
    if(this.state.selectedTicker) {
        return <Redirect to={'/ticker/'+this.state.selectedTicker.id}  />
    }
    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}
