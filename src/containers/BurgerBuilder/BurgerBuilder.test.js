import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/Burger/OrderSummary/OrderSummary';
import orderSummary from '../../components/Burger/OrderSummary/OrderSummary';

configure({adapter: new Adapter()});

describe('<BurgerBuilder />', () => {
  let wrapper;

  beforeEach((() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>);
    wrapper.setProps({ings: {salad: 0}});
  }));

  it('should render <BuildControls /> when receiving ingredients', () => {
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });

  it('should render <OrderSummary /> when receiving ingredients', () => {
    expect(wrapper.find(orderSummary)).toHaveLength(1);
  });


});