import { addDays, addMonths, differenceInDays, isSameDay, startOfDay } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Expense {
  id: string
  amount: number
  description: string
  date: Date
}

interface Income {
  id: string
  amount: number
  description: string
  date: Date
}

interface DailyBalance {
  date: Date
  baseBalance: number
  previousDayLeftover: number
  expenses: Expense[]
  incomes: Income[]
  totalAvailable: number
  remainingBalance: number
}

interface FutureProjection {
  date: Date
  baseBalance: number
  previousDayLeftover: number
  projectedExpenses: number
  projectedIncomes: number
  totalAvailable: number
  projectedBalance: number
}

interface BalanceState {
  initialBalance: number
  paymentDate: Date | null
  dailyBalance: number
  expenses: Expense[]
  incomes: Income[]
  remainingBalance: number
  displayedDays: DailyBalance[]
  futureProjections: FutureProjection[]
  currentPage: number
  totalPages: number
  currentProjectionPage: number
  totalProjectionPages: number
  calculateDailyBalance: () => void
  calculateFutureProjections: () => void
  setInitialData: (data: { balance: number; paymentDate: Date }) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  addIncome: (income: Omit<Income, 'id'>) => void
  deleteExpense: (id: string) => void
  deleteIncome: (id: string) => void
  reset: () => void
  setPage: (page: number) => void
  setProjectionPage: (page: number) => void
}

export const useBalanceStore = create(
  persist<BalanceState>(
    (set, get) => ({
  initialBalance: 0,
  paymentDate: null,
  dailyBalance: 0,
  expenses: [],
  incomes: [],
  remainingBalance: 0,
  displayedDays: [],
  futureProjections: [],
  currentPage: 0,
  totalPages: 0,
  currentProjectionPage: 0,
  totalProjectionPages: 0,

  calculateDailyBalance: () => {
    const { initialBalance, paymentDate, expenses, incomes } = get()
    if (!paymentDate) return

    const nextPaymentDate = addMonths(paymentDate, 1)
    const daysUntilNextPayment = differenceInDays(nextPaymentDate, paymentDate)
    const baseDailyBalance = initialBalance / daysUntilNextPayment

    // Calcular saldo desde o dia do recebimento até hoje
    const today = startOfDay(new Date())
    const displayedDays: DailyBalance[] = []
    let accumulatedBalance = 0

    // Primeiro, vamos calcular o saldo acumulado desde o dia do recebimento
    const allDates = []
    let currentDate = startOfDay(paymentDate)
    
    while (currentDate <= today) {
      allDates.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    // Calcular o saldo acumulado para todos os dias desde o recebimento
    const DAYS_PER_PAGE = 3
    const { currentPage } = get()
    const totalPages = Math.ceil(allDates.length / DAYS_PER_PAGE)

    // Primeiro, calculamos o saldo acumulado até a página atual
    const startIndex = currentPage * DAYS_PER_PAGE
    const previousDates = allDates.slice(0, startIndex)

    for (const date of previousDates) {
      const dayExpenses = expenses.filter(expense => 
        isSameDay(expense.date, date)
      )
      const dayIncomes = incomes.filter(income => 
        isSameDay(income.date, date)
      )
      
      const totalExpensesAmount = dayExpenses.reduce((acc, expense) => acc + expense.amount, 0)
      const totalIncomesAmount = dayIncomes.reduce((acc, income) => acc + income.amount, 0)
      const totalAvailable = baseDailyBalance + accumulatedBalance + totalIncomesAmount
      accumulatedBalance = totalAvailable - totalExpensesAmount
    }

    // Agora calculamos os dias da página atual
    const pageDates = allDates.slice(startIndex, startIndex + DAYS_PER_PAGE)
    let previousBalance = accumulatedBalance

    for (let i = 0; i < pageDates.length; i++) {
      const currentDate = pageDates[i]
      const dayExpenses = expenses.filter(expense => 
        isSameDay(expense.date, currentDate)
      )
      const dayIncomes = incomes.filter(income => 
        isSameDay(income.date, currentDate)
      )
      
      const totalExpensesAmount = dayExpenses.reduce((acc, expense) => acc + expense.amount, 0)
      const totalIncomesAmount = dayIncomes.reduce((acc, income) => acc + income.amount, 0)
      const totalAvailable = baseDailyBalance + previousBalance + totalIncomesAmount
      const remainingBalance = totalAvailable - totalExpensesAmount

      previousBalance = remainingBalance

      displayedDays.push({
        date: currentDate,
        baseBalance: baseDailyBalance,
        previousDayLeftover: i === 0 ? accumulatedBalance : displayedDays[i - 1].remainingBalance,
        expenses: dayExpenses,
        incomes: dayIncomes,
        totalAvailable,
        remainingBalance
      })
    }

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    const totalIncomes = incomes.reduce((acc, income) => acc + income.amount, 0)
    const remainingBalance = initialBalance - totalExpenses + totalIncomes
    
    set({
      dailyBalance: baseDailyBalance,
      remainingBalance,
      displayedDays,
      totalPages
    })
    
    // Calcular projeções futuras
    get().calculateFutureProjections()
  },

  setInitialData: (data) => {
    set({
      initialBalance: data.balance,
      paymentDate: data.paymentDate,
    }, false)
    get().calculateDailyBalance()
  },

  addExpense: (expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID()
    }
    
    set((state) => ({
      expenses: [...state.expenses, newExpense]
    }), false)
    get().calculateDailyBalance()
  },

      reset: () => {
    set({
      initialBalance: 0,
      paymentDate: null,
      dailyBalance: 0,
      expenses: [],
      incomes: [],
      remainingBalance: 0,
      displayedDays: [],
      futureProjections: [],
      currentPage: 0,
      totalPages: 0,
      currentProjectionPage: 0,
      totalProjectionPages: 0
    })
  },

  setPage: (page) => {
    set({ currentPage: page }, false)
    get().calculateDailyBalance()
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter(expense => expense.id !== id)
    }), false)
    get().calculateDailyBalance()
  },

  addIncome: (income) => {
    const newIncome = {
      ...income,
      id: crypto.randomUUID()
    }
    
    set((state) => ({
      incomes: [...state.incomes, newIncome]
    }), false)
    get().calculateDailyBalance()
  },

  deleteIncome: (id) => {
    set((state) => ({
      incomes: state.incomes.filter(income => income.id !== id)
    }), false)
    get().calculateDailyBalance()
  },

  calculateFutureProjections: () => {
    const { initialBalance, paymentDate, expenses, incomes } = get()
    if (!paymentDate) return

    const nextPaymentDate = addMonths(paymentDate, 1)
    const baseDailyBalance = initialBalance / differenceInDays(nextPaymentDate, paymentDate)
    
    const today = startOfDay(new Date())
    const futureProjections: FutureProjection[] = []
    
    // Calcular saldo acumulado até hoje
    let accumulatedBalance = 0
    let currentDate = startOfDay(paymentDate)
    
    while (currentDate < today) {
      const dayExpenses = expenses.filter(expense => 
        isSameDay(expense.date, currentDate)
      )
      const dayIncomes = incomes.filter(income => 
        isSameDay(income.date, currentDate)
      )
      
      const totalExpensesAmount = dayExpenses.reduce((acc, expense) => acc + expense.amount, 0)
      const totalIncomesAmount = dayIncomes.reduce((acc, income) => acc + income.amount, 0)
      const totalAvailable = baseDailyBalance + accumulatedBalance + totalIncomesAmount
      accumulatedBalance = totalAvailable - totalExpensesAmount
      
      currentDate = addDays(currentDate, 1)
    }

    // Agora projetar os próximos dias até o próximo pagamento
    let previousBalance = accumulatedBalance
    
    while (currentDate < nextPaymentDate) {
      const dayExpenses = expenses.filter(expense => 
        isSameDay(expense.date, currentDate)
      )
      const dayIncomes = incomes.filter(income => 
        isSameDay(income.date, currentDate)
      )
      
      const projectedExpenses = dayExpenses.reduce((acc, expense) => acc + expense.amount, 0)
      const projectedIncomes = dayIncomes.reduce((acc, income) => acc + income.amount, 0)
      const totalAvailable = baseDailyBalance + previousBalance + projectedIncomes
      const projectedBalance = totalAvailable - projectedExpenses

      futureProjections.push({
        date: currentDate,
        baseBalance: baseDailyBalance,
        previousDayLeftover: previousBalance,
        projectedExpenses,
        projectedIncomes,
        totalAvailable,
        projectedBalance
      })

      previousBalance = projectedBalance
      currentDate = addDays(currentDate, 1)
    }

    const PROJECTIONS_PER_PAGE = 7
    const totalProjectionPages = Math.ceil(futureProjections.length / PROJECTIONS_PER_PAGE)
    
    set({ 
      futureProjections,
      totalProjectionPages
    })
  },

  setProjectionPage: (page) => {
    set({ currentProjectionPage: page }, false)
  }
}), {
    name: 'saldo-diario-storage',
    partialize: (state) => ({
      initialBalance: state.initialBalance,
      paymentDate: state.paymentDate,
      expenses: state.expenses.map(expense => ({
        ...expense,
        date: expense.date.toISOString()
      })),
      incomes: state.incomes.map(income => ({
        ...income,
        date: income.date.toISOString()
      }))
    } as any),
    onRehydrateStorage: () => (state) => {
      if (state) {
        // Convertendo as strings ISO de volta para objetos Date
        state.expenses = state.expenses.map(expense => ({
          ...expense,
          date: new Date(expense.date as unknown as string)
        }))
        state.incomes = state.incomes?.map(income => ({
          ...income,
          date: new Date(income.date as unknown as string)
        })) || []
        if (state.paymentDate) {
          state.paymentDate = new Date(state.paymentDate as unknown as string)
        }
        // Recalculando os valores após a hidratação
        state.calculateDailyBalance()
      }
    }
  }
))
