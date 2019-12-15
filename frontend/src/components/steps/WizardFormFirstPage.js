import React from 'react';

const WizardFormFirstPage = props => {
    return (

        <div class="container">
<div class="row">

<div className="card col-sm-4" >
  <img className="card-img-top"      src="https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Card image cap"></img>
  <div className="card-body">
    <h5 className="card-title">Trade Stocks</h5>
    <p className="card-text">Buy and sell stock with low commission fee.</p>
    <br></br>
    <a href="/fetch-data" className="btn btn-primary">View trading console</a>
  </div>
</div>

<div className="card col-sm-4" >
  <img className="card-img-top" src="https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Card image cap"></img>
  <div className="card-body">
    <h5 className="card-title">Stock Overview</h5>
    <p className="card-text">Receive personalized stock recommendations based on your preferences.</p>
    <a href="#" className="btn btn-primary">View stock performance  </a>
  </div>
</div>

<div className="card col-sm-4">
  <img className="card-img-top" src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?cs=srgb&dl=aparat-electronice-fotografie-de-la-inal-ime-futurist-2599244.jpg&fm=jpg" alt="Card image cap"></img>
  <div className="card-body">
    <h5 className="card-title">Trading Signal Bots</h5>
    <p className="card-text">Receive trading signals from third-party trading bots for robotic trading. </p>
    <br></br>
    <a href="#" className="btn btn-primary">Browse Bot Marketplace</a>
  </div>
</div>
</div>
        </div>
    )
}

export default (WizardFormFirstPage);