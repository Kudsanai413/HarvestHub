import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { ActionType, AlertProps, ChildrenType } from "./types";
import Alert from "@/Components/Alert";
import io from 'socket.io-client';
import { socket } from "@/assets/reusable/api";

const SOCKET_URL = 'http://localhost:5000'; // Replace with your Flask server IP


const initAlertState : AlertProps =
{
    type: "Error",
    message: "An Unexpected Error Occured",
    visible: false,
    buttons: [],
    icon: "alert-box-outline"
}

const reducer = ( state : typeof initAlertState, action : ActionType) : typeof initAlertState =>
    {
        switch(action.type)
        {
        case "error-type":
            return { ...state, type: action.payload };

        case "error-message":
            return { ...state, message: action.payload };

        case "show-alert":
            return { ...state, visible: action.payload ? action.payload : false };

            case "error-icon":
                return { ...state, icon: action.payload };

                case "alert-button":
                    return { ...state, buttons: [action.payload] };

                    default:
                        return initAlertState;
                    }
                }

                type AlertContextType = {
                    state: typeof initAlertState,
                    dispatch: React.Dispatch<ActionType>,
                    Alert: ( alert? : AlertProps) => void
                }

                const AlertContext = createContext<AlertContextType>({
                    state: initAlertState,
                    dispatch: () => {},
                    Alert: () => {}
                })



export const AlertContextProvider = ({ children } : ChildrenType) =>
{
    const [state, dispatch] = useReducer(reducer, initAlertState);  const [message, setMessage] = useState('');
    const socket = io(SOCKET_URL, { transports: ['websocket'] });


    useEffect(() => {
            socket.on("connect", () => {
                dispatch({ type: "error-type", payload: "Socket Status" });
                dispatch({ type: "error-message", payload: "Socket Succefully Connected" });
                dispatch({ type: "error-icon", payload: "link-variant" });
                dispatch({ type: "show-alert", payload: true })
        })
    }, [])

    const alert = ( alert? : AlertProps ) : void =>
    {
        dispatch( {type: "error-type", payload:  alert?.type });
        dispatch( {type: "error-message", payload:  alert?.message });
        dispatch( {type: "error-icon", payload:  alert?.icon });
        dispatch( {type: "error-buttons", payload:  alert?.buttons });
        dispatch( {type: "show-alert", payload:  true });
    }

    return(
        <AlertContext.Provider
            value={{
                state:state,
                dispatch: dispatch,
                Alert: alert
            }}
        >
            { children}
            <Alert/>
        </AlertContext.Provider>
    )
}

export default function useGenerateAlert() : AlertContextType { return useContext(AlertContext)};