# 祝福墙功能设置指南

## 🚨 重要：必须先运行数据库迁移

在使用祝福墙功能之前，你需要在 Supabase 中创建必要的数据表。

### 方法 1: 使用 Supabase Dashboard (推荐)

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 创建一个新查询
5. 复制并粘贴 `supabase/migrations/20250101_create_wish_walls.sql` 文件的完整内容
6. 点击 **Run** 按钮执行 SQL

### 方法 2: 使用 Supabase CLI

如果你安装了 Supabase CLI：

```bash
# 确保你在项目根目录
cd /Users/yefu/codes/blessings

# 运行迁移
supabase db push
```

## 验证安装

运行迁移后，你应该在 Supabase 的 Table Editor 中看到以下新表：

- ✅ `wish_walls` - 祝福墙主表
- ✅ `wall_wishes` - 祝福消息表
- ✅ `wall_wish_likes` - 点赞记录表
- ✅ `wall_wish_replies` - 回复表

## 测试功能

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问创建页面：
   ```
   http://localhost:3000/wish/create
   ```

3. 填写表单并提交

## 常见错误

### 错误：relation "wish_walls" does not exist

**原因**: 数据库表还没有创建

**解决方案**: 按照上述步骤运行数据库迁移

### 错误：permission denied for table wish_walls

**原因**: RLS 策略可能有问题

**解决方案**: 确保 SQL 迁移文件中的 RLS 策略都已正确执行

### 错误：Failed to create wish wall

**解决方案**:
1. 检查浏览器控制台的详细错误信息
2. 确保所有必填字段都已填写
3. 验证 Supabase 连接配置正确

## 功能特点

- 🎨 3 种主题: Flowers, Starry Night, Gift Box
- 🔒 3 种隐私设置: Public, Link Only, Private
- 💬 祝福留言（支持表情、匿名）
- ❤️ 点赞功能
- 💭 回复功能
- 📤 社交分享（Facebook, Twitter, WhatsApp, LinkedIn）
- 📊 浏览量和祝福数统计
- 🌙 暗色主题支持

## 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 检查 Supabase Dashboard 中的 Logs
3. 确认数据库表已成功创建
