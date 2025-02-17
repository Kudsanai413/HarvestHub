import { Alert } from "react-native";
import { ActionType, ChildrenType, UserType } from "./types";
import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import useGetLoginContext from "./LoginContext";
import { useRouter } from "expo-router";
import { createSession, getSession } from "@/assets/reusable/constants";
import useGenerateAlert from "./AlertContext";


const initUserState : UserType =
{
    userID: "",
    Name: "",
    contact: "",
    main_crop: "",
    Additional_crops: null
};


const initReducerState =
{
    // For Updating Text-Fields When Typing
    user_id: "",
    name: "",
    date_of_birth: "",
    contact: "",
    base_location: "",
    prefered_crop: "",
    additional_crops: "",
    type: "unset",

    // Actual Current User
    user: initUserState
};


const actions =
{
    typing: ["id", "name", "date", "contact", "base", "p-crop", "a-crops"],
    reset: "reset",
    login: "login",
    user: "user"
};


const useContextReducer = (state : typeof initReducerState, action : ActionType) : typeof initReducerState | any =>
{
    switch( action.type )
    {
        case actions.typing[0]:
            return { ...state, user_id: action.payload };

        case actions.typing[1]:
            return { ...state, name: action.payload };

        case actions.typing[2]:
            return { ...state, date_of_birth: action.payload };

        case actions.typing[3]:
            return { ...state, contact: action.payload };

        case actions.typing[4]:
            return { ...state, base_location: action.payload };

        case actions.typing[5]:
            return { ...state, prefered_crop: action.payload };

        case actions.typing[6]:
            return { ...state, additional_crop: action.payload };

        case actions.reset:
            return initReducerState;

        case "location":
            return { ...state, base_location: action.payload };

        case "type":
            return { ...state, type: action.payload }

        case actions.user:
            return { ...state, user: action.payload };

        default:
            Alert.alert("Update Error", "An Error Occurred");
            break;
    }
}


type UserContextType =
{
    state: typeof initReducerState,
    dispatch: React.Dispatch<ActionType>,
}


const UserContext = createContext<UserContextType>({
    state: initReducerState,
    dispatch: () => {}
});

export function UserContextProvider({ children } : ChildrenType ) : React.JSX.Element
{
    const [ state, dispatch ] = useReducer(useContextReducer, initReducerState);
    const { state : logged, dispatch : login } = useGetLoginContext();
    const navigator = useRouter();
    const { Alert } = useGenerateAlert();
    const loaded = useRef<boolean>(false)
    alert("Hello")
    useEffect(() =>
    {
        if (loaded.current)
        {
            const logged_user = getSession().then( user => { return user }).catch( error => console.error(error));
            alert(JSON.stringify(logged_user))
            if (logged_user !== null)
            {
                dispatch({ type: "user", payload : logged_user});
                login({ type: "user", payload : logged_user});
                Alert({
                    type: "Session Message",
                    message: "Session Found"
                })
            }

            else if ( state.user )
            {
                createSession(logged.user).catch(error => {
                    alert(error.message)
                })
                Alert({
                    type: "Session Message",
                    message: "Session Creation Successful"
                })
            }
            else
            {
                navigator.push("/");
            }
        }

        loaded.current = true;

    }, [])


    return(

        <UserContext.Provider
            value={{
                state: state,
                dispatch: dispatch
            }}
        >
            { children}
        </UserContext.Provider>
    )
}


// Application UserContext
export default function useGetUserContext() : UserContextType { return useContext(UserContext) };