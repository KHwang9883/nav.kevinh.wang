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

interface MenuSubItem {
  name: string
  icon: string
  config: string
  items: NavItem[]
}

interface MenuItem {
  name: string
  icon: string
  config?: string
  items?: NavItem[]
  submenu?: MenuSubItem[]
}

interface NavData {
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

export const useNavData = () => {
  return useFetch<NavData>('/api/data', {
    key: 'nav-data',
    default: () => ({
      title: '',
      subtitle: '',
      favicon: '',
      banner: '',
      logo: { expanded: '', collapsed: '', dark: '' },
      menu: [],
      about: { url: '', icon: '', name: '' },
      aboutPage: {
        website: { head: '', html: '' },
        webmaster: { head: '', name: '', url: '', img: '', description: '', html: '' },
      },
      since: 2020,
      lastUpdate: '',
    }),
  })
}
