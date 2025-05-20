import React, { useState } from 'react';
import { FaCheck, FaSpotify } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CustomScrollbar from '../../../../components/Scrollbar/CustomScrollbar';
import axios from 'axios';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayPalPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData || !userData.token) {
        console.log('redirect to login cuz userlogin=', userData);
        navigate('/login');
        return;
      }

      // Get user ID from the user data
      const userId = userData.user?.data?._id;
      console.log('User Data:', userData);
      console.log('User ID:', userId);

      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/payment/create/', 
        { 
          amount: 3.99,  // Changed from "3.99" to 3.99
          user_id: userId  // make sure userId is a string, not ObjectId or undefined
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        setError('Failed to get PayPal redirect URL');
      }
    } catch (err) {
      console.error('Payment error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to initiate payment. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <FaSpotify className="text-3xl text-green-500" />
            <h1 className="text-xl font-bold">Premium</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <CustomScrollbar className="h-full">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Get Premium </h2>
              <p className="text-xl text-gray-400 mb-8">Just $3.99. Debit and credit cards accepted.</p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ad-free music listening</h3>
                    <p className="text-gray-400">Enjoy uninterrupted music.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Offline playback</h3>
                    <p className="text-gray-400">Download to listen offline.</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">High quality audio</h3>
                    <p className="text-gray-400">Experience sound as the artist intended.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Unlimited skips</h3>
                    <p className="text-gray-400">Skip any track you don't like.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 shadow-xl mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium Individual</h3>
                <p className="text-gray-400">ONLY FOR $3.99 </p>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePayPalPayment}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue with PayPal'}
              </button>
            </div>
          </div>
        </CustomScrollbar>
      </div>
    </div>
  );
};

export default PremiumPage; 