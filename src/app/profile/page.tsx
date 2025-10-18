import { Metadata } from 'next'
import ProfilePage from '@/components/ProfilePage'

export const metadata: Metadata = {
  title: 'Profile - BlessYou.Today',
  description: 'Manage your profile and account settings on BlessYou.Today',
}

export default function Profile() {
  return <ProfilePage />
}