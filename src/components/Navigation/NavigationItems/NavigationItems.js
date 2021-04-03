import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" clicked={props.clicked} exact>Burger Builder</NavigationItem>
    <NavigationItem link="/orders" clicked={props.clicked}>Orders</NavigationItem>
    <NavigationItem link="/auth" clicked={props.clicked}>Authenticate</NavigationItem>
  </ul>
);

export default navigationItems;