import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';
import Input from '../../../components/UI/Input/Input';

import * as classes from "./EditOrder.module.css";
// import Spinner from '../../../components/UI/Spinner/Spinner';

class EditOrder extends Component {
  state = {
    orderDataForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: this.props.orderData.name,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street Address'
        },
        value: this.props.orderData.street,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Postal Code'
        },
        value: this.props.orderData.zipCode,
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: this.props.orderData.country,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-mail'
        },
        value: this.props.orderData.email,
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: this.props.orderData.deliveryMethod,
        validation: {},
        valid: true
      },
      bacon: {
        elementType: 'number',
        value: this.props.ingredients['bacon']
      }
    },
    formIsValid: false
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(this.state.orderDataForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, this.state.orderDataForm[inputIdentifier].validation),
      touched: true
    });
    const updatedOrderForm = updateObject(this.state.orderDataForm, {
      [inputIdentifier]: updatedFormElement
    });
    
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({orderDataForm: updatedOrderForm, formIsValid: formIsValid});
  }

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

    const orderDataElements = [];
    for (let key in this.state.orderDataForm) {
      orderDataElements.push({
        id: key,
        config: this.state.orderDataForm[key]
      })
    };

    const orderDataOutput = orderDataElements.map(data => {
      return (
          <Input
            key={data.id}
            elementType={data.config.elementType} 
            elementConfig={data.config.elementConfig}
            value={data.config.value}
            invalid={!data.config.valid}
            shouldValidate={data.config.validation}
            touched={data.config.touched}
            changed={(event) => this.inputChangedHandler(event, data.id)} />
      );
    });

    return (
      <div className={classes.EditOrder}>
        <h1>Edit Order</h1>
        <p><strong>Price: </strong>${Number.parseFloat(this.props.price).toFixed(2)}</p>
        <p><strong>Ingredients: </strong>{ingredientOutput}</p>
        <p><strong>Order Data: </strong></p>
        {orderDataOutput}
        <p style={{'text-align': 'right'}}><button>Cancel</button> <button onClick={this.props.edit}>Update Order</button></p>
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