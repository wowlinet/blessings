/**
 * 检查祝福墙相关数据表是否存在
 * 运行: node scripts/check-wish-wall-tables.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://pohyvwtrdxcutzljipuu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaHl2d3RyZHhjdXR6bGppcHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTMzMDMsImV4cCI6MjA3NjA4OTMwM30.2yKiNlEX0OAv3QUh9ps3v4zkVi1W6Fcu6oyf_apOLK8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('🔍 检查祝福墙数据表...\n')

  const tables = [
    'wish_walls',
    'wall_wishes',
    'wall_wish_likes',
    'wall_wish_replies'
  ]

  let allTablesExist = true

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ 表 "${table}" 不存在`)
          allTablesExist = false
        } else if (error.code === 'PGRST116') {
          console.log(`✅ 表 "${table}" 存在 (空表)`)
        } else {
          console.log(`⚠️  表 "${table}" 检查出错: ${error.message}`)
          allTablesExist = false
        }
      } else {
        console.log(`✅ 表 "${table}" 存在`)
      }
    } catch (err) {
      console.log(`❌ 检查表 "${table}" 时出错:`, err.message)
      allTablesExist = false
    }
  }

  console.log('\n' + '='.repeat(50))

  if (allTablesExist) {
    console.log('✅ 所有祝福墙数据表都已创建！')
    console.log('\n你可以开始使用祝福墙功能了！')
  } else {
    console.log('❌ 部分或全部数据表缺失！')
    console.log('\n请按照以下步骤创建数据表：')
    console.log('1. 访问 https://app.supabase.com')
    console.log('2. 选择你的项目')
    console.log('3. 点击 "SQL Editor"')
    console.log('4. 运行 supabase/migrations/20250101_create_wish_walls.sql 文件内容')
    console.log('\n详细说明请查看 WISH_WALL_SETUP.md 文件')
  }

  console.log('='.repeat(50) + '\n')
}

checkTables().catch(err => {
  console.error('检查过程出错:', err)
  process.exit(1)
})
