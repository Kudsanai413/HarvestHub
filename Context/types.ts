type ActionType =
{
    type: string,
    payload? : string | number | any,
};

interface AlertProps
{
    visible?: boolean,
    icon?: string,
    type: string,
    message: string,
    buttons?: button[]
};

interface button
{
    text: string,
    onClick: () => void,
};

type chat =
{
    _id: string,
    createdAt: any | Date,
    text: string,
    receiver: string,
    sender: string,
    read: string
}

interface chatItem
{
    id: string,
    user: {
        name: string,
        avatar?: any
    },
    last_message: {
        text: string,
        time: string,
        count: number
    }
}

type ChildrenType =
{
    children : React.JSX.Element,
};

type ContractType =
{
    contractID: string,
    farmerID: string,
    buyerID: string,
    agreement: string,
    status: boolean,
    startDate: string,
    finishDate: string,
};


type ProduceType =
{
    produceID: string,
    farmerID: string,
    produceType: string,
    quantity: number,
    price: number,
    unit_type: string, // Unit of measurement for price eg. $7/kg
};

type Response =
{
    data: any,
    error: string | null,
    message: string,
    user_type?: string,
    session?: string
}

type Request =
{
    request: string,
    buyerORfarmer: string,
    location: string,
    crop: string,
    grade: string
    quantity: number,
    price: number,
    status: string,
    perpID: string
}


type UserType =
{
    userID: string, // User's National ID Number
    Name: string,
    contact: string | number
    main_crop: string,
    Additional_crops: string[] | null,
    user_type?: "Farmers" | "Buyers"
};



export { ActionType, AlertProps, button, chat, chatItem, ChildrenType, ContractType, ProduceType, Request, Response, UserType,  };