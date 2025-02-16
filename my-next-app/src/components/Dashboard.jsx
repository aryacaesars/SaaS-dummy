"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { formatRupiah, getFromLocalStorage } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
  })

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    const storedFinancialData = getFromLocalStorage("financialData")
    if (storedFinancialData) {
      setFinancialData(storedFinancialData)
    }

    const storedChartData = getFromLocalStorage("chartData")
    if (storedChartData) {
      setChartData(storedChartData)
    } else {
      setChartData({
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        datasets: [
          {
            label: "Pendapatan",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Pengeluaran",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      })
    }
  }, [])

  return (
    (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Pendapatan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatRupiah(financialData.revenue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatRupiah(financialData.expenses)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Keuntungan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatRupiah(financialData.profit)}</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Ikhtisar Keuangan</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }} />
        </CardContent>
      </Card>
    </div>)
  );
}

