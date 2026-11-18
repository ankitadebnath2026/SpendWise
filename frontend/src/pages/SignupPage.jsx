import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import { signupStyles } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      <div className={signupStyles.cardContainer}>
        {/* Header */}
        <div className={signupStyles.header}>
          <Link
            to="/login"
            className={signupStyles.backButton}
            aria-label="Back to login"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={signupStyles.avatar}>
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className={signupStyles.headerTitle}>Create Account</h1>
          <p className={signupStyles.headerSubtitle}>
            Join Expense Tracker to take control of your finances
          </p>
        </div>

        {/* Form Container */}
        <div className={signupStyles.formContainer}>
          {error && <div className={signupStyles.apiError}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className={signupStyles.label}>Full Name</label>
              <div className={signupStyles.inputContainer}>
                <User className={signupStyles.inputIcon} size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={signupStyles.input}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className={signupStyles.label}>Email Address</label>
              <div className={signupStyles.inputContainer}>
                <Mail className={signupStyles.inputIcon} size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={signupStyles.input}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={signupStyles.label}>Password (min 8 chars)</label>
              <div className={signupStyles.inputContainer}>
                <Lock className={signupStyles.inputIcon} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={signupStyles.passwordInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={signupStyles.label}>Confirm Password</label>
              <div className={signupStyles.inputContainer}>
                <Lock className={signupStyles.inputIcon} size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={signupStyles.passwordInput}
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className={signupStyles.checkboxContainer}>
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="terms" className={signupStyles.checkboxLabel}>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${signupStyles.button} ${
                loading ? signupStyles.buttonDisabled : ''
              }`}
            >
              {loading && (
                <div className={signupStyles.spinner}>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className={signupStyles.signInContainer}>
            <p className={signupStyles.signInText}>
              Already have an account?{' '}
              <Link to="/login" className={signupStyles.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
