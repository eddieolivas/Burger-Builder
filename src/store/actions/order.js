import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
};

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json?auth=' + token, orderData)
      .then(response => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData));
      })
      .catch(error => {
        dispatch( purchaseBurgerFail( error ) );
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  };
};

export const fetchOrdersFailed = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAILED,
    error: error
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  };
};

export const fetchOrders = (token, userId, orderId = null) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    let url = '';

    if (orderId) {
      url = `/orders/${orderId}.json?auth=${token}`;
    } else {
      url = '/orders.json?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"&orderBy="id"';
    }
  
    axios.get(url)
      .then(res => {
        let fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          });
        }
        fetchedOrders = fetchedOrders.sort((a, b) => (a.id < b.id) ? 1 : -1);
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch(err => {
        dispatch(fetchOrdersFailed(err));
      });
  };
};

export const deleteOrderFailed = (error) => {
  return {
    type: actionTypes.DELETE_ORDER_FAILED,
    error: error
  };
};

export const deleteOrderStart = () => {
  return {
    type: actionTypes.DELETE_ORDER_START
  };
};

export const deleteOrderSuccess = (orderId) => {
  return {
    type: actionTypes.DELETE_ORDER_SUCCESS,
    orderId: orderId
  };
};

export const deleteOrder = (orderId, token) => {
  return dispatch => {
    dispatch(deleteOrderStart());
    const url = '/orders/';
    axios.delete(`${url}${orderId}.json?auth=` + token)
      .then(res => {
        dispatch(deleteOrderSuccess(orderId));
      })
      .catch(err => {
        dispatch(deleteOrderFailed(err));
      });
  };
};

export const viewOrderInit = (orderId) => {
  localStorage.setItem('editOrderId', orderId);
  return {
    type: actionTypes.VIEW_ORDER_INIT,
    orderId: orderId
  };
};

export const updateOrderStart = () => {
  return {
    type: actionTypes.UPDATE_ORDER_START
  }
}

export const updateOrderSuccess = (orderId, data) => {
  return {
    type: actionTypes.UPDATE_ORDER_SUCCESS,
    orderId: orderId,
    data: data
  };
};

export const updateOrderFailed = (error) => {
  return {
    type: actionTypes.UPDATE_ORDER_FAILED
  };
};

export const updateOrder = (orderId, token, data) => {
  return dispatch => {
    dispatch(updateOrderStart());

    const url = '/orders/';
    axios.patch(`${url}${orderId}.json?auth=` + token, data)
      .then(res => {
        dispatch(updateOrderSuccess(orderId, res.data));
        localStorage.setItem('editOrderId', null);
      })
      .catch(err => {
        dispatch(updateOrderFailed(err));
      });
  }
}