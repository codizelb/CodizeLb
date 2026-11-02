import { Code2, AppWindow, ShoppingCart, PenTool, Server, Wrench, Sparkles, ShoppingBag, LayoutDashboard, Globe, BarChart3, CalendarCheck, Boxes, Rocket, Shield, Zap, Database, Smartphone, Palette, Compass, Cpu, Linkedin, Github, Twitter, Instagram, Link as LinkIcon, type LucideIcon } from 'lucide-react'
/** Keys usable in the `icon` field (data files or admin dashboard). */
export const icons: Record<string, LucideIcon> = { code: Code2, app: AppWindow, cart: ShoppingCart, design: PenTool, server: Server, wrench: Wrench, bag: ShoppingBag, dashboard: LayoutDashboard, globe: Globe, chart: BarChart3, calendar: CalendarCheck, boxes: Boxes, rocket: Rocket, shield: Shield, zap: Zap, database: Database, mobile: Smartphone, palette: Palette, compass: Compass, cpu: Cpu }
export const getIcon = (n: string): LucideIcon => icons[n] || Sparkles
const social: Record<string, LucideIcon> = { linkedin: Linkedin, github: Github, twitter: Twitter, x: Twitter, instagram: Instagram }
export const getSocialIcon = (n: string): LucideIcon => social[n.toLowerCase()] || LinkIcon
