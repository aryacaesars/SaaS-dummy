"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { saveToLocalStorage, getFromLocalStorage } from "@/lib/utils"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    const cashiers = getFromLocalStorage("cashiers") || []
    const cashier = cashiers.find((c) => c.name.toLowerCase() === username.toLowerCase())
    if (cashier && password === `${username}123`) {
      saveToLocalStorage("currentCashier", cashier)
      onLogin(cashier)
    } else {
      setError("Username atau password salah")
    }
  }

  return (
    (<form onSubmit={handleLogin} className="space-y-4">
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username" />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password" />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Login</Button>
    </form>)
  );
}

