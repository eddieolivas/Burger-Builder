import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import EditOrder from '../Orders/EditOrder/EditOrder';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  editOrderHandler = (orderId) => {
    this.setState({
      editing: !this.state.editing,
      editingId: orderId
    });
    return orderId;
  }

  showOrderId = (orderId) => {
    return orderId;
  }
 
  render () {
    let orders = <Spinner />;

    if (!this.props.loading) {
      if (this.props.editing) {
        let order = this.props.orders.find(order => order.id === this.props.editOrderId); 
        orders = <EditOrder 
          id={order.id}
          edit={() => this.props.updateOrder(this.props.token, this.props.editOrderId)}
          ingredients={order.ingredients}
          price={order.price}
          orderData={order.orderData} />;
      } else {
        orders = this.props.orders.map( order => (
          <Order 
              key={order.id}
              ingredients={order.ingredients}
              price={order.price}
              id={order.id}
              edit={() => this.props.editOrder(this.props.token, order.id)} />
        ) );
      }
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
    editOrder: (token, orderId) => dispatch(actions.editOrder(token, orderId)),
    updateOrder: (token, orderId) => dispatch(actions.updateOrder(token, orderId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));