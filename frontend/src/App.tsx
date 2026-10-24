import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays, ChevronDown,
  ChevronRight, CircleHelp, Command, Download, ExternalLink, FileChartColumnIncreasing,
  Filter, Home, MapPin, Menu, Search, Settings2, SlidersHorizontal, Sparkles, Wallet,
  X, TrendingUp
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import type { Developer, Project } from './types'

const fallbackDevelopers: Developer[] = [
  { id: 'vinhomes', name: 'Vinhomes', projects: [
    { id: 'vinhomes-central-park', name: 'Vinhomes Central Park' },
    { id: 'vinhomes-grand-park', name: 'Vinhomes Grand Park' },
    { id: 'vinhomes-ocean-park', name: 'Vinhomes Ocean Park' },
    { id: 'vinhomes-smart-city', name: 'Vinhomes Smart City' }
  ]},
  { id: 'novaland', name: 'Novaland Group', projects: [
    { id: 'aqua-city', name: 'Aqua City' },
    { id: 'the-grand-manhattan', name: 'The Grand Manhattan' },
    { id: 'novaworld-phan-thiet', name: 'NovaWorld Phan Thiet' }
  ]}
]

const fallbackProjects: Project[] = [
  { id: 'vinhomes-central-park', name: 'Vinhomes Central Park', developerId: 'vinhomes', location: 'Binh Thanh, Ho Chi Minh City', district: 'Binh Thanh', category: 'Luxury riverside township', status: 'Completed', description: 'A landmark riverside residential development with extensive amenities and direct access to the city’s central business areas.', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 112, rentPerMonth: 22, sizeRange: '50–150 m²', handover: '2018', amenities: ['Landmark 81', 'Riverside park', 'Shopping', 'Schools'], priceHistory: [{month:'May',price:101},{month:'Jun',price:103},{month:'Jul',price:104},{month:'Aug',price:107},{month:'Sep',price:109},{month:'Oct',price:112}] },
  { id: 'vinhomes-grand-park', name: 'Vinhomes Grand Park', developerId: 'vinhomes', location: 'Thu Duc City, Ho Chi Minh City', district: 'Thu Duc', category: 'Large-scale township', status: 'Established', description: 'A large integrated township with residential towers, green spaces, retail, and community facilities in eastern Ho Chi Minh City.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 62, rentPerMonth: 9.5, sizeRange: '30–100 m²', handover: '2020 onward', amenities: ['Grand Park', 'Retail', 'Schools', 'Sports facilities'], priceHistory: [{month:'May',price:58},{month:'Jun',price:59},{month:'Jul',price:60},{month:'Aug',price:60},{month:'Sep',price:61},{month:'Oct',price:62}] },
  { id: 'vinhomes-ocean-park', name: 'Vinhomes Ocean Park', developerId: 'vinhomes', location: 'Gia Lam, Hanoi', district: 'Gia Lam', category: 'Integrated township', status: 'Established', description: 'A master-planned residential township in the Hanoi metropolitan area.', image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 58, rentPerMonth: 8.5, sizeRange: '28–120 m²', handover: '2020 onward', amenities: ['Lakeside spaces', 'Retail', 'Schools'], priceHistory: [{month:'May',price:53},{month:'Jun',price:54},{month:'Jul',price:55},{month:'Aug',price:56},{month:'Sep',price:57},{month:'Oct',price:58}] },
  { id: 'vinhomes-smart-city', name: 'Vinhomes Smart City', developerId: 'vinhomes', location: 'Nam Tu Liem, Hanoi', district: 'Nam Tu Liem', category: 'Smart urban township', status: 'Established', description: 'A large urban development in western Hanoi with apartment communities and shared amenities.', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 68, rentPerMonth: 9, sizeRange: '28–100 m²', handover: '2020 onward', amenities: ['Parks', 'Retail', 'Schools'], priceHistory: [{month:'May',price:62},{month:'Jun',price:63},{month:'Jul',price:64},{month:'Aug',price:65},{month:'Sep',price:67},{month:'Oct',price:68}] },
  { id: 'aqua-city', name: 'Aqua City', developerId: 'novaland', location: 'Bien Hoa, Dong Nai', district: 'Bien Hoa', category: 'Eco township', status: 'In development', description: 'A large-scale planned township east of Ho Chi Minh City. Verify current legal and construction status before investment decisions.', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 42, rentPerMonth: 0, sizeRange: '80–200 m² equivalent', handover: 'Project-dependent', amenities: ['Planned green spaces', 'Waterfront setting'], priceHistory: [{month:'May',price:43},{month:'Jun',price:42},{month:'Jul',price:41},{month:'Aug',price:41},{month:'Sep',price:42},{month:'Oct',price:42}] },
  { id: 'the-grand-manhattan', name: 'The Grand Manhattan', developerId: 'novaland', location: 'District 1, Ho Chi Minh City', district: 'District 1', category: 'Central luxury residences', status: 'Check current status', description: 'A central-city residential project. Confirm completion, legal documentation, and current availability with reliable sources.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 180, rentPerMonth: 0, sizeRange: 'Project-dependent', handover: 'Verify current status', amenities: ['Central location', 'Urban services'], priceHistory: [{month:'May',price:176},{month:'Jun',price:178},{month:'Jul',price:177},{month:'Aug',price:179},{month:'Sep',price:180},{month:'Oct',price:180}] },
  { id: 'novaworld-phan-thiet', name: 'NovaWorld Phan Thiet', developerId: 'novaland', location: 'Phan Thiet, Binh Thuan', district: 'Phan Thiet', category: 'Integrated tourism township', status: 'Check current status', description: 'A large tourism and residential development; property types and returns differ from conventional apartments.', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=85', pricePerSqm: 38, rentPerMonth: 0, sizeRange: 'Varies by property type', handover: 'Project-dependent', amenities: ['Leisure facilities', 'Coastal setting'], priceHistory: [{month:'May',price:40},{month:'Jun',price:39},{month:'Jul',price:38},{month:'Aug',price:37},{month:'Sep',price:38},{month:'Oct',price:38}] }
]

const formatBillion = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} tr/m²`
const money = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} triệu`
const currencyTooltip = (n: number) => `${n} triệu VND/m²`
const changePct = (p: Project) => ((p.priceHistory[p.priceHistory.length - 1].price / p.priceHistory[0].price - 1) * 100)

export default function App() {
  const [developers, setDevelopers] = useState<Developer[]>(fallbackDevelopers)
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [activeId, setActiveId] = useState('vinhomes-central-park')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ vinhomes: true, novaland: true })
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>(['vinhomes-central-park', 'vinhomes-grand-park'])
  const [showCalculator, setShowCalculator] = useState(false)
  const [purchasePrice, setPurchasePrice] = useState(5000)
  const [monthlyRent, setMonthlyRent] = useState(20)
  const [expenses, setExpenses] = useState(15)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/developers`).then(r => r.ok ? r.json() : Promise.reject()).then(setDevelopers).catch(() => {})
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/projects`).then(r => r.ok ? r.json() : Promise.reject()).then((data: Project[]) => { if (data.length) setProjects(data) }).catch(() => {})
  }, [])

  const filteredDevelopers = useMemo(() => developers.map(d => ({ ...d, projects: d.projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) })).filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.projects.length), [developers, query])
  const activeProject = projects.find(p => p.id === activeId) ?? projects[0]
  const isSample = true
  const annualNetRent = monthlyRent * 12 * (1 - expenses / 100)
  const yieldPct = purchasePrice > 0 ? annualNetRent / purchasePrice * 100 : 0

  const selectProject = (id: string) => { setActiveId(id); setCompareMode(false); setMobileNav(false) }
  const toggleCompare = (id: string) => setCompareIds(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id].slice(-4))

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Building2 size={22}/></div>
          <div><div className="brand-name">estate<span>intel</span></div><div className="brand-sub">VIETNAM PROPERTY ANALYTICS</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-label">WORKSPACE <span>DEMO</span></div>
        <button className={`nav-item ${!compareMode && activeId === '' ? 'active' : ''}`} onClick={() => { setCompareMode(false); setActiveId('') }}>
          <Home size={17}/><span>Overview</span>
        </button>
        <div className="nav-heading"><span>DEVELOPERS & PROJECTS</span><button className="icon-button" title="Filter projects"><SlidersHorizontal size={15}/></button></div>
        <label className="search-box"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a project..." /><kbd>⌘ K</kbd></label>
        <div className="project-tree">
          {filteredDevelopers.map(dev => <section className="developer-group" key={dev.id}>
            <button className="developer-toggle" onClick={() => setExpanded(prev => ({ ...prev, [dev.id]: !prev[dev.id] }))}>
              {expanded[dev.id] ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}<Building2 size={16}/><span>{dev.name}</span><span className="project-count">{dev.projects.length}</span>
            </button>
            {expanded[dev.id] && <div className="project-list">{dev.projects.map(p => <button key={p.id} className={`project-nav ${activeId === p.id && !compareMode ? 'selected' : ''}`} onClick={() => selectProject(p.id)} title={p.name}><span className="project-dot"/><span>{p.name.replace('Vinhomes ', '')}</span></button>)}</div>}
          </section>)}
          {!filteredDevelopers.length && <div className="empty-search">No matching projects</div>}
        </div>
        <div className="sidebar-bottom">
          <div className="data-status"><span className="status-dot"/><div><b>Sample dataset</b><small>Illustrative values only</small></div></div>
          <button className="nav-item" onClick={() => setShowCalculator(true)}><Settings2 size={17}/><span>Investment calculator</span></button>
          <button className="nav-item" onClick={() => setCompareMode(true)}><FileChartColumnIncreasing size={17}/><span>Compare projects</span></button>
          <div className="user-profile"><div className="avatar">EI</div><div><b>Analyst workspace</b><small>Local demo</small></div><CircleHelp size={17} className="muted-icon"/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <span>{compareMode ? 'Project comparison' : activeProject?.name ?? 'Overview'}</span></div></div>
          <div className="top-actions"><div className="date-pill"><CalendarDays size={15}/> Oct 2026</div><button className="icon-button notification" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">EI</div></div>
        </header>

        {compareMode ? <section className="page-content">
          <div className="page-intro"><div><div className="eyebrow"><Activity size={14}/> MARKET INTELLIGENCE</div><h1>Compare projects<span>.</span></h1><p>Benchmark asking-price indicators across developments.</p></div><button className="button button-primary" onClick={() => setCompareMode(false)}>Back to project <ExternalLink size={15}/></button></div>
          <div className="compare-grid">{projects.filter(p => compareIds.includes(p.id)).map(p => <article className="compare-card" key={p.id}><img src={p.image} alt="" /><div className="compare-card-body"><span className="eyebrow">{developers.find(d => d.id === p.developerId)?.name}</span><h3>{p.name}</h3><div className="compare-price">{money(p.pricePerSqm)} <small>VND/m²</small></div><p>{p.location}</p><div className="compare-stat"><span>Indicative price change</span><b className={changePct(p) >= 0 ? 'positive' : 'negative'}>{changePct(p) >= 0 ? '+' : ''}{changePct(p).toFixed(1)}%</b></div><button className="text-button" onClick={() => selectProject(p.id)}>Open project <ChevronRight size={15}/></button></div></article>)}</div>
          <div className="panel compare-picker"><div className="panel-heading"><div><h3>Choose projects</h3><p>Select up to four projects to compare.</p></div><span className="pill">{compareIds.length}/4 selected</span></div><div className="picker-list">{projects.map(p => <label key={p.id} className="picker-option"><input type="checkbox" checked={compareIds.includes(p.id)} onChange={() => toggleCompare(p.id)} disabled={!compareIds.includes(p.id) && compareIds.length >= 4}/><span>{p.name}</span><small>{money(p.pricePerSqm)}/m²</small></label>)}</div></div>
        </section> : !activeProject || activeId === '' ? <section className="page-content">
          <div className="page-intro"><div><div className="eyebrow"><Sparkles size={14}/> YOUR MARKET WORKSPACE</div><h1>Property intelligence<span>.</span></h1><p>A single workspace to explore Vietnam’s residential developments.</p></div><button className="button button-primary" onClick={() => setCompareMode(true)}>Compare projects <FileChartColumnIncreasing size={16}/></button></div>
          <div className="welcome-banner"><div><span className="eyebrow light">MARKET EXPLORER</span><h2>See the market<br/>from every angle.</h2><p>Compare developments, understand pricing, and model rental returns.</p><button className="button button-light" onClick={() => selectProject('vinhomes-central-park')}>Explore projects <ChevronRight size={16}/></button></div><div className="banner-art"><div className="banner-sun"/><div className="tower tower-one"/><div className="tower tower-two"/><div className="tower tower-three"/><div className="banner-ground"/></div></div>
          <div className="section-title"><div><h2>Projects at a glance</h2><p>Illustrative asking-price indicators · not verified market data</p></div><span className="pill">{projects.length} projects</span></div>
          <div className="overview-grid">{projects.map(p => <button className="overview-card" key={p.id} onClick={() => selectProject(p.id)}><img src={p.image} alt="" /><div className="overview-card-content"><span className="eyebrow">{developers.find(d => d.id === p.developerId)?.name}</span><h3>{p.name}</h3><p><MapPin size={13}/>{p.location}</p><div className="overview-card-footer"><b>{money(p.pricePerSqm)} <small>/m²</small></b><span className={changePct(p) >= 0 ? 'positive' : 'negative'}>{changePct(p) >= 0 ? '+' : ''}{changePct(p).toFixed(1)}%</span></div></div></button>)}</div>
        </section> : <section className="page-content">
          <div className="page-intro"><div><div className="eyebrow"><span className="live-dot"/> PROJECT INTELLIGENCE <span className="eyebrow-separator">/</span> {developers.find(d => d.id === activeProject.developerId)?.name.toUpperCase()}</div><h1>{activeProject.name}<span>.</span></h1><p><MapPin size={15}/>{activeProject.location} <span className="meta-separator">·</span> {activeProject.category}</p></div><div className="intro-actions"><button className="button button-secondary" onClick={() => { setCompareMode(true); toggleCompare(activeProject.id) }}><FileChartColumnIncreasing size={15}/> Compare</button><button className="button button-primary" onClick={() => setShowCalculator(true)}><Wallet size={15}/> Analyze returns</button></div></div>
          <div className="project-hero"><img src={activeProject.image} alt={`${activeProject.name} project`} /><div className="hero-overlay"/><div className="hero-copy"><span className="hero-status"><span className="status-dot"/> {activeProject.status}</span><h2>{activeProject.name}</h2><p>{activeProject.description}</p><div className="hero-tags">{activeProject.amenities.slice(0,4).map(a => <span key={a}>{a}</span>)}</div></div><div className="hero-meta"><div><small>PROPERTY TYPE</small><b>{activeProject.category}</b></div><div><small>SIZE RANGE</small><b>{activeProject.sizeRange}</b></div><div><small>HANDOVER</small><b>{activeProject.handover}</b></div></div></div>
          <div className="metric-grid">
            <article className="metric-card"><div className="metric-top"><span>Indicative asking price</span><span className="metric-icon green"><Building2 size={17}/></span></div><div className="metric-value">{money(activeProject.pricePerSqm)}<small>VND/m²</small></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={14}/>{changePct(activeProject).toFixed(1)}%</span><span>over sample period</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Monthly rent estimate</span><span className="metric-icon blue"><Wallet size={17}/></span></div><div className="metric-value">{activeProject.rentPerMonth ? money(activeProject.rentPerMonth) : 'N/A'}<small>{activeProject.rentPerMonth ? 'VND/m²/mo' : 'not supplied'}</small></div><div className="metric-foot"><span>Indicative only</span><span>before expenses</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Gross rental yield</span><span className="metric-icon amber"><TrendingUp size={17}/></span></div><div className="metric-value">{activeProject.rentPerMonth ? (activeProject.rentPerMonth * 12 / activeProject.pricePerSqm * 100).toFixed(2) + '%' : 'N/A'}</div><div className="metric-foot"><span>Calculated estimate</span><span>annual rent / price</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Price trend</span><span className="metric-icon purple"><Activity size={17}/></span></div><div className="metric-value">{changePct(activeProject) >= 0 ? '+' : ''}{changePct(activeProject).toFixed(1)}<small>%</small></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={14}/>Sample trend</span><span>6 observations</span></div></article>
          </div>
          <div className="analytics-grid">
            <article className="panel price-panel"><div className="panel-heading"><div><h3>Asking price trend</h3><p>Illustrative monthly price observations</p></div><button className="icon-button" title="Chart options"><Filter size={17}/></button></div><div className="chart-legend"><span/><b>Indicative price</b><small>million VND/m²</small></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activeProject.priceHistory} margin={{top:10,right:12,left:-12,bottom:0}}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2D7B5C" stopOpacity={0.2}/><stop offset="95%" stopColor="#2D7B5C" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#E9EDE9"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#8A9690',fontSize:12}} dy={10}/><YAxis domain={['dataMin - 5','dataMax + 5']} axisLine={false} tickLine={false} tick={{fill:'#8A9690',fontSize:11}}/><Tooltip formatter={(value) => [currencyTooltip(Number(value)), 'Asking price']} contentStyle={{borderRadius:10,border:'1px solid #E6EAE6',fontSize:12}}/><Area type="monotone" dataKey="price" stroke="#2D7B5C" strokeWidth={2.5} fill="url(#priceFill)" activeDot={{r:5,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div><div className="chart-note"><Activity size={14}/> Sample values only. Replace with sourced, dated observations before investment use.</div></article>
            <article className="panel facts-panel"><div className="panel-heading"><div><h3>Project snapshot</h3><p>Key details at a glance</p></div></div><div className="fact-list"><div><span>Developer</span><b>{developers.find(d => d.id === activeProject.developerId)?.name}</b></div><div><span>Location</span><b>{activeProject.location}</b></div><div><span>Development status</span><b><span className="status-inline"/>{activeProject.status}</b></div><div><span>Typical unit size</span><b>{activeProject.sizeRange}</b></div><div><span>Handover</span><b>{activeProject.handover}</b></div></div><div className="insight-box"><Sparkles size={17}/><div><b>Analyst note</b><p>{activeProject.rentPerMonth ? `At the sample price and rent inputs, gross yield is ${(activeProject.rentPerMonth * 12 / activeProject.pricePerSqm * 100).toFixed(2)}%. Net yield will be lower after vacancy, fees, maintenance, and taxes.` : 'Rental inputs are unavailable in this sample. Add a verified rent estimate to evaluate income returns.'}</p></div></div><button className="button button-secondary full-width" onClick={() => setShowCalculator(true)}>Open investment calculator <ChevronRight size={15}/></button></article>
          </div>
          <div className="bottom-grid"><article className="panel"><div className="panel-heading"><div><h3>Comparable projects</h3><p>Browse other developments in the dataset</p></div><button className="text-button" onClick={() => setCompareMode(true)}>Compare all <ChevronRight size={15}/></button></div><div className="comparable-list">{projects.filter(p => p.id !== activeProject.id).slice(0,3).map(p => <button className="comparable-row" key={p.id} onClick={() => selectProject(p.id)}><img src={p.image} alt=""/><span className="comparable-name"><b>{p.name}</b><small>{p.location}</small></span><span className="comparable-price">{money(p.pricePerSqm)}<small>/m²</small></span><ChevronRight size={16}/></button>)}</div></article><article className="panel"><div className="panel-heading"><div><h3>Investment checklist</h3><p>Before making a decision</p></div></div><div className="checklist"><div><span className="check-icon"><Activity size={15}/></span><span><b>Verify market pricing</b><small>Compare recent listings and closed transactions.</small></span></div><div><span className="check-icon"><FileChartColumnIncreasing size={15}/></span><span><b>Review legal status</b><small>Confirm ownership, permits, and project documents.</small></span></div><div><span className="check-icon"><Wallet size={15}/></span><span><b>Model all costs</b><small>Include taxes, fees, vacancy, and financing.</small></span></div></div></article></div>
        </section>}
        <footer className="footer"><span>ESTATE INTELLIGENCE <i/> VIETNAM</span><span>Demo analytics · Not financial advice</span></footer>
      </main>

      {showCalculator && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowCalculator(false) }}><section className="calculator-modal"><div className="modal-heading"><div><span className="eyebrow">INVESTMENT TOOLS</span><h2>Rental yield calculator</h2><p>Adjust assumptions to estimate annual net rental yield.</p></div><button className="icon-button" onClick={() => setShowCalculator(false)} aria-label="Close calculator"><X size={19}/></button></div><label className="field-label">Total purchase price <span>(million VND)</span><input type="number" min="1" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))}/></label><label className="field-label">Monthly rental income <span>(million VND)</span><input type="number" min="0" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))}/></label><label className="field-label">Operating expense + vacancy <span>({expenses}%)</span><input type="range" min="0" max="50" value={expenses} onChange={e => setExpenses(Number(e.target.value))}/></label><div className="yield-result"><span>Estimated annual net yield</span><strong>{yieldPct.toFixed(2)}%</strong><small>{money(annualNetRent)} VND/year net income · before financing and acquisition taxes</small></div><p className="modal-disclaimer">This is a simplified estimate based on your inputs, not a forecast. Confirm rental comparables, fees, taxes, and financing terms independently.</p><button className="button button-primary full-width" onClick={() => setShowCalculator(false)}>Done</button></section></div>}
    </div>
  )
}