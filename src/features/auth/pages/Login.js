import { loginUser } from 'api'; // Assuming you have an api.js with loginUser
import { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await loginUser(username, password);
      // Assuming userData contains company_id or that it can be derived from the user
      // For now, we'll hardcode company_id to 1 as it's hardcoded in App.js
      const companyId = 1;
      onLoginSuccess(userData.token, companyId);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esg-flex esg-flex-col esg-items-center esg-justify-center esg-min-h-screen esg-bg-gray-100">
      <div className="esg-p-8 esg-bg-white esg-rounded-lg esg-shadow-md esg-w-full esg-max-w-md">
        <h2 className="esg-text-2xl esg-font-bold esg-mb-6 esg-text-center esg-text-gray-800">
          Login
        </h2>
        {error && (
          <p className="esg-text-red-500 esg-text-center esg-mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="esg-space-y-4">
          <div>
            <label
              className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="esg-block esg-text-gray-700 esg-text-sm esg-font-bold esg-mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="esg-shadow esg-appearance-none esg-border esg-rounded esg-w-full esg-py-2 esg-px-3 esg-text-gray-700 esg-mb-3 esg-leading-tight focus:esg-outline-none focus:esg-shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="esg-bg-blue-500 hover:esg-bg-blue-700 esg-text-white esg-font-bold esg-pt-2.5 esg-pb-1.5 esg-px-4 esg-rounded focus:esg-outline-none focus:esg-shadow-outline esg-w-full esg-flex esg-items-center esg-justify-center"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
