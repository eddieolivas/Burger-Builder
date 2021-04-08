import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './ThankYou.module.css';
import Burger from '../Burger/Burger';
import CanvasConfetti from '../UI/CanvasConfetti/CanvsConfetti';


class ThankYou extends Component {
  render() {
    const burger = this.props.ings ? <Burger ingredients={this.props.ings} /> : null;
    return (
      <div className={classes.ThankYou}>
        <h1>Sweet! You ordered a burger!</h1>
        <p>Here it is, we hope you enjoy it. Have an awesome day. <span role="img" aria-label="smiley emoji">&#128512;</span></p>
        {burger}
        <Link to="/"><button className={classes.OrderAgainButton}>Order Another</button></Link>
        <Link to="/orders"><button className={classes.ViewOrdersButton}>View My Orders</button></Link>
        <CanvasConfetti></CanvasConfetti>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients
  }
}

export default connect(mapStateToProps)(ThankYou);