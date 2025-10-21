'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  Heart, 
  User,
  Sun,
  Gift,
  Cross,
  GraduationCap,
  TreePine,
  Flower2,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  Bookmark,
  ChevronDown
} from 'lucide-react'
import AuthModal from './AuthModal'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  user_id: string
  username: string
  full_name: string
  avatar_url?: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(true)
  
  const favoritesRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setIsLoggedIn(true)
        await fetchUserProfile(session.user.id)
        await fetchFavoriteCount(session.user.id)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        setIsLoggedIn(true)
        await fetchUserProfile(session.user.id)
        await fetchFavoriteCount(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setUserProfile(null)
        setIsLoggedIn(false)
        setFavoriteCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      // Handle empty results gracefully
      if (data && data.length > 0) {
        setUserProfile(data[0])
      } else {
        // User profile doesn't exist, set to null
        console.log('No user profile found, user may need to complete profile setup')
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  // Fetch user's favorite count
  const fetchFavoriteCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching favorite count:', error)
        return
      }

      setFavoriteCount(count || 0)
    } catch (error) {
      console.error('Error fetching favorite count:', error)
    }
  }

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
        setIsFavoritesOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Mock favorites data - in real app, fetch from database
  const mockFavorites = [
    { id: 1, title: "May your day be filled with happiness", category: "Daily Blessings" },
    { id: 2, title: "Wishing you a wonderful birthday", category: "Birthday Blessings" },
    { id: 3, title: "May God bless your union", category: "Wedding & Anniversary" }
  ]

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
  }

  const handleLogin = () => {
    openAuthModal('login')
  }

  const handleRegister = () => {
    openAuthModal('register')
  }

  const handleLoginSuccess = (userData: any) => {
    // Auth state will be updated by the auth listener
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsUserMenuOpen(false)
      // Auth state will be updated by the auth listener
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Get display name and email
  const getDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name
    if (userProfile?.username) return userProfile.username
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.username) return user.user_metadata.username
    return 'User'
  }

  const getDisplayEmail = () => {
    return user?.email || 'user@example.com'
  }

  const categories = [
    { name: 'Daily Blessings', slug: 'daily', icon: Sun },
    { name: 'Birthday Blessings', slug: 'birthday', icon: Gift },
    { name: 'Wedding & Anniversary', slug: 'wedding-anniversary', icon: Heart },
    { name: 'Religious Blessings', slug: 'religious', icon: Cross },
    { name: 'Life Events', slug: 'life-events', icon: GraduationCap },
    { name: 'Holiday Blessings', slug: 'holiday', icon: TreePine },
    { name: 'Sympathy & Healing', slug: 'sympathy-healing', icon: Flower2 },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-pacifico text-gray-800" style={{fontFamily: "'Pacifico', cursive"}}>
              BlessYou.Today
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary transition-colors font-medium">
                Categories
              </button>
              {/* Categories Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-primary" />
                        {category.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Search
            </Link>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blessings..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Button */}
            <button 
              onClick={() => router.push('/search')}
              className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Dropdown */}
            <div className="hidden sm:block relative" ref={favoritesRef}>
              <button 
                onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                className={`flex items-center p-2 transition-colors relative ${
                  favoriteCount > 0 ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-primary'
                }`}
              >
                <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </button>

              {/* Favorites Dropdown Menu */}
              {isFavoritesOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      My Favorites ({favoriteCount})
                    </h3>
                  </div>
                  
                  {favoriteCount > 0 ? (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {mockFavorites.map((favorite) => (
                          <div key={favorite.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                            <p className="text-sm text-gray-800 line-clamp-2 mb-1">{favorite.title}</p>
                            <p className="text-xs text-gray-500">{favorite.category}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link 
                          href="/favorites" 
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                          onClick={() => setIsFavoritesOpen(false)}
                        >
                          View All Favorites →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No favorites yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <User className="w-5 h-5 cursor-pointer" />
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{getDisplayName()}</p>
                        <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
                      </div>
                      <Link 
                        href="/favorites" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Bookmark className="w-4 h-4" />
                        My Favorites
                      </Link>
                      <hr className="my-2" />
                      <button 
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleLogin}
                        className="cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </button>
                      <button 
                        onClick={handleRegister}
                        className="cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blessings..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-amber-400/40 focus:border-primary dark:focus:border-amber-400 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <div>
              <div className="text-gray-700 font-medium mb-2">Categories</div>
              <div className="pl-4 space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <Link 
              href="/search" 
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Advanced Search
            </Link>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              {/* Mobile Favorites */}
              <div>
                <button 
                  className={`flex items-center gap-3 w-full transition-colors ${
                    favoriteCount > 0 ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-primary'
                  }`}
                  onClick={() => router.push('/favorites')}
                >
                  <div className="relative">
                    <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-current' : ''}`} />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        {favoriteCount}
                      </span>
                    )}
                  </div>
                  <span>Favorites {favoriteCount > 0 && `(${favoriteCount})`}</span>
                </button>
              </div>

              {/* Mobile User Menu */}
              <div className="space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-2 py-1 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-800">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        handleLogin()
                      }}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors w-full text-left"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                    <button 
                      onClick={() => {
                        handleRegister()
                      }}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors w-full text-left"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  )
}