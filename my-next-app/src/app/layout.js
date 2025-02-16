import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SaaS Toko Sembako",
  description: "Kelola toko sembako Anda dengan mudah",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex h-screen">
          <nav className="w-64 bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">SaaS Sembako</h1>
            <ul>
              <li>
                <a href="/" className="block py-2">
                  Dasbor
                </a>
              </li>
              <li>
                <a href="/warehouse" className="block py-2">
                  Gudang
                </a>
              </li>
              <li>
                <a href="/cashier" className="block py-2">
                  Kasir
                </a>
              </li>
              <li>
                <a href="/store-info" className="block py-2">
                  Info Toko
                </a>
              </li>
            </ul>
          </nav>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

