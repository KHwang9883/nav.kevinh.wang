export interface NavItem {
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
  pup?: boolean
  winget?: string
}

export interface MenuSubItem {
  name: string
  nameAlt?: string
  icon: string
  config: string
  description?: string
  items: NavItem[]
}

export interface MenuItem {
  name: string
  nameAlt?: string
  icon: string
  config?: string
  description?: string
  items?: NavItem[]
  submenu?: MenuSubItem[]
}

export interface NavData {
  title: string
  subtitle: string
  favicon: string
  banner: string
  logo: {
    expanded: string
    collapsed: string
    dark: string
  }
  menu: MenuItem[]
  about: {
    url: string
    icon: string
    name: string
  }
  aboutPage: {
    website: {
      head: string
      md?: string
      html: string
    }
    webmaster: {
      head: string
      name: string
      url: string
      img: string
      description: string
      md?: string
      html?: string
    }
  }
  since: number
  lastUpdate?: string
}
