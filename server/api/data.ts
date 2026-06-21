import fs from 'fs'
import path from 'path'
import { load as yamlLoad } from 'js-yaml'
import { marked } from 'marked'

const dataDir = path.join(process.cwd(), 'data')
const IMG_BASE_URL = '/images/'

interface NavItem {
  name: string
  url: string
  img: string
  description: string
  foss?: boolean
  paid?: boolean
  affiliate?: boolean
  require_proxy?: 'required' | 'optional'
  hot?: boolean
  abandoned?: boolean
  winget?: string
}

function processImgUrl(img: string | undefined): string | undefined {
  if (!img) return img
  if (img.startsWith('/') || img.startsWith('http')) return img
  return IMG_BASE_URL + img
}

function processNavItemImg(item: NavItem): NavItem {
  return { ...item, img: processImgUrl(item.img)! }
}

function loadYaml(filename: string): any {
  const filePath = path.join(dataDir, filename)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return yamlLoad(content)
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
  const categoryData: Record<string, NavItem[]> = {}
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.yml') && f !== 'webstack.yml')

  for (const file of dataFiles) {
    const key = file.replace('.yml', '')
    const items = loadYaml(file) as NavItem[]
    // Process img field to add base URL
    categoryData[key] = items.map(processNavItemImg)
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
  // Process webmaster img URL
  if (aboutPage?.webmaster?.img) {
    aboutPage.webmaster.img = processImgUrl(aboutPage.webmaster.img)
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
