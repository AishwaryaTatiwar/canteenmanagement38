import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderDetails.css';

const OrderDetails = () => {
  const [activeTab, setActiveTab] = useState('pending'); // Track the active tab
  const [orders, setOrders] = useState([]); // State to store the fetched orders
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]); // Store the selected order items for the popup

  // Function to toggle the visibility of the popup
  const togglePopup = (selectedOrderItems = []) => {
    setSelectedOrderItems(selectedOrderItems);
    setPopupVisible(!isPopupVisible);
  };

  // Fetch orders from the API when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8283/api/orders');
        setOrders(response.data); // Assuming the response data is an array of orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to send acceptance email
  const handleAccept = async (userEmail, orderID) => {
    try {
      await axios.post('http://localhost:8283/api/orderEmail/send-accept-email', {
        userEmail,
        orderID,
      });
      alert('Acceptance email sent.');
    } catch (error) {
      console.error('Error sending acceptance email:', error);
    }
  };

  // Function to send rejection email
  const handleReject = async (userEmail, orderID) => {
    try {
      await axios.post('http://localhost:8283/api/orderEmail/send-reject-email', {
        userEmail,
        orderID,
      });
      alert('Rejection email sent.');
    } catch (error) {
      console.error('Error sending rejection email:', error);
    }
  };

  // Filter orders based on the active tab (status)
  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order => order.orderStatus === activeTab)
    : [];

  return (
    <div className="order-management">
      {/* Tabs with conditional bottom border */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'inpreparation' ? 'active' : ''}`}
          onClick={() => setActiveTab('inpreparation')}
        >
          In preparation
        </button>
        <button
          className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled Orders
        </button>
      </div>

      {/* Display orders based on active tab */}
      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.orderID} className="order-card">
              <div className="order-header">
                <span className="order-id">#OrderID: {order.orderID}</span>
              </div>
              <div className="order-body">
                <div className="order-info-grid">
                  <div className="label">Date and time:</div>
                  <div className="label">Email:</div>
                  <div className="label">Items and quantity:</div>
                  <div className="label">Total Amount:</div>

                  <div className="value">{order.datetime}</div>
                  <div className="value">{order.userEmail}</div>
                  <button
                    className="items-btn"
                    onClick={() => togglePopup(order.cartItems)} // Pass items to popup
                  >
                    Items, quantity, amt
                  </button>
                  <div className="value">Rs.{order.totalPrice}</div>
                </div>

                <div className="order-actions">
                  {/* Conditionally render buttons based on order status */}
                  {activeTab === 'pending' && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(order.userEmail, order.orderID)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(order.userEmail, order.orderID)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Conditional Rendering for Popup */}
              {isPopupVisible && (
                <div className="popup">
                  <div className="popup-content">
                    <h3>Items and Quantity</h3>
                    <ul>
                      {/* Loop through the selectedOrderItems and display them */}
                      {selectedOrderItems.map((item, index) => (
                        <li key={index}>
                          {item.title} - {item.quantity} plt @ Rs.{item.price} each
                        </li>
                      ))}
                    </ul>
                    <button className="close-btn" onClick={togglePopup}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No orders in this category.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
