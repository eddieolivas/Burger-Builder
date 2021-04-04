import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Burger from './Burger';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

configure({adapter: new Adapter()});

describe('<Burger />', () => {
  let wrapper;

  beforeEach((() => {
    const ingredients = {salad: 2};
    wrapper = shallow(<Burger ingredients={ingredients} />);
  }));

  it('should render the number of burger ingredients plus two because of the bread', () => {
    expect(wrapper.find(BurgerIngredient)).toHaveLength(4);
  });

  it('should always render the bread', () => {
    expect(wrapper.contains(<BurgerIngredient type="bread-top" />)).toEqual(true);
    expect(wrapper.contains(<BurgerIngredient type="bread-bottom" />)).toEqual(true);
  });
});