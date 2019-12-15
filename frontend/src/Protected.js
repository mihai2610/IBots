import React from 'react';
import withAuth from './withAuth';
import { Route } from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Ticker} from './components/Ticker';

class Protected extends React.Component {
  render() {
    return (
      <Layout logout={this.props.logout}>
        <Route exact path='/' component={Home} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/ticker/:id' component={Ticker} />
        {/* <p>{JSON.stringify(this.props.claims)}</p> */}
      </Layout>
    );
  }
}

export default withAuth()(Protected);
