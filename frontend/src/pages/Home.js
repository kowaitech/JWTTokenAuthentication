import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../Component/auth';

const Home = () => {
  const [username, setUsername] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await verifyToken();
      if (result.valid) {
        setUsername(result.username);
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.logo}>MyApp</h2>
        <div style={styles.profileContainer}>
          <div style={styles.profileCircle} onClick={togglePopup}>
            {username.charAt(0).toUpperCase()}
          </div>

          {showPopup && (
            <div style={styles.popup} onClick={togglePopup}>
              <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <p style={styles.usernameText}>{username}</p>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main style={styles.main}>
        <h1>Welcome, {username} 👋</h1>
        <p>You are successfully logged in.</p>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    height: '100vh',
    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#2563eb',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    letterSpacing: '1px',
  },
  profileContainer: {
    position: 'relative',
  },
  profileCircle: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#facc15',
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  popup: {
    position: 'absolute',
    top: '60px',
    right: 0,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100vw',
    height: '100vh',
    zIndex: 20,
  },
  popupContent: {
    position: 'absolute',
    top: '10px',
    right: '40px',
    backgroundColor: '#fff',
    color: '#111',
    borderRadius: '10px',
    // boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
    padding: '10px 15px',
    textAlign: 'center',
    width: '150px',
    zIndex: 30,
  },
  usernameText: {
    margin: '5px 0',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    marginTop: '8px',
    fontSize: '0.9rem',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#111',
  },
};

export default Home;
