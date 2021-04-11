import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

import * as classes from "./EditOrder.module.css";
// import Spinner from '../../../components/UI/Spinner/Spinner';

class EditOrder extends Component {

  render () {
    
    return (
      <div className={classes.EditOrder}>
        <h1>Edit Order Page</h1>
        <h2>Price: {this.props.price}</h2>
        <button onClick={() => this.props.edit()}>Back to Orders</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditOrder, axios));