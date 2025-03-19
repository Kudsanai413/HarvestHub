import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { ActionType, AlertProps, ChildrenType } from "./types";
import useGenerateAlert from "./AlertContext";
import { socket } from "@/assets/reusable/api";

const initUpdatesState = {
    contracts: [],
    produce: [],
    requests: [],
};

const reducer = (state: typeof initUpdatesState, action: ActionType): typeof initUpdatesState => {
    switch (action.type) {
        case "Requests":
            return { ...state, requests: action.payload };
        case "Contracts":
            return { ...state, contracts: action.payload };
        case "Produce":
            return { ...state, produce: action.payload };
        default:
            return state; // Do not reset to initUpdatesState on unknown action
    }
};

type UpdatesContextType = {
    state: typeof initUpdatesState;
    dispatch: React.Dispatch<ActionType>;
};

const UpdatesContext = createContext<UpdatesContextType>({
    state: initUpdatesState,
    dispatch: () => {},
});

export const UpdatesContextProvider = ({ children }: ChildrenType) => {
    const { dispatch: alert } = useGenerateAlert();
    const [state, dispatch] = useReducer(reducer, initUpdatesState);

    useEffect(() => {
        const handleUpdates = (data: Record<string, any>) => {
            alert({ type: "error-type", payload: "New Updates" });
            alert({ type: "error-message", payload: `${Object.keys(data).length} Updates Found` });
            alert({ type: "show-alert", payload: true });

            Object.keys(data).forEach((key) => {
                if (key in initUpdatesState) {
                    dispatch({ type: key as keyof typeof initUpdatesState, payload: data[key] });
                }
            });
        };

        socket.on("new-updates", handleUpdates);

        return () => {
            socket.off("new-updates", handleUpdates);
        };
    }, [alert]);

    return (
        <UpdatesContext.Provider value={{ state, dispatch }}>
            {children}
        </UpdatesContext.Provider>
    );
};

export default function useGenerateUpdates(): UpdatesContextType {
    return useContext(UpdatesContext);
}
