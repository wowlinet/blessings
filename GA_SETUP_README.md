# Google Analytics 配置指南

本项目已成功集成 Google Analytics 4 (GA4) 使用 `@next/third-parties` 库。以下是完整的配置说明和使用指南。

## 📦 已安装的依赖

```bash
npm install @next/third-parties
```

## 🔧 配置步骤

### 1. 环境变量配置

在项目根目录的 `.env.local` 文件中设置：

```env
# Google Analytics Configuration
# Replace 'G-XXXXXXXXXX' with your actual Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**重要提示：**
- 将 `G-XXXXXXXXXX` 替换为您的实际 GA4 测量 ID
- 变量必须以 `NEXT_PUBLIC_` 开头才能在浏览器中使用
- 在生产环境中部署时设置真实的 GA ID

### 2. 根布局配置

在 `src/app/layout.tsx` 中已配置：

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// 在 body 标签内添加
{process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

**特性：**
- 只在生产环境中加载 GA
- 自动检查环境变量是否设置
- 符合 GDPR 和隐私最佳实践

### 3. 类型定义

已创建 `src/types/analytics.ts` 包含：
- GA 事件和页面视图的类型定义
- 全局 gtag 函数类型声明
- 实用的跟踪函数

## 🎯 使用方法

### 基础事件跟踪

```tsx
import { trackEvent } from '@/types/analytics'

// 跟踪自定义事件
trackEvent({
  action: 'button_click',
  category: 'engagement',
  label: 'header_cta',
  value: 1
})
```

### 预定义跟踪函数

```tsx
import { 
  trackBlessingView, 
  trackBlessingShare, 
  trackSearch,
  trackCategoryView 
} from '@/types/analytics'

// 跟踪祝福查看
trackBlessingView('blessing-slug', 'category-name')

// 跟踪分享事件
trackBlessingShare('blessing-slug', 'facebook')

// 跟踪搜索
trackSearch('search query', 5)

// 跟踪分类查看
trackCategoryView('category-slug')
```

## 🧪 测试和验证

### 测试页面

访问 `/ga-test` 页面进行配置测试：
- 检查环境配置
- 测试 GA 连接
- 验证事件发送

### 验证方法

1. **开发环境**：
   - GA 不会加载（这是正常的）
   - 测试页面会显示相应提示

2. **生产环境**：
   - 在浏览器开发者工具的 Network 标签中查看 GA 请求
   - 在 Google Analytics 实时报告中查看事件
   - 使用 GA Debugger 浏览器扩展

## 🔒 隐私和 GDPR 考虑

### 已实现的隐私保护

1. **环境控制**：只在生产环境加载
2. **条件加载**：检查 GA ID 是否设置
3. **用户控制**：可通过环境变量禁用

### 建议的额外措施

1. **Cookie 同意**：
   ```tsx
   // 示例：基于用户同意加载 GA
   {userConsent && process.env.NODE_ENV === 'production' && (
     <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
   )}
   ```

2. **数据匿名化**：
   ```tsx
   // 在 GA 配置中启用 IP 匿名化
   window.gtag('config', 'GA_MEASUREMENT_ID', {
     anonymize_ip: true
   })
   ```

## 📊 常用事件跟踪示例

### 页面组件中的使用

```tsx
'use client'
import { useEffect } from 'react'
import { trackBlessingView } from '@/types/analytics'

export default function BlessingPage({ blessing }) {
  useEffect(() => {
    // 跟踪页面查看
    trackBlessingView(blessing.slug, blessing.category)
  }, [blessing])

  return (
    // 组件内容
  )
}
```

### 按钮点击跟踪

```tsx
import { trackEvent } from '@/types/analytics'

const handleShare = (platform: string) => {
  trackBlessingShare(blessing.slug, platform)
  // 执行分享逻辑
}
```

## 🚀 部署注意事项

1. **设置真实 GA ID**：
   ```env
   NEXT_PUBLIC_GA_ID=G-YOUR-ACTUAL-ID
   ```

2. **验证配置**：
   - 部署后访问 `/ga-test` 页面
   - 检查 GA 实时报告
   - 确认事件正确发送

3. **移除测试页面**（可选）：
   - 在生产环境中可以删除 `/ga-test` 路由
   - 或添加访问限制

## 📝 文件结构

```
src/
├── app/
│   ├── layout.tsx          # GA 配置
│   └── ga-test/
│       └── page.tsx        # 测试页面
├── components/
│   └── GATestComponent.tsx # 测试组件
└── types/
    └── analytics.ts        # GA 类型和工具函数
```

## 🔧 故障排除

### 常见问题

1. **GA 不加载**：
   - 检查是否在生产环境
   - 验证 `NEXT_PUBLIC_GA_ID` 是否设置
   - 确认 GA ID 格式正确（G-XXXXXXXXXX）

2. **事件不显示**：
   - GA 事件可能需要几分钟才显示
   - 检查浏览器网络请求
   - 使用 GA 实时报告验证

3. **TypeScript 错误**：
   - 确保导入了正确的类型
   - 检查 `window.gtag` 类型检查

### 调试技巧

```tsx
// 添加调试日志
const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('GA Event:', { action, category, label, value })
  }
  
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

## 📚 相关资源

- [Next.js Third Parties 文档](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [Google Analytics 4 文档](https://developers.google.com/analytics/devguides/collection/ga4)
- [gtag.js 参考](https://developers.google.com/analytics/devguides/collection/gtagjs)

---

✅ **配置完成！** Google Analytics 已成功集成到您的 Next.js 项目中。