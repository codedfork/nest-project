interface IUserUpdatedResponse {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

interface ISplitUpdatedResponse {
    id: number;
    splitAmount: string;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    user: IUserUpdatedResponse;
}

interface IUpdatedExpenseResponse {
    id: string;
    description: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    paidBy: IUserUpdatedResponse;
    splits: ISplitUpdatedResponse[];
}
