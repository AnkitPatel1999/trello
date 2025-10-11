import { useState } from 'react';
import './superuser.css';

interface SuperUserToggleProps {
  isSuperUser: boolean;
  onToggle: (password: string) => Promise<boolean>;
}

const SuperUserToggle = ({ isSuperUser, onToggle }: SuperUserToggleProps) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleClick = () => {
    if (!isSuperUser) {
      // Show password prompt when turning ON
      setShowPasswordPrompt(true);
      setPassword('');
      setError('');
    } else {
      // Turn OFF without password
      onToggle('');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onToggle(password);
      if (success) {
        setShowPasswordPrompt(false);
        setPassword('');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordPrompt(false);
    setPassword('');
    setError('');
  };

  return (
    <>
      <div className="super-user-toggle">
        <label className="toggle-label">
          <span className="toggle-text">Super User Mode</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={isSuperUser}
              onChange={handleToggleClick}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
          </div>
        </label>
        {/* {isSuperUser && (
          <div className="super-user-indicator">
            <span className="indicator-text">👑 Admin View Active</span>
          </div>
        )} */}
      </div>

      {showPasswordPrompt && (
        <div className="password-prompt-overlay">
          <div className="password-prompt-modal">
            <div className="password-prompt-header">
              <h3>Enter Admin Password</h3>
              <p>Enter the admin password to enable super user mode</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="password-prompt-form">
              <div className="password-input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="password-input"
                  autoFocus
                  disabled={isLoading}
                />
                {error && <div className="password-error">{error}</div>}
              </div>
              
              <div className="password-prompt-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || !password.trim()}
                >
                  {isLoading ? 'Verifying...' : 'Enable Super User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperUserToggle;
