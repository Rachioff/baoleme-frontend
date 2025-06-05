export interface OrderStats {
    sales: number[]
    incomes: number[]
}

export interface TopProducts {
    totalSale: number
    totalIncome: number
    bySale: {
        name: string
        queriedSale: number
    }[]
    byIncome: {
        name: string
        queriedIncome: number
    }[]
}