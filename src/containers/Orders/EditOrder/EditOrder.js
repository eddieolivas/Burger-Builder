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

  componentDidMount() {
    this.props.onInitIngredients();
  }
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
    const updatedIngElement = updateObject(this.state.ingredientForm[inputIdentifier], {
      value: event.target.value
    });
    const updatedIngForm = updateObject(this.state.ingredientForm, {
      [inputIdentifier]: updatedIngElement
    });
    this.props.onIngredientAdded(inputIdentifier);
    // this.setState({ingredientForm: updatedIngForm});
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
        <div key={'div-' + data.id}>
          <label key={'label-' + data.id} className={classes.ingLabel}>{data.id}</label> <Input
            key={data.id}
            elementType={data.config.elementType} 
            elementConfig={data.config.elementConfig}
            value={data.config.value}
            invalid={!data.config.valid}
            shouldValidate={data.config.validation}
            touched={data.config.touched}
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
        <p><strong>Customer Data: </strong></p>
        {orderDataOutput}
        <p><strong>Ingredients: </strong></p>
        {ingredientOutput}
        <p><strong>Price: </strong>${Number.parseFloat(this.props.price).toFixed(2)}</p>
        <p><button onClick={this.props.edit}>Cancel</button> <button>Update Order</button></p>
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
    editOrder: (token, orderId) => dispatch(actions.editOrder(orderId, token)),
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditOrder, axios));