'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Check, 
  AlertCircle,
  Loader2,
  Heart
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
  onLoginSuccess?: (userData: any) => void
  onRegisterSuccess?: (userData: any) => void
}

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  rememberMe: boolean
  acceptTerms: boolean
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
  general?: string
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onLoginSuccess,
  onRegisterSuccess 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    acceptTerms: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        acceptTerms: false
      })
      setErrors({})
      setShowSuccess(false)
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let score = 0
    let feedback = []
    
    if (password.length >= 8) score += 1
    else feedback.push('At least 8 characters')
    
    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Lowercase letter')
    
    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Uppercase letter')
    
    if (/\d/.test(password)) score += 1
    else feedback.push('Number')
    
    if (/[^a-zA-Z\d]/.test(password)) score += 1
    else feedback.push('Special character')
    
    const strength = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong'
    return { score, strength, feedback }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (mode === 'register') {
      // Username validation
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required'
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters long'
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions'
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (mode === 'register' && passwordStrength.strength === 'weak') {
      newErrors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Check for rate limiting (brute force protection)
    if (mode === 'login') {
      const { data: recentAttempts } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('email', formData.email)
        .eq('success', false)
        .gte('attempted_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order('attempted_at', { ascending: false })

      if (recentAttempts && recentAttempts.length >= 5) {
        setErrors({ general: 'Too many failed login attempts. Please try again in 15 minutes.' })
        return
      }
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      if (mode === 'login') {
        // Record login attempt
        const loginAttemptData = {
          email: formData.email,
          ip_address: '127.0.0.1', // In production, get real IP
          success: false,
          attempted_at: new Date().toISOString(),
        }

        try {
          // Supabase login
          const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })
          
          if (error) {
            // Record failed login attempt
            await supabase.from('login_attempts').insert([{
              ...loginAttemptData,
              failure_reason: error.message
            }])

            if (error.message.includes('Invalid login credentials')) {
              setErrors({ general: 'Invalid email or password. Please try again.' })
            } else {
              setErrors({ general: error.message })
            }
            return
          }

          // Record successful login attempt
          await supabase.from('login_attempts').insert([{
            ...loginAttemptData,
            success: true,
            failure_reason: null
          }])

          // Create user session record if "Remember Me" is checked
          if (formData.rememberMe && data.user) {
            await supabase.from('user_sessions').insert([{
              user_id: data.user.id,
              device_info: navigator.userAgent || 'Unknown Device',
              ip_address: '127.0.0.1', // In production, get real IP
              user_agent: navigator.userAgent,
              created_at: new Date().toISOString(),
              last_activity: new Date().toISOString(),
              is_active: true
            }])
          }
          
          setSuccessMessage('Login successful! Welcome back.')
          setShowSuccess(true)
          onLoginSuccess?.(data.user)
          
          setTimeout(() => {
            onClose()
          }, 1500)
        } catch (sessionError) {
          console.error('Session creation error:', sessionError)
          // Don't fail the login if session creation fails
        }
      } else {
        // Check username uniqueness first
        const { data: existingUser, error: checkError } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', formData.username)
          .single()
        
        if (existingUser) {
          setErrors({ username: 'Username is already taken. Please choose another one.' })
          return
        }
        
        // Supabase registration
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            }
          }
        })
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setErrors({ email: 'An account with this email already exists.' })
          } else {
            setErrors({ general: error.message })
          }
          return
        }
        
        // Create profile record manually since trigger might not work in all cases
        if (data.user) {
          try {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert([
                {
                  user_id: data.user.id,
                  username: formData.username,
                  full_name: formData.username, // Use username as default full name
                }
              ])
            
            if (profileError) {
              console.error('Profile creation error:', profileError)
              // Don't fail registration if profile creation fails
            }
          } catch (profileException) {
            console.error('Profile creation exception:', profileException)
            // Don't fail registration if profile creation fails
          }
        }
        
        setSuccessMessage('Registration successful! Please check your email to verify your account.')
        setShowSuccess(true)
        onRegisterSuccess?.(data.user)
        
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error: any) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first.' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setErrors({ general: error.message })
      } else {
        setSuccessMessage('Password reset link has been sent to your email!')
        setShowSuccess(true)

        // Hide the success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      }
    } catch (error: any) {
      setErrors({ general: 'Failed to send password reset email. Please try again.' })
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 transition-all">
          {/* Header */}
          <div 
            className="relative px-6 py-8 text-white"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)' }}
          >
            {/* Dark overlay for better contrast */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 rounded-t-2xl"></div> */}
            
            <div className="relative z-10">
              <button
                onClick={onClose}
                className="absolute right-0 top-0 p-2 text-white bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Close modal"
                style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/25">
                  <Heart
                    className="w-5 h-5 text-white fill-current"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))' }}
                  />
                </div>
                <h2
                  className="text-2xl font-bold font-crimson tracking-wide text-white"
                  style={{
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  BlessYou.Today
                </h2>
              </div>

              <p
                className="text-white/95 text-sm leading-relaxed font-medium"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                {mode === 'login' ? 'Welcome back! Please sign in to your account.' : 'Create your account to start collecting blessings.'}
              </p>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-6 mt-4 p-4 bg-green-50/80 border border-green-300/50 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="px-6 py-6">
            {/* Mode Toggle */}
            <div className="flex mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none cursor-pointer border-b-2 ${
                  mode === 'login'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none cursor-pointer border-b-2 ${
                  mode === 'register'
                    ? 'text-orange-500 border-orange-500'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username Field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                        errors.username ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                      }`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {mode === 'login' ? 'Email or Username' : 'Email Address'} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                      errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                    }`}
                    placeholder={mode === 'login' ? 'Enter email or username' : 'Enter your email'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                      errors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {mode === 'register' && formData.password && (
                  <div className="mt-3 p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength.strength === 'medium' ? 'w-2/3 bg-amber-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength === 'weak' ? 'text-red-600' :
                        passwordStrength.strength === 'medium' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <p className="text-xs text-gray-600">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              {mode === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-12 py-2.5 border rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me / Terms */}
              <div className="space-y-3 pt-1">
                {mode === 'login' && (
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/30 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/30 mt-0.5 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:text-secondary font-medium underline decoration-primary/30 hover:decoration-secondary transition-colors" target="_blank">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary hover:text-secondary font-medium underline decoration-primary/30 hover:decoration-secondary transition-colors" target="_blank">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3.5 bg-red-50/80 border border-red-300/50 rounded-xl shadow-sm">
                  <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative text-white py-3 px-4 rounded-xl font-bold text-base shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2 overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
                  boxShadow: '0 4px 12px rgba(247, 184, 1, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="relative z-10 flex items-center justify-center gap-2 font-bold">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-bold">{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span className="font-bold">{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  )}
                </div>
              </button>

              {/* Forgot Password */}
              {mode === 'login' && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}