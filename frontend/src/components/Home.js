import React, { Component } from 'react';

import WizardFormFirstPage from './steps/WizardFormFirstPage';
import WizardFormSecondPage from './steps/WizardFormSecondPage';
import WizardFormThirdPage from './steps/WizardFormThirdPage';


export class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    const accessToken = window.localStorage.getItem('accessToken');
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 })
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 })
  }

  onSubmit() {

  }

  render() {
    const {page} = this.state;
    return (
      <div>
        {page === 1 && 
          <WizardFormFirstPage 
            onSubmit={this.nextPage} 
          />}
        {page === 2 && (
          <WizardFormSecondPage
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />
        )}
        {page === 3 && (
          <WizardFormThirdPage
            previousPage={this.previousPage}
            onSubmit={this.onSubmit}
          />
        )}
      </div>
    );
  }
}
