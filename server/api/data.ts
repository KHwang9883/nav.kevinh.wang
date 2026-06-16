import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { marked } from 'marked'

const dataDir = path.join(process.cwd(), 'data')

function loadYaml(filename: string): any {
  const filePath = path.join(dataDir, filename)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return yaml.load(content)
  }
  return []
}

function loadMarkdown(filename: string): string {
  const filePath = path.join(dataDir, filename)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return marked(content) as string
  }
  return ''
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default defineEventHandler(() => {
  // Load menu configuration
  const webstackConfig = loadYaml('webstack.yml') as any

  // Load all category data files
  const categoryData: Record<string, any[]> = {}
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.yml') && f !== 'webstack.yml')

  for (const file of dataFiles) {
    const key = file.replace('.yml', '')
    categoryData[key] = loadYaml(file) as any[]
  }

  // Build structured menu with data
  const menu = webstackConfig.menu.map((item: any) => {
    if (item.submenu) {
      return {
        ...item,
        submenu: item.submenu.map((sub: any) => ({
          ...sub,
          items: categoryData[sub.config] || [],
        })),
      }
    }
    if (item.config) {
      return {
        ...item,
        items: categoryData[item.config] || [],
      }
    }
    return item
  })

  // Build date for "最后更新"
  const buildDate = formatDate(new Date())

  // Process aboutPage - load markdown if specified
  const aboutPage = webstackConfig.aboutPage
  if (aboutPage?.website?.md) {
    aboutPage.website.html = loadMarkdown(aboutPage.website.md)
  }
  if (aboutPage?.webmaster?.md) {
    aboutPage.webmaster.html = loadMarkdown(aboutPage.webmaster.md)
  }

  return {
    title: 'Kevin Huang 的导航站',
    subtitle: '亲选软件与资源',
    favicon: webstackConfig.favicon,
    banner: webstackConfig.banner,
    logo: webstackConfig.logo,
    menu,
    about: webstackConfig.about,
    aboutPage,
    since: webstackConfig.since,
    lastUpdate: buildDate,
  }
})
