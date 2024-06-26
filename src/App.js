import { useState, useEffect, useCallback } from "react";
import {useTelegram} from "./telegram";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

   
function App() {
  const [cartItems, setCartItems] = useState([]);
  const  {tg,queryId} = useTelegram();
    useEffect(() => {
      tg.ready();
      tg.expand();
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

  const notifyBot = useCallback(async ( ) => {
    const data = {
      queryId: queryId,
      products: cartItems,
      totalPrice: (cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)
  };
    try {
      await fetch('https://online-glorycasino.site:3001/notify-bot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',  },
        body: JSON.stringify(data),
      }); 
     // window.alert("queryId=" +queryId+ "Total = " + cartItems.reduce((total, item) => total + (item.price * item.quantity)));
    } catch (e) {  window.alert(e.name + ": " + e.message);}
   tg.sendData(JSON.stringify(data));
  }, [cartItems,queryId,tg]);
  const onCheckout = () => {
    tg.MainButton.text = "Pay :)";
    tg.MainButton.show();
    console.log(notifyBot);
    //tg.MainButton.addEventListener('click', notifyBot);
  };
  useEffect(() => {
    tg.onEvent('mainButtonClicked', notifyBot)
    return () => {
      tg.offEvent('mainButtonClicked', notifyBot)
    }
  }, [tg,notifyBot])
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
