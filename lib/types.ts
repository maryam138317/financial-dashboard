type type = 'Income' | 'Expose' | 'Savings';


type IncomeCategory = 'Salary' | 'Bonus' | 'Petty Cash' | 'Others';

type ExposeCategory = 'Transport' | 'Food' | 'Beauty' | 'Social Life' | 'Education' | 'Health' | 'Gift' | 'Others';

type savingCategory = 'Save for Future';

type TransactionCategory = IncomeCategory | ExposeCategory | savingCategory;


export interface User{
    id: string,
    username : string,
    password: string,
    image ?: string //OPTIONAL: if there's no image, store empty string
}

export interface Transaction {
    id: string,
    user_id: string,
    amount: number,
    type: type,
    category: TransactionCategory,
    date: Date,
    goal_id ?: string //OPTIONAL: if the transaction is for saving money
}

export interface Goal {
    id: string,
    user_id: string,
    title: string,
    amount: number
}