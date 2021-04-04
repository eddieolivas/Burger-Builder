import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import classes from './Order.module.css';

class Order extends Component {

  render () {
    const ingredients = [];

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
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px'
          }}
        key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>Price: <strong>${Number.parseFloat(this.props.price).toFixed(2)}</strong></p>
      <button onClick={() => this.props.deleteOrder(this.props.id, this.props.token)}>Delete</button>
    </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteOrder: (orderId, token) => dispatch(actions.deleteOrder(orderId, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order);