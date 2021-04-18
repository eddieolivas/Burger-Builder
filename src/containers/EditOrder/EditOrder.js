import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';

import * as classes from "./EditOrder.module.css";
import Spinner from '../../components/UI/Spinner/Spinner';

class EditOrder extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
    if (!this.props.order) {
      this.props.onFetchOrders(this.props.token, this.props.userId);
    }
  }

  state = {
    orderDataForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: this.props.order.orderData.name,
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
        value: this.props.order.orderData.street,
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
        value: this.props.order.orderData.zipCode,
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
        value: this.props.order.orderData.country,
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
        value: this.props.order.orderData.email,
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
          ],
          placeholder: 'Delivery Method'
        },
        value: this.props.order.orderData.deliveryMethod,
        validation: {},
        valid: true
      }
    },
    ingredientForm: {
      bacon: {
        elementType: 'number',
        value: this.props.ingredients['bacon'],
        elementConfig: {
          type: 'number',
          placeholder: ''
        }
      },
      salad: {
        elementType: 'number',
        value: this.props.ingredients['salad'],
        elementConfig: {
          type: 'number',
          placeholder: ''
        }
      },
      cheese: {
        elementType: 'number',
        value: this.props.ingredients['cheese'],
        elementConfig: {
          type: 'number',
          placeholder: ''
        }
      },
      meat: {
        elementType: 'number',
        value: this.props.ingredients['meat'],
        elementConfig: {
          type: 'number',
          placeholder: ''
        }
      },
    },
    formIsValid: false,
    totalPrice: Number.parseFloat(this.props.price).toFixed(2)
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

  ingredientChangedHandler = (event, inputIdentifier) => {
    const INGREDIENT_PRICES = {
      salad: 0.5,
      cheese: 0.4,
      meat: 1.3,
      bacon: 0.7
    };
  
    const updatedIngElement = updateObject(this.state.ingredientForm[inputIdentifier], {
      value: parseInt(event.target.value, 10) || null
    });
    const updatedIngForm = updateObject(this.state.ingredientForm, {
      [inputIdentifier]: updatedIngElement
    });

    const currentValue = this.state.totalPrice - (this.state.ingredientForm[inputIdentifier].value * INGREDIENT_PRICES[inputIdentifier]);
    const newValue = event.target.value * INGREDIENT_PRICES[inputIdentifier];
    const newPrice = Number.parseFloat(currentValue + newValue).toFixed(2);

    
    this.setState({ingredientForm: updatedIngForm, totalPrice: newPrice});
  }

  updateOrderHandler = (ingredients, orderData, price) => {
    let updatedOrderData = {};
    let updatedIngredients = {};

    Object.keys(ingredients).map((key, index) => {
      updatedIngredients[key] = ingredients[key].value;
      return true;
    });

    Object.keys(orderData).map((key, index) => {
      updatedOrderData[key] = orderData[key].value;
      return true;
    });

    const data = {
      ingredients: updatedIngredients,
      orderData: updatedOrderData,
      price
    };

    this.props.updateOrder(this.props.order.id, this.props.token, data);
    this.props.history.replace('/orders');
  }

  render () {
    let ingredients = [];

    for (let ingredientName in this.state.ingredientForm) {
      ingredients.push(
        {
          name: ingredientName,
          amount: this.state.ingredientForm[ingredientName]
        }
      );
    }

    const ingredientDataElements = [];
    for (let key in this.state.ingredientForm) {
      ingredientDataElements.push({
        id: key,
        config: this.state.ingredientForm[key]
      })
    };

    const ingredientOutput = ingredientDataElements.map(data => {
      return (
        <div key={'div-' + data.id} className={classes.ingredientInput}>
          <label key={'label-' + data.id} className={classes.label}>{data.id}</label> <Input
            key={data.id}
            elementType={data.config.elementType} 
            elementConfig={data.config.elementConfig}
            value={data.config.value}
            invalid={!data.config.valid}
            shouldValidate={data.config.validation}
            touched={data.config.touched}
            pattern={"[0-9]*"}
            changed={(event) => this.ingredientChangedHandler(event, data.id)} />
        </div>
      );
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
        <div key={'orderdiv-' + data.id}>
          <label className={classes.label}key={'orderlabel+' + data.id}>{data.config.elementConfig.placeholder}</label>
          <Input
            key={data.id}
            elementType={data.config.elementType} 
            elementConfig={data.config.elementConfig}
            value={data.config.value}
            invalid={!data.config.valid}
            shouldValidate={data.config.validation}
            touched={data.config.touched}
            changed={(event) => this.inputChangedHandler(event, data.id)} />
        </div>
      );
    });

    let editOrder = <Spinner />;

    if (!this.props.loading) {
      editOrder = (
        <div className={classes.EditOrder}>
          <h1>Edit Order</h1>
          <p><strong>Customer Data: </strong></p>
          {orderDataOutput}
          <p><strong>Ingredients: </strong></p>
          {ingredientOutput}
          <p><strong>Price: </strong>${Number.parseFloat(this.state.totalPrice).toFixed(2)}</p>
          <p><button onClick={() => this.updateOrderHandler(this.state.ingredientForm, this.state.orderDataForm, this.state.totalPrice)}>Update Order</button> <button onClick={this.props.edit}>Cancel</button></p>
        </div>
      );
    }

    console.log('token');
    console.log(this.props.token);

    return (
      <div>
        {editOrder}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const order = state.order.orders.find(order => order.id === state.order.editOrderId);
  console.log(state);
  return {
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
    order: order,
    ingredients: order.ingredients,
    editing: state.order.editing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateOrder: (orderId, token, orderData) => dispatch(actions.updateOrder(orderId, token, orderData)),
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditOrder, axios));