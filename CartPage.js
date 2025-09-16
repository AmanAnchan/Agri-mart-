import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * (item.consumerQuantity || 1);
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (id, value, maxQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, consumerQuantity: Math.min(Math.max(value, 1), maxQuantity) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle "Make Payment"
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create the order (no actual payment processing)
      const { data } = await axios.post("/api/v1/product/braintree/payment", { cart });

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment successful, order placed!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed");
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user ? "Hello Guest" : `Hello ${auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You have ${cart.length} item(s) in your cart. ${
                      auth?.token ? "" : "Please log in to checkout!"
                    }`
                  : "Your cart is empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((item) => (
                <div className="row card flex-row mb-3" key={item._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${item._id}`}
                      className="card-img-top"
                      alt={item.name}
                      width="100%"
                      height="130px"
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{item.name}</p>
                    <p>{<p>{item.description ? item.description.substring(0, 30) : "No description available"}</p>
                  }</p>
                    <p>Price: {item.price}</p>
                    <p>Available: {item.quantity}</p>
                    <input
                      type="number"
                      value={item.consumerQuantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item._id,
                          parseInt(e.target.value, 10),
                          item.quantity
                        )
                      }
                      className="form-control"
                      min="1"
                      max={item.quantity}
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please log in to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                <button
                  className="btn btn-primary"
                  onClick={handlePayment}
                  disabled={loading || !auth?.user?.address || !cart?.length}
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;



// import React, { useState, useEffect } from "react";
// import Layout from "./../components/Layout/Layout";
// import { useCart } from "../context/cart";
// import { useAuth } from "../context/auth";
// import { useNavigate } from "react-router-dom";
// import DropIn from "braintree-web-drop-in-react";
// import { AiFillWarning } from "react-icons/ai";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../styles/CartStyles.css";

// const CartPage = () => {
//   const [auth, setAuth] = useAuth();
//   const [cart, setCart] = useCart();
//   const [clientToken, setClientToken] = useState("");
//   const [instance, setInstance] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   //total price
//   const totalPrice = () => {
//     try {
//       let total = 0;
//       cart?.map((item) => {
//         total = total + item.price;
//       });
//       return total.toLocaleString("en-IN", {
//         style: "currency",
//         currency: "INR",
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   //detele item
//   const removeCartItem = (pid) => {
//     try {
//       let myCart = [...cart];
//       let index = myCart.findIndex((item) => item._id === pid);
//       myCart.splice(index, 1);
//       setCart(myCart);
//       localStorage.setItem("cart", JSON.stringify(myCart));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //get payment gateway token
//   const getToken = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/product/braintree/token");
//       setClientToken(data?.clientToken);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getToken();
//   }, [auth?.token]);

//   //handle payments
//   const handlePayment = async () => {
//     try {
//       setLoading(true);
//       // const { nonce } = await instance.requestPaymentMethod();
//       const { data } = await axios.post("/api/v1/product/braintree/payment", {
//        // nonce,
//         cart,
//       });
//       setLoading(false);
//       localStorage.removeItem("cart");
//       setCart([]);
//       navigate("/dashboard/user/orders");
//       toast.success("Payment Completed Successfully ");
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };
//   return (
//     <Layout>
//       <div className=" cart-page">
//         <div className="row">
//           <div className="col-md-12">
//             <h1 className="text-center bg-light p-2 mb-1">
//               {!auth?.user
//                 ? "Hello Guest"
//                 : `Hello  ${auth?.token && auth?.user?.name}`}
//               <p className="text-center">
//                 {cart?.length
//                   ? `You Have ${cart.length} items in your cart ${
//                       auth?.token ? "" : "please login to checkout !"
//                     }`
//                   : " Your Cart Is Empty"}
//               </p>
//             </h1>
//           </div>
//         </div>
//         <div className="container ">
//           <div className="row ">
//             <div className="col-md-7  p-0 m-0">
//               {cart?.map((p) => (
//                 <div className="row card flex-row" key={p._id}>
//                   <div className="col-md-4">
//                     <img
//                       src={`/api/v1/product/product-photo/${p._id}`}
//                       className="card-img-top"
//                       alt={p.name}
//                       width="100%"
//                       height={"130px"}
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <p>{p.name}</p>
//                     <p>{p.description.substring(0, 30)}</p>
//                     <p>Price : {p.price}</p>
//                   </div>
//                   <div className="col-md-4 cart-remove-btn">
//                     <button
//                       className="btn btn-danger"
//                       onClick={() => removeCartItem(p._id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="col-md-5 cart-summary ">
//               <h2>Cart Summary</h2>
//               <p>Total | Checkout | Payment</p>
//               <hr />
//               <h4>Total : {totalPrice()} </h4>
//               {auth?.user?.address ? (
//                 <>
//                   <div className="mb-3">
//                     <h4>Current Address</h4>
//                     <h5>{auth?.user?.address}</h5>
//                     <button
//                       className="btn btn-outline-warning"
//                       onClick={() => navigate("/dashboard/user/profile")}
//                     >
//                       Update Address
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="mb-3">
//                   {auth?.token ? (
//                     <button
//                       className="btn btn-outline-warning"
//                       onClick={() => navigate("/dashboard/user/profile")}
//                     >
//                       Update Address
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-outline-warning"
//                       onClick={() =>
//                         navigate("/login", {
//                           state: "/cart",
//                         })
//                       }
//                     >
//                       Plase Login to checkout
//                     </button>
//                   )}
//                 </div>
//               )}
//               <div className="mt-2">
//                 {!clientToken || !auth?.token || !cart?.length ? (
//                   ""
//                 ) : (
//                   <>
//                     <DropIn
//                       options={{
//                         authorization: clientToken,
//                         paypal: {
//                           flow: "vault",
//                         },
//                       }}
//                       onInstance={(instance) => setInstance(instance)}
//                     />

//                     <button
//                       className="btn btn-primary"
//                       onClick={handlePayment}
//                       disabled={loading || !instance || !auth?.user?.address}
//                     >
//                       {loading ? "Processing ...." : "Make Payment"}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CartPage;
