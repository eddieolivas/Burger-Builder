import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  viewOrderHandler = (orderId) => {
    const order = this.props.orders.find(order => order.id === orderId);
    this.props.viewOrder(orderId, order);
    this.props.history.push('/orders/edit/' + orderId);
  }
 
  render () {
    let orders = <Spinner />;

    if (!this.props.loading) {
      orders = this.props.orders.map( order => (
        <Order 
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}
            id={order.id}
            edit={() => this.viewOrderHandler(order.id)} />
      ) );
    }
    return (
      <div>
        {orders}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
    editing: state.order.editing,
    editOrderId: state.order.editOrderId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId)),
    viewOrder: (orderId, order) => dispatch(actions.viewOrderInit(orderId, order)),
    updateOrder: (token, orderId) => dispatch(actions.updateOrder(token, orderId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));