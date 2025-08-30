export interface Category {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
  }
  
  export interface Transaction {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    type: "income" | "expense";
    note: string;
    transaction_date: string;
    created_at: string;
    category?: Category; 
  }
  
  export interface Budget {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    start_date: string;
    end_date: string;
    created_at: string;
    category?: Category; 
  }
  
  export interface UserProfile {
    id: string;
    email: string;
    created_at: string;
  }
  