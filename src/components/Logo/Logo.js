import React from 'react';
import { NavLink } from 'react-router-dom';

import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const logo = (props) => (
  <div className={classes.Logo} onClick={props.clicked}>
    <NavLink to="/"><img src={burgerLogo} alt="MyBurger" /></NavLink>
  </div>
);

export default logo;