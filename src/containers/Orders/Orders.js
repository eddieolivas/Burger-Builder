import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import EditOrder from '../Orders/EditOrder/EditOrder';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

  state = {
    editing: false
  }

  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  editOrderHandler = () => {
    this.setState({
      editing: !this.state.editing
    });
  }
 
  render () {
    let orders = <Spinner />;
    if (!this.props.loading) {
      if (this.state.editing) {
        orders = <EditOrder edit={this.editOrderHandler} />;
      } else {
        orders = this.props.orders.map( order => (
          <Order 
              key={order.id}
              ingredients={order.ingredients}
              price={order.price}
              id={order.id}
              edit={this.editOrderHandler} />
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
    editing: false
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));