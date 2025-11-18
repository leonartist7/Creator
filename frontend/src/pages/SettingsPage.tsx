import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Trash2,
  Save,
  Crown,
} from 'lucide-react';

type TabType = 'profile' | 'password' | 'subscription' | 'notifications' | 'danger';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { user, setAuth } = useAuthStore();
  const { success, error } = useToast();

  // Profile form
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        setAuth(
          { ...user, firstName, lastName, email },
          useAuthStore.getState().token || '',
          useAuthStore.getState().refreshToken || ''
        );
      }

      success('Profile Updated!', 'Your profile has been saved successfully');
    } catch (err) {
      error('Update Failed', 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      error('Passwords Don\'t Match', 'New password and confirmation must match');
      return;
    }

    if (newPassword.length < 8) {
      error('Password Too Short', 'Password must be at least 8 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      success('Password Changed!', 'Your password has been updated successfully');
    } catch (err) {
      error('Update Failed', 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                    <Input
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge variant={user?.isEmailVerified ? 'success' : 'warning'}>
                        {user?.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} isLoading={isSavingProfile}>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Password requirements:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Mix of uppercase and lowercase letters recommended</li>
                      <li>Include numbers and special characters for security</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleChangePassword} isLoading={isChangingPassword}>
                      <Lock size={18} className="mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription</h2>

                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl border border-primary-200 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 capitalize">
                          {user?.subscriptionTier || 'Free'} Plan
                        </h3>
                        {user?.subscriptionTier === 'pro' && (
                          <Crown className="w-6 h-6 text-warning-500 fill-warning-500" />
                        )}
                      </div>
                      <p className="text-gray-600">
                        {user?.subscriptionTier === 'free' && 'Limited AI generations and features'}
                        {user?.subscriptionTier === 'pro' && 'Unlimited AI generations and premium features'}
                        {user?.subscriptionTier === 'business' && 'Team collaboration and priority support'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Plan Features</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <div className={`p-4 rounded-lg border-2 ${
                      user?.subscriptionTier === 'free' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}>
                      <h4 className="font-semibold text-gray-900 mb-2">Free</h4>
                      <p className="text-2xl font-bold text-gray-900 mb-4">$0<span className="text-sm text-gray-600">/mo</span></p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>✓ 3 projects</li>
                        <li>✓ 10 AI generations/month</li>
                        <li>✓ Basic export</li>
                      </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className={`p-4 rounded-lg border-2 ${
                      user?.subscriptionTier === 'pro' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}>
                      <h4 className="font-semibold text-gray-900 mb-2">Pro</h4>
                      <p className="text-2xl font-bold text-gray-900 mb-4">$29<span className="text-sm text-gray-600">/mo</span></p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>✓ Unlimited projects</li>
                        <li>✓ Unlimited AI generations</li>
                        <li>✓ Advanced export</li>
                        <li>✓ Priority support</li>
                      </ul>
                      {user?.subscriptionTier !== 'pro' && (
                        <Button variant="primary" className="w-full mt-4" size="sm">
                          Upgrade to Pro
                        </Button>
                      )}
                    </div>

                    {/* Business Plan */}
                    <div className={`p-4 rounded-lg border-2 ${
                      user?.subscriptionTier === 'business' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}>
                      <h4 className="font-semibold text-gray-900 mb-2">Business</h4>
                      <p className="text-2xl font-bold text-gray-900 mb-4">$99<span className="text-sm text-gray-600">/mo</span></p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>✓ Everything in Pro</li>
                        <li>✓ Team collaboration</li>
                        <li>✓ Custom branding</li>
                        <li>✓ API access</li>
                      </ul>
                      {user?.subscriptionTier !== 'business' && (
                        <Button variant="primary" className="w-full mt-4" size="sm">
                          Upgrade to Business
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-start justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive email updates about your projects and AI usage
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive tips, updates, and special offers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingEmails}
                        onChange={(e) => setMarketingEmails(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between py-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Weekly Digest</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Get a weekly summary of your productivity and achievements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.value)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => success('Saved!', 'Notification preferences updated')}>
                      <Save size={18} className="mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <Card className="p-6 border-error-200">
                <h2 className="text-xl font-semibold text-error-600 mb-6">Danger Zone</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-error-50 rounded-lg border border-error-200">
                    <h4 className="font-semibold text-error-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-error-700 mb-4">
                      Once you delete your account, there is no going back. This will permanently delete:
                    </p>
                    <ul className="list-disc list-inside text-sm text-error-700 space-y-1 mb-4">
                      <li>All your projects and content</li>
                      <li>AI generation history</li>
                      <li>Account settings and preferences</li>
                      <li>Subscription and billing information</li>
                    </ul>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                          error('Account Deletion', 'Please contact support to delete your account');
                        }
                      }}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
