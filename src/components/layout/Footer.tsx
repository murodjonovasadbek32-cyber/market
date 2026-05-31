import Link from 'next/link'
import { Package, Instagram, Send, Youtube, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface-950 text-white">
      {/* Newsletter */}
      <div className="border-b border-surface-800">
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">📬 Yangiliklar va chegirmalar</h3>
              <p className="text-surface-400 text-sm">Maxsus takliflar va chegirmalardan birinchi xabardor bo'ling</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email manzilingiz..."
                className="flex-1 md:w-72 h-11 bg-surface-800 border border-surface-700 rounded-xl px-4 text-sm focus:outline-none focus:border-purple-500 text-white placeholder:text-surface-500"
              />
              <button className="h-11 px-5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition-colors whitespace-nowrap">
                Obuna bo'lish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Market<span className="text-purple-400">.uz</span></span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed mb-4">
              O'zbekistonning eng yirik va ishonchli online marketplace platformasi
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
                { icon: Send, href: '#', color: 'hover:text-blue-400' },
                { icon: Youtube, href: '#', color: 'hover:text-red-400' },
                { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`p-2 bg-surface-800 hover:bg-surface-700 rounded-xl transition-all ${social.color}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Xaridorlar uchun',
              links: [
                { label: 'Qanday xarid qilish', href: '/help/buying' },
                { label: 'Yetkazib berish', href: '/delivery' },
                { label: 'Qaytarish va almashtirish', href: '/returns' },
                { label: 'To\'lov usullari', href: '/payment' },
                { label: 'Bonus dasturi', href: '/bonus' },
                { label: 'Kuponlar', href: '/coupons' },
              ],
            },
            {
              title: 'Sotuvchilar uchun',
              links: [
                { label: 'Sotuvchi bo\'lish', href: '/seller/register' },
                { label: 'Seller kabineti', href: '/seller' },
                { label: 'Komissiya va tariflar', href: '/seller/pricing' },
                { label: 'Seller yordam', href: '/seller/help' },
                { label: 'API integratsiya', href: '/seller/api' },
              ],
            },
            {
              title: 'Kompaniya',
              links: [
                { label: 'Biz haqimizda', href: '/about' },
                { label: 'Yangiliklar', href: '/news' },
                { label: 'Karyera', href: '/careers' },
                { label: 'Hamkorlik', href: '/partners' },
                { label: 'Matbuot uchun', href: '/press' },
              ],
            },
            {
              title: 'Yordam',
              links: [
                { label: 'Yordam markazi', href: '/help' },
                { label: 'Buyurtmani kuzatish', href: '/track' },
                { label: 'Shikoyat va taklif', href: '/feedback' },
                { label: 'Maxfiylik siyosati', href: '/privacy' },
                { label: 'Foydalanish shartlari', href: '/terms' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4 text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-10 pt-8 border-t border-surface-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+998712345678" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-purple-400" />
                +998 71 234-56-78
              </a>
              <a href="mailto:info@market.uz" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-purple-400" />
                info@market.uz
              </a>
              <span className="flex items-center gap-2 text-sm text-surface-400">
                <MapPin className="h-4 w-4 text-purple-400" />
                Toshkent, O'zbekiston
              </span>
            </div>
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500">To'lov:</span>
              {['Visa', 'MC', 'Click', 'Payme', 'Uzum'].map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 bg-surface-800 text-surface-300 text-[10px] font-bold rounded-lg border border-surface-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-surface-500">
            <p>© 2024 Market.uz. Barcha huquqlar himoyalangan.</p>
            <p>O'zbekiston Respublikasi qonunlari asosida ishlaydi</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
