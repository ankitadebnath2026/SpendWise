import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { profileStyles } from '../assets/dummyStyles';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setProfileMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await authService.updateProfile({
        name: name.trim(),
        email: email.trim(),
      });
      if (res.success && res.user) {
        updateUser(res.user);
        setIsEditingProfile(false);
        setProfileMessage({
          type: 'success',
          text: 'Profile details updated successfully!',
        });
      }
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.updatePassword({
        currentPassword,
        newPassword,
      });
      if (res.success) {
        setPasswordMessage({
          type: 'success',
          text: 'Password updated successfully!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordMessage({ type: '', text: '' });
        }, 1500);
      }
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Profile Banner */}
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <span className="text-3xl font-bold text-white">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </span>
          </div>
          <h1 className={profileStyles.userName}>{user?.name || 'User Profile'}</h1>
          <p className={profileStyles.userEmail}>{user?.email || ''}</p>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-6">
          {profileMessage.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    Personal Information
                  </h2>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setName(user?.name || '');
                          setEmail(user?.email || '');
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Name</span>
                      <p className="text-base font-semibold text-gray-800">
                        {user?.name || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Email</span>
                      <p className="text-base font-semibold text-gray-800">
                        {user?.email || 'Not set'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    Security & Password
                  </h2>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Password
                      </h3>
                      <p className="text-xs text-gray-400">••••••••••••</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 px-3 py-1.5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
                    <p className="font-semibold mb-1">Account Protection</p>
                    Your account is secured with standard JSON Web Token (JWT) session encryption.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-teal-600" />
                Change Password
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordMessage({ type: '', text: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMessage.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  passwordMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md transition-colors"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
