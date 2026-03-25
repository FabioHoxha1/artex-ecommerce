export const handleSetShippingMethodValue = (shippingMethod, setShippingMethodValue) => {
  const methodArr = { standard: 7, express: 10 };

  for (let key in methodArr) {
    if (key === shippingMethod) {
      setShippingMethodValue(methodArr[key]);
    }
  }
};
