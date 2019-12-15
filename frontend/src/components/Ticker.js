import React, { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'


export class Ticker extends Component {

    constructor(props) {
        super(props);
        const accessToken = window.localStorage.getItem('accessToken');
        this.state = {
            ticker: undefined,
            loading: true,
            sentiment: undefined,
            model: {
                quantity: 0,
                price: 0,
                timeInForce: "",
                type: "",
                side: ""
            }
        }
        this.onBuy = this.onBuy.bind(this);
    }

    componentDidMount() {
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
                    sentiment: json.sentiment,
                    loading: false
                })
            )
            .catch((e) => console.logo(e));
    };

    onSell = () => { this._fetchData("buy") }

    onBuy = () => { this._fetchData("sell")}

    _fetchData = (option) => {
        const tickerId = this.props.match.params.id;
        const model = this.state.model
        model.side = option
        fetch(`http://localhost:5000/api/ticker/${tickerId}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${window.localStorage.accessToken}`
          }, 
          body: model
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
          .catch((e) => console.logo(e));
      };

    render() {
        if (this.state.loading)
            return <p><em>Loading...</em></p>
        const ticker = this.state.ticker;
        const options = [
            "day", "gtc", "opg", "cls", "ioc", "fok"
        ]
        const defaultOption = options[0];
        const types = [
            "Limit", "Market", "Stop", "StopLimit"
        ]
        const defaultTypes = types[0];


        return (
            <div className="jumbotron" >
                <div className="row">
                    <div className="col">
                        <h3>Ticker</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <table className='table table-striped' aria-labelledby="tabelLabel">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={ticker.id}>
                                    <td>{ticker.name}</td>
                                    <td>{ticker.description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-sm-4">
                        <form className="jumbotron">
                            
                            <div className="form-group">
                                <label for="exampleInputEmail1">Price</label>
                                <input type="number" className="form-control" id="exampleInputEmail1" onChange={event => this.setState({model:{...this.state.model, price: event.target.value}})} placeholder="Enter price" />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Quantity</label>
                                <input type="number" className="form-control" id="exampleInputEmail1" onChange={event => this.setState({model:{...this.state.model, quantity: event.target.value}})} placeholder="Enter quantity" />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Time in Force</label>
                                <Dropdown options={options} onChange={event => this.setState({model:{...this.state.model, timeInForce: event.value}})} value={defaultOption} placeholder="Select an option" />
                            </div>

                            <div className="form-group">
                                <label for="exampleInputEmail1">Type</label>
                                <Dropdown options={types} onChange={event => this.setState({model:{...this.state.model, type: event.value}})} value={defaultTypes} placeholder="Select an option" />
                            </div>

                            <button class="btn btn-warning" type="button" onClick={this.onBuy} >
                                Buy
                            </button>
                            <button class="btn btn-danger" type="button"  onClick={this.onSell} >
                                Sell
                            </button>
                        </form>
                    </div>
                    <div className="col-sm-4">
                        <ReactSpeedometer
                            value={parseInt(this.state.sentiment.negative * -1) + parseInt(this.state.sentiment.stronglynegative * -2) + parseInt(this.state.sentiment.positive) + parseInt(this.state.sentiment.stronglypositive * 2)}
                            minValue={-300}
                            maxValue={1000}
                            segments={10}
                        />
                    </div>
                </div>
                {/* {this.state.ticker.name}
                {console.log(this.state.sentiment)}
                {this.state.sentiment.negative * -1 + this.state.sentiment.stronglynegative * -2 + this.state.sentiment.positive + this.state.sentiment.stronglypositive * 2} */}

            </div >
        );
    }
}
