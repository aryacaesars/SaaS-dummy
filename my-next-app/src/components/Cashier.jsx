"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatRupiah, saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import Login from "./Login"

export default function Cashier() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cart, setCart] = useState([])
  const [receipt, setReceipt] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentCashier, setCurrentCashier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [change, setChange] = useState(0)
  const [qrCodeValue, setQrCodeValue] = useState("")

  useEffect(() => {
    const storedProducts = getFromLocalStorage("products") || []
    setProducts(storedProducts)
    const storedCashier = getFromLocalStorage("currentCashier")
    if (storedCashier) {
      setCurrentCashier(storedCashier)
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [searchTerm, products])

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const changeAmount = Number.parseFloat(amountPaid) - total
    setChange(changeAmount > 0 ? changeAmount : 0)
  }, [amountPaid, cart])

  const handleLogin = (cashier) => {
    setIsLoggedIn(true)
    setCurrentCashier(cashier)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentCashier(null)
    saveToLocalStorage("currentCashier", null)
    setCart([])
    setSearchTerm("")
    setFilteredProducts([])
    setPaymentMethod("cash")
    setAmountPaid("")
    setChange(0)
    setQrCodeValue("")
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(
        (item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateCartItemQuantity = (id, quantity) => {
    setCart(cart.map(
      (item) => (item.id === id ? { ...item, quantity: Number.parseInt(quantity) || 0 } : item)
    ))
  }

  const processTransaction = () => {
    if (!currentCashier) {
      alert("Mohon login terlebih dahulu")
      return
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (paymentMethod === "cash" && Number.parseFloat(amountPaid) < total) {
      alert("Jumlah pembayaran kurang")
      return
    }

    if (paymentMethod === "qris") {
      // Generate QR code value (in real scenario, this would be provided by a payment gateway)
      const qrValue = `QRIS:${Date.now()}:${total}`
      setQrCodeValue(qrValue)
      return
    }

    const receiptData = {
      items: cart,
      total,
      date: new Date().toLocaleString("id-ID"),
      cashier: currentCashier.name,
      storeName: getFromLocalStorage("storeInfo")?.name || "Toko Sembako",
      paymentMethod,
      amountPaid: paymentMethod === "cash" ? Number.parseFloat(amountPaid) : total,
      change: paymentMethod === "cash" ? change : 0,
    }
    setReceipt(receiptData)

    // Update stock and financial data
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })
    setProducts(updatedProducts)
    saveToLocalStorage("products", updatedProducts)

    const financialData = getFromLocalStorage("financialData") || { revenue: 0, expenses: 0, profit: 0 }
    financialData.revenue += total
    financialData.profit += total // Simplified, should subtract costs in real scenario
    saveToLocalStorage("financialData", financialData)

    setCart([])
    setAmountPaid("")
    setChange(0)
    setQrCodeValue("")
  }

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt")
    html2canvas(receiptElement).then((canvas) => {
      const link = document.createElement("a")
      link.download = "struk.png"
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    (<div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Produk</h2>
          <div>
            <span className="mr-2">Kasir: {currentCashier?.name}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4" />
        {filteredProducts.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatRupiah(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                      Tambah ke Keranjang
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Keranjang</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatRupiah(item.price)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateCartItemQuantity(item.id, e.target.value)}
                    min="1"
                    max={products.find((p) => p.id === item.id)?.stock || 999999} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => removeFromCart(item.id)} variant="destructive">
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2">
          <p>Total: {formatRupiah(total)}</p>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Tunai</SelectItem>
              <SelectItem value="qris">QRIS</SelectItem>
            </SelectContent>
          </Select>
          {paymentMethod === "cash" && (
            <>
              <Input
                type="number"
                placeholder="Jumlah yang dibayarkan"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)} />
              <p>Kembalian: {formatRupiah(change)}</p>
            </>
          )}
          {paymentMethod === "qris" && qrCodeValue && (
            <div className="flex justify-center">
              <QRCodeSVG value={qrCodeValue} size={200} />
            </div>
          )}
        </div>
        <Button
          onClick={processTransaction}
          className="mt-4"
          disabled={cart.length === 0}>
          Proses Transaksi
        </Button>
      </div>
      <Dialog open={!!receipt} onOpenChange={() => setReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Struk</DialogTitle>
          </DialogHeader>
          {receipt && (
            <div id="receipt" className="font-mono p-4 bg-white">
              <p className="text-center font-bold">{receipt.storeName}</p>
              <p>Tanggal: {receipt.date}</p>
              <p>Kasir: {receipt.cashier}</p>
              <hr className="my-2" />
              {receipt.items.map((item, index) => (
                <p key={index}>
                  {item.name} x{item.quantity} - {formatRupiah(item.price * item.quantity)}
                </p>
              ))}
              <hr className="my-2" />
              <p className="font-bold">Total: {formatRupiah(receipt.total)}</p>
              <p>Metode Pembayaran: {receipt.paymentMethod === "cash" ? "Tunai" : "QRIS"}</p>
              {receipt.paymentMethod === "cash" && (
                <>
                  <p>Dibayar: {formatRupiah(receipt.amountPaid)}</p>
                  <p>Kembalian: {formatRupiah(receipt.change)}</p>
                </>
              )}
              <p className="text-center mt-4">Terima kasih atas kunjungan Anda!</p>
            </div>
          )}
          <Button onClick={downloadReceipt}>Unduh Struk (PNG)</Button>
        </DialogContent>
      </Dialog>
    </div>)
  );
}

