import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import Auth from './containers/Auth/Auth';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

// const asyncAuth = asyncComponent(() => {
//   return import('./containers/Auth/Auth');
// });

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncThankYou = asyncComponent(() => {
  return import('./components/ThankYou/ThankYou');
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" signin={true} render={props => (<Auth signin={true} />)} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" signin={true} render={props => (<Auth {...props} />)} />
          <Route path="/thank-you" component={asyncThankYou} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : state.auth.token; 
  return {
    isAuthenticated: token !== null
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
