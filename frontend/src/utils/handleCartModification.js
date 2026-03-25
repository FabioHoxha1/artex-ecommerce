import { store } from "../store";
import { setCart } from "../features/wishlistAndCartSlice";
import { toast } from "react-toastify";

export const handleCartModification = (_id, dispatch, productQuantity, isObjInCart) => {
  const { allProductsData } = store.getState().productsData;
  const { cart } = store.getState().wishlistAndCartSection;

  console.log("[v0] handleCartModification called with:", { _id, productQuantity, isObjInCart })

  let newCart;
  switch (isObjInCart) {
    case true:
      if (!productQuantity || productQuantity === null) {
        const filteredCart = cart.filter((productsData) => productsData._id !== _id);
        newCart = [...filteredCart];
        toast("Product has been removed from cart", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        // This case adds to existing quantity
        newCart = [...cart];

        for (let key of newCart) {
          if (key._id === _id) {
            const index = newCart.indexOf(key);
            newCart[index] = { ...key, quantity: newCart[index].quantity + parseInt(productQuantity) };
          }
        }
        toast("Product quantity updated in cart", {
          type: "success",
          autoClose: 2000,
        });
      }
      break;

    case false:
      let currentCartedProduct = allProductsData.find((productsData) => productsData._id === _id);
      
      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex((item) => item._id === _id);
      
      if (existingProductIndex !== -1) {
        // Product exists, update its quantity to the exact value
        newCart = [...cart];
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: productQuantity ? parseInt(productQuantity) : 1,
        };
        console.log("[v0] Updated existing product quantity to:", newCart[existingProductIndex].quantity);
        toast("Product quantity updated in cart", {
          type: "success",
          autoClose: 2000,
        });
      } else {
        // Product doesn't exist, add new with specified quantity
        currentCartedProduct = {
          ...currentCartedProduct,
          quantity: productQuantity ? parseInt(productQuantity) : 1,
        };
        newCart = [...cart, currentCartedProduct];
        console.log("[v0] Added new product with quantity:", currentCartedProduct.quantity);
        toast("Product has been added to quote", {
          type: "success",
          autoClose: 2000,
        });
      }
      break;
      
    default:
      break;
  }

  dispatch(setCart(newCart));
};
