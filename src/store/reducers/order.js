import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
  editing: false,
  editOrderId: null
};

const purchaseInit = (state, action) => {
  return updateObject(state, { purchased: false });
};

const purchaseBurgerStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = {
    ...action.orderData,
    id: action.orderId
  };
  return updateObject(state, {
    loading: false,
    purchased: true,
    orders: state.orders.concat(newOrder),
    //ingredients: state.burgerBuilder.ingredients
  });
};

const purchaseBurgerFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchOrdersStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchOrderSuccess = (state, action) => {
  return updateObject(state, { 
    orders: action.orders,
    loading: false
  });
};

const fetchOrdersFailed = (state, action) => {
  return updateObject(state, { loading: false });
};

const deleteOrderStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const deleteOrdersuccess = (state, action) => {
  const orderId = action.orderId;

  return updateObject(state, {
    orders: state.orders.filter(order => order.id !== orderId),
    loading: false
  });
};

const deleteOrderFailed = (state, action) => {
  return updateObject(state, { loading: false });
};

const viewOrderInit = (state, action) => {
  return updateObject(state, {
    editing: true,
    editOrderId: action.orderId
  });
};

const updateOrderStart = (state, action) => {
  return updateObject(state, {
    loading: true
  });
}

const updateOrderSuccess = (state, action) => {
  let updatedOrders = [...state.orders];

  for (let i in updatedOrders) {
    if (updatedOrders[i].id === action.orderId) {
      updatedOrders[i].price = action.data.price;
      updatedOrders[i].ingredients = action.data.ingredients;
      updatedOrders[i].orderData = action.data.orderData;
      break;
    }
  }

  return updateObject(state, {
    editing: false,
    editOrderId: null,
    loading: false
  });
};

const updateOrderFailed = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT: return purchaseInit(state, action);      
    case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerStart(state, action);      
    case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess(state, action);    
    case actionTypes.PURCHASE_BURGER_FAIL: return purchaseBurgerFail(state, action);      
    case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action);      
    case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrderSuccess(state, action);
    case actionTypes.FETCH_ORDERS_FAILED: return fetchOrdersFailed(state, action);
    case actionTypes.DELETE_ORDER_START: return deleteOrderStart(state, action);
    case actionTypes.DELETE_ORDER_SUCCESS: return deleteOrdersuccess(state, action);
    case actionTypes.DELETE_ORDER_FAILED: return deleteOrderFailed(state, action);
    case actionTypes.VIEW_ORDER_INIT: return viewOrderInit(state, action);
    case actionTypes.UPDATE_ORDER_START: return updateOrderStart(state, action);
    case actionTypes.UPDATE_ORDER_SUCCESS: return updateOrderSuccess(state, action);
    case actionTypes.UPDATE_ORDER_FAILED: return updateOrderFailed(state, action);
    default:
      return state;
  }
};

export default reducer;