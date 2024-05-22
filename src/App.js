import { useState, useEffect, useCallback } from "react";

import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData(); 
const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);
const  queryId= tele.queryId;
  useEffect(() => {
    tele.ready();
    tele.expand();
  });

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };
   //const data = useMemo(() => ({data0: '000000'}), []);
  const notifyBot = useCallback(async ( ) => {
    window.alert("Good");
    const data = {
    queryId: queryId,
    products: cartItems,
    totalPrice: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  };
     window.alert(queryId);
    try {
      await fetch('https://online-glorycasino.site:3001/notify-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }); 
     // window.alert("queryId=" +queryId+ "Total = " + cartItems.reduce((total, item) => total + (item.price * item.quantity)));
    } catch (e) {  window.alert(e.name + ": " + e.message);}

  }, [queryId, cartItems]);
  const onCheckout = () => {
    tele.MainButton.text = "Pay :)";
    tele.MainButton.show();
    //tele.MainButton.addEventListener('click', notifyBot);
  };
  useEffect(() => {
    tele.onEvent('mainButtonClicked', notifyBot)
    return () => {
      tele.offEvent('mainButtonClicked', notifyBot)
    }
  }, [notifyBot])
  return (
    <>
      <h1 className="heading">Order Food</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout}/>
      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App;
