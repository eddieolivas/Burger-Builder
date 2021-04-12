import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

import * as classes from "./EditOrder.module.css";
// import Spinner from '../../../components/UI/Spinner/Spinner';

class EditOrder extends Component {

  render () {
    let ingredients = [];

    for (let ingredientName in this.props.ingredients) {
      ingredients.push(
        {
          name: ingredientName,
          amount: this.props.ingredients[ingredientName]
        }
      );
    }

    const ingredientOutput = ingredients.map(ig => {
      return <span
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '8px 5px',
          border: '1px solid #ccc',
          padding: '5px',
          }}
        key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    let orderData = [];

    for (let dataName in this.props.orderData) {
      orderData.push(
        {
          name: dataName,
          value: this.props.orderData[dataName]
        }
      );
    }

    const orderDataOutput = orderData.map(ig => {
      return <span
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '8px 5px',
          border: '1px solid #ccc',
          padding: '5px',
          }}
        key={ig.name}>{ig.name} ({ig.value})</span>;
    });

    return (
      <div className={classes.EditOrder}>
        <h1>Edit Order</h1>
        <p><strong>Price: </strong>${Number.parseFloat(this.props.price).toFixed(2)}</p>
        <p><strong>ID: </strong>{this.props.id}</p>
        <p><strong>Ingredients: </strong>{ingredientOutput}</p>
        <p><strong>Order Data: </strong>{orderDataOutput}</p>

        <button onClick={this.props.edit}>Update Order</button>
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
    editOrder: (token, orderId) => dispatch(actions.editOrder(orderId, token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditOrder, axios));