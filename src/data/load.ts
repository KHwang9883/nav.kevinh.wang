import fs from 'fs'
import path from 'path'
import { load as yamlLoad } from 'js-yaml'
import { marked } from 'marked'
import type { NavItem, NavData } from './types'

const dataDir = path.join(process.cwd(), 'data')
const IMG_BASE_URL = '/images/'

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
  // 显式使用 Asia/Shanghai 时区（GMT+8），避免 CI 环境时区差异导致日期偏差
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' })
}

export function getNavData(): NavData {
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
}
