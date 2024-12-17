// frontend/pages/credentials.js
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Credentials() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://real-time-scraper-backend-production.up.railway.app:3001/api/credentials`, {
        username,
        password,
        email,
      });
      setMessage('Credentials saved successfully!');
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error(error);
      setMessage('Failed to save credentials.');
    }
  };

  return (
    <>
      <Head>
        <title>Set Twitter Credentials</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl mb-6 text-center">Enter Your Twitter Credentials</h2>
          {message && <p className="mb-4 text-center">{message}</p>}
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Save Credentials
          </button>
        </form>
      </div>
    </>
  );
}
