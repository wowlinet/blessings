# Next.js 拦截路由实现祝福语详情页面模态框技术文档

## 1. 架构设计

### 1.1 拦截路由架构图

```mermaid
graph TD
    A[用户点击祝福语链接] --> B{路由类型判断}
    B -->|客户端导航| C[拦截路由 (..)blessings/[id]]
    B -->|直接访问/刷新| D[常规路由 blessings/[id]]
    C --> E[模态框展示]
    D --> F[完整页面展示]
    E --> G[背景页面保持不变]
    F --> H[新页面加载]
    
    subgraph "拦截路由层"
        C
        E
        G
    end
    
    subgraph "常规路由层"
        D
        F
        H
    end
```

### 1.2 文件结构设计

```
src/app/
├── page.tsx                          # 首页
├── layout.tsx                        # 根布局
├── @modal/                           # 并行路由插槽
│   ├── default.tsx                   # 默认空状态
│   └── (..)blessings/                # 拦截路由
│       └── [id]/
│           └── page.tsx              # 模态框页面
├── blessings/                        # 常规路由
│   └── [id]/
│       └── page.tsx                  # 完整页面
└── components/
    ├── BlessingModal.tsx             # 模态框组件
    └── BlessingDetail.tsx            # 详情内容组件
```

## 2. 拦截路由实现方案

### 2.1 根布局配置

需要在根布局中添加并行路由插槽来支持模态框：

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

### 2.2 拦截路由配置

创建拦截路由来捕获从其他页面导航到详情页的请求：

```typescript
// src/app/@modal/(..)blessings/[id]/page.tsx
import { getBlessingById } from '@/lib/supabase'
import BlessingModal from '@/components/BlessingModal'
import { notFound } from 'next/navigation'

interface InterceptedBlessingPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InterceptedBlessingPage({ 
  params 
}: InterceptedBlessingPageProps) {
  try {
    const { id } = await params
    const blessing = await getBlessingById(id)
    
    if (!blessing) {
      notFound()
    }

    return <BlessingModal blessing={blessing} />
  } catch (error) {
    console.error('Error loading blessing in modal:', error)
    notFound()
  }
}
```

### 2.3 默认插槽状态

```typescript
// src/app/@modal/default.tsx
export default function Default() {
  return null
}
```

## 3. 模态框组件设计

### 3.1 核心模态框组件

```typescript
// src/components/BlessingModal.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import BlessingDetail from './BlessingDetail'
import { Blessing } from '@/types'

interface BlessingModalProps {
  blessing: Blessing
}

export default function BlessingModal({ blessing }: BlessingModalProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟显示以触发动画
    const timer = setTimeout(() => setIsVisible(true), 10)
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden'
    
    // 键盘事件监听
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // 等待动画完成后关闭
    setTimeout(() => {
      router.back()
    }, 200)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible 
          ? 'bg-black/60 backdrop-blur-sm' 
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-200 ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="关闭模态框"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* 内容区域 */}
        <div className="overflow-y-auto max-h-[90vh] rounded-2xl">
          <BlessingDetail blessing={blessing} isModal={true} />
        </div>
      </div>
    </div>
  )
}
```

### 3.2 详情组件适配

需要修改 `BlessingDetail` 组件以支持模态框模式：

```typescript
// src/components/BlessingDetail.tsx 部分修改
interface BlessingDetailProps {
  blessing: Blessing
  isModal?: boolean
}

export default function BlessingDetail({ 
  blessing, 
  isModal = false 
}: BlessingDetailProps) {
  // ... 现有逻辑

  return (
    <article className={`${
      isModal 
        ? 'bg-white dark:bg-gray-900' 
        : 'bg-white dark:bg-gray-900 rounded-2xl shadow-lg'
    } overflow-hidden`}>
      {/* 头部区域 - 模态框模式下调整样式 */}
      <div className={`${
        isModal 
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6' 
          : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8'
      }`}>
        {/* ... 现有头部内容 */}
      </div>

      {/* 内容区域 */}
      <div className={isModal ? 'p-6' : 'p-8'}>
        {/* ... 现有内容 */}
      </div>
    </article>
  )
}
```

## 4. 路由结构和文件组织

### 4.1 完整文件结构

```
src/app/
├── layout.tsx                        # 根布局（支持并行路由）
├── page.tsx                          # 首页
├── @modal/                           # 并行路由插槽
│   ├── default.tsx                   # 默认空状态
│   └── (..)blessings/                # 拦截路由（..表示上两级）
│       └── [id]/
│           └── page.tsx              # 拦截的模态框页面
├── blessings/                        # 常规路由
│   └── [id]/
│       └── page.tsx                  # 完整页面（直接访问/刷新时使用）
└── components/
    ├── BlessingModal.tsx             # 模态框容器组件
    ├── BlessingDetail.tsx            # 详情内容组件（共享）
    └── BlessingCard.tsx              # 卡片组件（包含链接）
```

### 4.2 路由匹配规则

| 访问方式 | 匹配路由 | 展示效果 |
|---------|---------|---------|
| 客户端导航（点击链接） | `@modal/(..)blessings/[id]` | 模态框展示 |
| 直接访问URL | `blessings/[id]` | 完整页面 |
| 页面刷新 | `blessings/[id]` | 完整页面 |
| 浏览器后退 | 关闭模态框 | 返回上一页 |

### 4.3 链接配置

确保所有指向详情页的链接使用正确的路径：

```typescript
// src/components/BlessingCard.tsx
<Link 
  href={`/blessings/${blessing.id}`}
  className="block group"
>
  {/* 卡片内容 */}
</Link>
```

## 5. 动画效果和用户体验优化

### 5.1 进入动画

```css
/* 模态框进入动画 */
.modal-enter {
  opacity: 0;
  transform: scale(0.95) translateY(16px);
  backdrop-filter: blur(0px);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1) translateY(0);
  backdrop-filter: blur(8px);
  transition: all 200ms ease-out;
}
```

### 5.2 退出动画

```css
/* 模态框退出动画 */
.modal-exit {
  opacity: 1;
  transform: scale(1) translateY(0);
  backdrop-filter: blur(8px);
}

.modal-exit-active {
  opacity: 0;
  transform: scale(0.95) translateY(16px);
  backdrop-filter: blur(0px);
  transition: all 200ms ease-in;
}
```

### 5.3 用户体验优化

1. **键盘支持**
   - ESC 键关闭模态框
   - Tab 键焦点管理

2. **无障碍访问**
   - 适当的 ARIA 标签
   - 焦点陷阱（Focus Trap）
   - 屏幕阅读器支持

3. **性能优化**
   - 懒加载模态框内容
   - 预加载相关资源
   - 虚拟滚动（长内容）

4. **响应式设计**
   - 移动端适配
   - 触摸手势支持
   - 安全区域适配

## 6. 与现有功能的兼容性考虑

### 6.1 SEO 兼容性

- 保持原有的完整页面路由用于 SEO
- 模态框不影响页面的元数据
- 确保搜索引擎可以正常抓取内容

### 6.2 分享功能兼容

```typescript
// 分享功能需要使用完整URL
const shareUrl = `${window.location.origin}/blessings/${blessing.id}`
```

### 6.3 收藏功能兼容

- 模态框中的收藏功能与完整页面保持一致
- 状态同步和更新机制不变

### 6.4 深度链接支持

- 直接访问 `/blessings/[id]` 显示完整页面
- 支持浏览器前进后退
- URL 状态正确更新

### 6.5 错误处理

```typescript
// 统一的错误处理机制
try {
  const blessing = await getBlessingById(id)
  if (!blessing) {
    notFound() // 两种路由都使用相同的错误处理
  }
} catch (error) {
  console.error('Error loading blessing:', error)
  notFound()
}
```

## 7. 实施步骤

### 7.1 第一阶段：基础结构
1. 修改根布局支持并行路由
2. 创建 `@modal` 目录结构
3. 实现基础拦截路由

### 7.2 第二阶段：模态框组件
1. 开发 `BlessingModal` 组件
2. 添加动画效果
3. 实现关闭功能

### 7.3 第三阶段：用户体验优化
1. 添加键盘支持
2. 优化动画性能
3. 移动端适配

### 7.4 第四阶段：测试和优化
1. 功能测试
2. 性能测试
3. 兼容性测试

## 8. 技术要点总结

1. **拦截路由语法**：`(..)` 表示上两级目录的拦截
2. **并行路由**：使用 `@modal` 插槽实现模态框
3. **状态管理**：通过 `useRouter().back()` 管理模态框状态
4. **动画实现**：CSS transition + React state 控制
5. **兼容性**：保持原有路由结构不变，仅添加拦截层

这种实现方式既保持了良好的用户体验，又确保了 SEO 友好性和功能完整性。