import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" clicked={props.clicked} exact>Burger Builder</NavigationItem>
    {props.isAuthenticated 
      ? <NavigationItem link="/orders" clicked={props.clicked}>Orders</NavigationItem>
      : null}
    {!props.isAuthenticated 
      ? <NavigationItem link="/sign-up" clicked={props.clicked}>Sign Up</NavigationItem>
      : null}
    { props.isAuthenticated
      ? <NavigationItem link="/logout" clicked={props.clicked}>Log Out</NavigationItem>
      : <NavigationItem link="/login" clicked={props.clicked}>Log In</NavigationItem> }
  </ul>
);

export default navigationItems;