// Google Analytics types and utilities

export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface GAPageView {
  page_title: string
  page_location: string
}

// Google Analytics gtag function type
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | object,
      config?: object
    ) => void
  }
}

// Utility functions for Google Analytics
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export const trackPageView = ({ page_title, page_location }: GAPageView) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title,
      page_location,
    })
  }
}

// Common event tracking functions
export const trackBlessingView = (blessingSlug: string, category?: string) => {
  trackEvent({
    action: 'view_blessing',
    category: 'engagement',
    label: `${category ? `${category}/` : ''}${blessingSlug}`,
  })
}

export const trackBlessingShare = (blessingSlug: string, platform: string) => {
  trackEvent({
    action: 'share_blessing',
    category: 'social',
    label: `${platform}/${blessingSlug}`,
  })
}

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: query,
    value: resultsCount,
  })
}

export const trackCategoryView = (categorySlug: string) => {
  trackEvent({
    action: 'view_category',
    category: 'navigation',
    label: categorySlug,
  })
}