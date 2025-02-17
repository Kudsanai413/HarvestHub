import { ActionType, ChildrenType, Response, UserType } from "./types"
import React, { createContext, useContext, useReducer} from "react"
import { Request, createObject, database } from "@/assets/reusable/api"
import { useRouter } from "expo-router"
import useGetUserContext from "./UserContext"
import useGenerateAlert from "./AlertContext"
import { createSession } from "@/assets/reusable/constants"

let Authenticate : () => void;

const initUser :  UserType | any = {}

const initReducerState =
{
    user_id : "",
    password: "",
    logging: false,
    user: initUser,
    error:{
        type: null,
        message: "",
        data: null,
    },
    user_type: "unset"
}

type LoginContextType =
{
    state: typeof initReducerState,
    dispatch: React.Dispatch<ActionType>,
}

const actions =
{
    typing: ["user-id", "password"],
    find: "find",
    login: "login",
    reset: "clear",
}

const LoginContextReducer = (state: typeof initReducerState, action: ActionType) : typeof initReducerState | any =>
{

    switch(action.type)
    {
        case actions.typing[0]:
            return { ...state, user_id: action.payload };

        case actions.typing[1]:
            return { ...state, password: action.payload };

        case actions.login:
            Authenticate()

        case "user":
            return { ...state, user: action.payload }

        case actions.reset:
            return initReducerState;

        case "error":
            return { ...state, error: { ...state.error, ...action.payload } }

        case "user-type":
            return { ...state, user_type: action.payload }

        default:
            return{ ...state, error: { ...state.error, type:"Login Error System", message: "Thing Just Got Out Of Hand In The Login System" }}

    }

}

const LoginContext = createContext<LoginContextType>({
    state: initReducerState,
    dispatch: () => { },
})

export const LoginContextProvider = ( { children } : ChildrenType ) : React.JSX.Element =>
{
    const [state, dispatch] = useReducer(LoginContextReducer, initReducerState);
	const { dispatch: user_dispatch } = useGetUserContext();
    const navigator = useRouter();
    const { dispatch : alert, Alert } = useGenerateAlert();

        Authenticate = () =>
        {
            const methodObjects = createObject("POST", {
                user: state.user_id,
                password: state.password
            });
            Request(`${ database }/login`, methodObjects)
                .then( (user : Response)  =>
                            {
                                if ( user.data && !user.error )
                                {
                                    dispatch({ type: "user", payload: user.data })
                                    dispatch({ type: "user-type", payload: user.user_type })
                                }

                                else
                                {
                                    dispatch({ type: "error", payload: { type: user.error, message: user.message }})
                                }

                                return user
                            }).then( (user : Response) =>
                                {
                                    if (user.user_type === "Farmers") navigator.push("/(farmer)/Home")
                                    else if (user.user_type === "Buyers") navigator.push("/(buyers)/Home")
                                    else throw new Error("Page Not Found")
                                }).catch( error =>
                                    {
                                        alert({type: "error-type", payload: "No Response"})
                                        alert({ type: "error-message", payload: "Backend Did Not Send Back A Response"})
                                        alert({type: "show-alert", payload: true})
                                    })
        }

    return(
        <LoginContext.Provider
            value={{
                state: state,
                dispatch: dispatch,
            }}
        >
            { children }
        </LoginContext.Provider>

    );
}



export default function useGetLoginContext() : LoginContextType
{
    return useContext(LoginContext);
}
