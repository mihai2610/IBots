import React, { Component } from 'react';


export class Ticker extends Component {

    constructor(props) {
        super(props);
        const accessToken = window.localStorage.getItem('accessToken');
        this.state = {
            ticker: undefined, loading: true
        }
    }
    
    componentDidMount(){
        const tickerId = this.props.match.params.id;
        this.fetchData(tickerId);
    }

    fetchData = (tickerId) => {
        fetch(`http://localhost:5000/api/ticker/${tickerId}`, {
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
              ticker: json.data,
              loading: false
            })
          )
          .catch(() => this.props.logout());
      };

    render() {
        if(this.state.loading)
            return <p><em>Loading...</em></p>

        return (
            <div>
                {this.state.ticker.name}
            </div>
        );
    }
}
