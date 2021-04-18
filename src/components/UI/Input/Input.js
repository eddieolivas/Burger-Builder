import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }
  
  switch (props.elementType) {
    case ('input'):
      inputElement = <input 
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        patter={props.pattern}
        onChange={props.changed}/>;
      break;
    case ('textarea'):
      inputElement = <textarea 
        className={classes.InputElement}
        {...props.elementConfig} 
        value={props.value}
        onChange={props.changed}/>;
      break;
    case ('select'):
      inputElement = (
        <select
          className={classes.InputElement}
          value={props.value}
          onChange={props.changed}>
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    case ('number'): 
      inputElement = <input 
        className={classes.InputElement}
        {...props.elementConfig}
        pattern={props.pattern}
        value={props.value}
        onChange={props.changed}
        min={"0"}
        inputMode="numeric" />;
      break;
    default:
      inputElement = <input 
        className={classes.InputElement}
        {...props.elementConfig}
        pattern={props.pattern}
        value={props.value}
        onChange={props.changed} />;
  }

  let validationError = null;
  if (props.invalid && props.touched) {
    if (props.elementConfig.type === 'password') {
      validationError = <p>Password must be at least 6 characters.</p>;
    } else {
      validationError = <p>Please enter a valid value.</p>;
    }
  }
  
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );  
}

export default input;