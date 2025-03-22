import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionType, chat, chatItem, ChildrenType, Response } from "./types";
import { base_url, createObject, database,Request, socket } from "@/assets/reusable/api";
import useGenerateUpdates from "./UpdatesContext";
import useGetLoginContext from "./LoginContext";
import { IMessage } from "react-native-gifted-chat";


type ChatContextType =
{
    chats: chatItem[],
    chatMessages: chat[],
    chatUpdates: chatItem[],
    chatMessageUpdates: chat[],
    currChatName: string,
    setCurrChatName: React.Dispatch<React.SetStateAction<string>>,
    UpdateChats: React.Dispatch<React.SetStateAction<chat[]>>
}

const ChatContext = createContext<ChatContextType>({
    chats: [],
    chatMessages: [],
    chatMessageUpdates: [],
    chatUpdates: [],
    currChatName: "",
    setCurrChatName: () => {},
    UpdateChats: () => {}
});

export const ChatContextProvider = ({ children } : ChildrenType) : React.JSX.Element =>
{
    const { state: updates } = useGenerateUpdates();
    const { state : login } = useGetLoginContext();
    const [chatMessages, setChatMessages] = useState<chat[]>([]);
    const [chats, setChats] = useState<chatItem[]>([]);
    const [chatUpdates, setChatUpdates] = useState<chatItem[]>([]);
    const [chatMessageUpdates, setChatMessagesUpdates] = useState<chat[]>([]);
    const [currChatName, setCurrChatName] = useState<string>("");

    const loaded = useRef<boolean>(false);
    useEffect(() =>
    {
		const sqlChatMessagesAll : string = "Select * From ChatMessages Where SenderID=? or recieverID=? ORDER BY CreatedAt ASC";
        if (!loaded.current)
        {
            fetch(`${ database }/getChatItem/${ login.user.userID }/${ login.user_type }`)
                .then(response => {
                    if (!response.ok) throw new Error("Failed To Get Chats");
                    return response.json();
                }).then((response: Response) => {
                    setChats(response.data)
                }).catch(err => alert(err))

            const object = createObject("POST", {
                query: sqlChatMessagesAll,
                parameters: [login.user.userID, login.user.userID]
            });

            Request(`${ database }/generic`, object)
            .then( (data: Response) =>
                {
                    setChatMessages(data.data);
                }).catch(err => alert(err));


            loaded.current = true;
        }

    }, []);

    useEffect(() => {
    socket.on("update-messages", (things ) => {
        setChatMessagesUpdates((prevUpdates) => { return [...prevUpdates, ...things]})
    });

    socket.emit("join", { id: login.user.userID, name: login.user.Name });
}, [])


    return(
        <ChatContext.Provider
            value={{
                chatMessages: chatMessages,
                chatMessageUpdates: chatMessageUpdates,
                chats: chats,
                chatUpdates: chatUpdates,
                currChatName: currChatName,
                setCurrChatName: setCurrChatName,
                UpdateChats: setChatMessagesUpdates
            }}
        >
            { children }
        </ChatContext.Provider>
    )
}

export default function useGetChatContext() : ChatContextType { return useContext(ChatContext) }