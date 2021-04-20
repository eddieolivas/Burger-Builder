import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import Auth from './containers/Auth/Auth';
import EditOrder from './containers/EditOrder/EditOrder';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

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
        <Route path="/sign-up" render={() => <Auth signup={true} />} />
        <Route path="/login" render={() => <Auth signup={false} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders/edit/:id" render={(props) => <EditOrder id={ this.props.editOrderId } {...props} />} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Route path="/login" render={() => <Auth signup={false} />} />
          <Route path="/sign-up" render={() => <Auth signup={true} />} />
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
  const editOrderId = localStorage.getItem('editOrderId') ? localStorage.getItem('editOrderId') : '';
  return {
    isAuthenticated: token !== null,
    editOrderId: editOrderId
  };
  
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
