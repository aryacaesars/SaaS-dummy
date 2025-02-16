"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

export default function StoreInfo() {
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
    cashiers: [],
  })

  useEffect(() => {
    const storedInfo = getFromLocalStorage("storeInfo")
    if (storedInfo) {
      setStoreInfo(storedInfo)
    }
  }, [])

  const handleChange = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
  }

  const handleAddCashier = () => {
    setStoreInfo({ ...storeInfo, cashiers: [...storeInfo.cashiers, ""] })
  }

  const handleCashierChange = (index, value) => {
    const newCashiers = [...storeInfo.cashiers]
    newCashiers[index] = value
    setStoreInfo({ ...storeInfo, cashiers: newCashiers })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveToLocalStorage("storeInfo", storeInfo)
    saveToLocalStorage("cashiers", storeInfo.cashiers.map((name) => ({ name })))
    alert("Informasi toko berhasil disimpan")
  }

  return (
    (<form onSubmit={handleSubmit}>
      <Input
        name="name"
        value={storeInfo.name}
        onChange={handleChange}
        placeholder="Nama Toko"
        className="mb-2" />
      <Input
        name="address"
        value={storeInfo.address}
        onChange={handleChange}
        placeholder="Alamat Toko"
        className="mb-2" />
      <Input
        name="phone"
        value={storeInfo.phone}
        onChange={handleChange}
        placeholder="Nomor Telepon Toko"
        className="mb-2" />
      <h3 className="text-lg font-bold mt-4 mb-2">Kasir</h3>
      {storeInfo.cashiers.map((cashier, index) => (
        <Input
          key={index}
          value={cashier}
          onChange={(e) => handleCashierChange(index, e.target.value)}
          placeholder={`Kasir ${index + 1}`}
          className="mb-2" />
      ))}
      <Button type="button" onClick={handleAddCashier} className="mb-4">
        Tambah Kasir
      </Button>
      <Button type="submit">Simpan Informasi Toko</Button>
    </form>)
  );
}

