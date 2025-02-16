"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatRupiah, saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

export default function Warehouse() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    const storedProducts = getFromLocalStorage("products")
    if (storedProducts) {
      setProducts(storedProducts)
    }
  }, [])

  useEffect(() => {
    saveToLocalStorage("products", products)
  }, [products])

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingProduct.id) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
    } else {
      setProducts([...products, { ...editingProduct, id: Date.now() }])
    }
    setEditingProduct(null)
  }

  const handleAdd = () => {
    setEditingProduct({ name: "", price: 0, stock: 0 })
  }

  return (
    (<div>
      <Button onClick={handleAdd} className="mb-4">
        Tambah Produk
      </Button>
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
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatRupiah(product.price)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(product)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct && editingProduct.id ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Masukkan nama produk" />
              </div>
              <div>
                <Label htmlFor="price">Harga (dalam Rupiah)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })}
                  placeholder="Masukkan harga produk" />
              </div>
              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                  placeholder="Masukkan jumlah stok" />
              </div>
              <Button type="submit">Simpan</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>)
  );
}

