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
}

type Request =
{
    request: string,
    farmer: string,
    buyer: string,
    crop: string,
    quantity: number,
    price: number,
    status: string,
    created: string
}


type UserType =
{
    userID: string, // User's National ID Number
    Name: string,
    contact: string | number
    main_crop: string,
    Additional_crops: string[] | null,
};



export { ActionType, AlertProps, button, ChildrenType, ContractType, ProduceType, Request, Response, UserType,  };