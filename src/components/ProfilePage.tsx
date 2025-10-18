'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Heart, 
  Bookmark, 
  Settings, 
  Shield,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  user_id: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  created_at: string
  updated_at: string
}

interface UserStats {
  favoriteCount: number
  joinDate: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({ favoriteCount: 0, joinDate: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    phone: ''
  })
  
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/')
        return
      }

      setUser(session.user)
      await Promise.all([
        fetchUserProfile(session.user.id),
        fetchUserStats(session.user.id)
      ])
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
      setEditForm({
        full_name: data.full_name || '',
        username: data.username || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        phone: data.phone || ''
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchUserStats = async (userId: string) => {
    try {
      // Get favorite count
      const { count: favoriteCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Get join date from auth.users
      const { data: authUser } = await supabase.auth.getUser()
      
      setUserStats({
        favoriteCount: favoriteCount || 0,
        joinDate: authUser.user?.created_at || ''
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!editForm.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!editForm.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (editForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(editForm.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    if (editForm.website && !editForm.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must be a valid URL (starting with http:// or https://)'
    }

    if (editForm.phone && !editForm.phone.match(/^[\+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !userProfile) return

    setIsSaving(true)
    try {
      // Check if username is already taken (if changed)
      if (editForm.username !== userProfile.username) {
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', editForm.username)
          .neq('user_id', userProfile.user_id)
          .single()

        if (existingUser) {
          setErrors({ username: 'Username is already taken' })
          setIsSaving(false)
          return
        }
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userProfile.user_id)

      if (error) {
        console.error('Error updating profile:', error)
        toast.error('Failed to update profile')
        return
      }

      // Refresh profile data
      await fetchUserProfile(userProfile.user_id)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (userProfile) {
      setEditForm({
        full_name: userProfile.full_name || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        phone: userProfile.phone || ''
      })
    }
    setIsEditing(false)
    setErrors({})
  }

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-6 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    {userProfile.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                            errors.full_name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.full_name && (
                          <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username *
                        </label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                            errors.username ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your username"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{userProfile.full_name}</h2>
                      <p className="text-gray-600">@{userProfile.username}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700">
                    {userProfile.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-700">{userProfile.location || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">{userProfile.phone || 'Not specified'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          errors.website ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="https://your-website.com"
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      {userProfile.website ? (
                        <a
                          href={userProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark"
                        >
                          {userProfile.website}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userStats.favoriteCount}</p>
                    <p className="text-sm text-gray-600">Favorite Blessings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{formatJoinDate(userStats.joinDate)}</p>
                    <p className="text-sm text-gray-600">Member Since</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/favorites')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bookmark className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">My Favorites</span>
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Account Settings</span>
                </button>
                <button
                  onClick={() => router.push('/privacy')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Privacy Policy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}