import { ADD_TO_CART, REMOVE_FROM_CART } from "../types";
import * as Sentry from "@sentry/react";

export const addToCart = (product) => (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();
  let alreadyExists = false;
   
  Sentry.addBreadcrumb({
    category: 'cart',
    message: 'User clicked on Add to Cart and added'+  product.title + 'item to the cart',
    level: Sentry.Severity.Info,
  });

  Sentry.configureScope(scope => {
    scope.setExtra('cart', JSON.stringify(product));
    
  });
  
  cartItems.forEach((x) => {
    if (x._id === product._id) {
      alreadyExists = true;
      x.count++;
    }
  });
  if (!alreadyExists) {
    cartItems.push({ ...product, count: 1 });
  
  }
  dispatch({
    type: ADD_TO_CART,
    payload: { cartItems },
  });
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  throw new Error("Error generate in add to cart");
};

export const removeFromCart = (product) => (dispatch, getState) => {
  const cartItems = getState()
    .cart.cartItems.slice()
    .filter((x) => x._id !== product._id);
  dispatch({ type: REMOVE_FROM_CART, payload: { cartItems } });
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Sentry.addBreadcrumb({
  //   category: 'cart',
  //   message: 'User clicked on remove from  Cart',
  //   level: 'info'
  // });

  Sentry.configureScope(scope => {
    scope.setExtra('cart', JSON.stringify(product));
  });

  Sentry.withScope(function(scope) {
    scope.setLevel("info");
    Sentry.captureException("info");
    Sentry.addBreadcrumb({
      category: 'cart',
      message: 'User clicked on remove from  Cart',
      level: 'info'
    });
  });
  throw new Error("Error in  remove card");
};
