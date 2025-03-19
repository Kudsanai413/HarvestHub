import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionType, ChildrenType, ContractType, ProduceType, Request, Response } from "./types";
import { base_url, database, socket } from "@/assets/reusable/api";
import useGenerateUpdates from "./UpdatesContext";


interface AppContextType
{
    produce: ProduceType[],
    contracts: ContractType[],
    requests: Request[]
}

const ApplicationContext = createContext<AppContextType>({
    produce: [],
    contracts: [],
    requests: []
});

export const ApplicationContextProvider = ({ children } : ChildrenType) : React.JSX.Element =>
{
    const { state: updates } = useGenerateUpdates();
    const [produce, setProduce] = useState<ProduceType[]>([])
    const [contracts, setContracts ] = useState<ContractType[]>([])
    const [requests, setRequests ] = useState<Request[]>([])

    const loaded = useRef<boolean>(false);
    useEffect(() =>
    {
        if (!loaded.current)
        {
            fetch(`${ database }/get/Produce`)
                .then(response =>
                    {
                        if (!response.ok) throw new Error("An Error Occured While Fetching Produce");
                        return response.json();
                    }).then((produce: Response) =>
                        {
                            produce.data ? setProduce([...produce.data, ...updates.produce]) : console.log("No Records")
                        }).catch(error => console.log(error.message));

            fetch(`${ database }/get/Contracts`)
                .then(response =>
                    {
                        if (!response.ok) throw new Error("An Error Occured While Fetching Produce");
                        return response.json();
                    }).then((contract: Response) =>
                        {
                            contract.data ? setContracts([...contract.data, ...updates.contracts]): console.log("No Records")
                        }).catch(error => console.log(error.message));

            fetch(`${ database }/get/Requests`)
                .then(response =>
                    {
                        if (!response.ok) throw new Error("An Error Occured While Fetching Produce");
                        return response.json();
                    }).then((request: Response) =>
                        {
                            request.data ? setRequests([...request.data, ...updates.requests]): console.log("No Records")
                        }).catch(error => console.log(error.message));

            loaded.current = true;

        }
    }, [])

    return(
        <ApplicationContext.Provider
            value={{
                produce: produce,
                contracts: contracts,
                requests: requests
            }}
        >
            { children }
        </ApplicationContext.Provider>
    )
}

export default function useGetApplicationContext() : AppContextType { return useContext(ApplicationContext) }