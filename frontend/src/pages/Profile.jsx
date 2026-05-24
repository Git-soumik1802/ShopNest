import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // GET USER FROM LOCAL STORAGE
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));

    // IF USER NOT FOUND
    if (!storedUser || !storedUser.token) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {

        const res = await fetch(
          'http://localhost:5000/api/orders/myorders',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedUser.token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {

          // TOKEN EXPIRED
          if (res.status === 401) {
            logout();
            navigate('/login');
          }

          setOrders([]);
        }

      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();

  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '35px',
        background: '#111',
        color: '#fff',
        borderRadius: '10px',
      }}
    >
      {/* PROFILE SECTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <div>
          <h1>My Profile</h1>

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'red',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            height: '45px',
          }}
        >
          Logout
        </button>
      </div>

      {/* ORDERS SECTION */}
      <h2 style={{ marginBottom: '20px' }}>My Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div>
          <p>No Orders Found</p>

          <Link to="/shop">
            <button
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: '1px solid #333',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '8px',
              }}
            >
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>

              <p>
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <p>
                <strong>Status:</strong> {order.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;