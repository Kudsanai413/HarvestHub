import { compareAsc, parseISO } from "date-fns";
import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionType, chat, chatItem, ChildrenType, Response } from "./types";
import { base_url, createObject, database,Request, socket } from "@/assets/reusable/api";
import useGenerateUpdates from "./UpdatesContext";
import useGetLoginContext from "./LoginContext";
import { IMessage } from "react-native-gifted-chat";


function filterDuplicates(UpdatesList : chat[], currMessagesList: chat[]) : chat[]
{
    const times : number = UpdatesList.length;
    const actualUpdates : chat[] = []
    for (let i = 0; i < times; i++)
    {
        currMessagesList.forEach(item => {
            if (item._id === UpdatesList[i]._id)
            {
                console.log("Item Exists");
                return ''
            }
            else
            {
                actualUpdates.push(UpdatesList[i]);
                return
            }
        })
    }
    return [ ...new Set(actualUpdates)]
}

function filterStuff(updates: chat[]) {
    const actual = updates.filter((update, index, self) =>
        self.findIndex((thing) => thing._id === update._id) === index
    );

    const actualSorted: chat[] = actual.sort((a, b) =>
        compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    );

    return actualSorted;
}

type ChatContextType =
{
    chats: chatItem[],
    chatMessages: chat[],
    chatUpdates: chatItem[],
    chatMessageUpdates: chat[],
    currChatName: string,
    setCurrChatName: React.Dispatch<React.SetStateAction<string>>,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
    trigger: boolean
}

const ChatContext = createContext<ChatContextType>({
    chats: [],
    chatMessages: [],
    chatMessageUpdates: [],
    chatUpdates: [],
    currChatName: "",
    setCurrChatName: () => {},
    setTrigger: () => {},
    trigger: false
});

export const ChatContextProvider = ({ children }: ChildrenType): React.JSX.Element => {
    const { state: updates } = useGenerateUpdates();
    const { state: login } = useGetLoginContext();
    const [chatMessages, setChatMessages] = useState<chat[]>([]);
    const [chats, setChats] = useState<chatItem[]>([]);
    const [chatUpdates, setChatUpdates] = useState<chatItem[]>([]);
    const [chatMessageUpdates, setChatMessageUpdates] = useState<chat[]>([]);
    const [currChatName, setCurrChatName] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>(false)

    const loaded = useRef<boolean>(false);

    useEffect(() => {
        const sqlChatMessagesAll: string =
            "SELECT * FROM ChatMessages WHERE SenderID=? OR recieverID=? ORDER BY CreatedAt ASC";

        if (!loaded.current) {
            fetch(`${database}/getChatItem/${login.user.userID}/${login.user_type}`)
                .then(response => {
                    if (!response.ok) throw new Error("Failed to Get Chats");
                    return response.json();
                })
                .then((response: Response) => {
                    setChats(response.data);
                })
                .catch(err => alert(err));

            const object = createObject("POST", {
                query: sqlChatMessagesAll,
                parameters: [login.user.userID, login.user.userID]
            });

            Request(`${database}/generic`, object)
                .then((data: Response) => {
                    setChatMessages(data.data);
                })
                .catch(err => alert(err));

            loaded.current = true;
        }
    }, [trigger]);

    function ChatUpdates(things : chat[])
    {
        // alert(` ${chatMessageUpdates.length} <<<<<${JSON.stringify(things)}>>>>>>>>>`)
        if (things.length) setChatMessageUpdates(prev => ([...filterStuff([...prev, ...things])]));
        console.log("No Real Updates");
    }

    useEffect(() => {
        socket.on("update-messages", (things: chat[]) => {
            const inHouse : chat[] = [...chatMessages, ...chatMessageUpdates]
            const mergedMessages = filterDuplicates(things, inHouse);
            // alert(`Lengthy ====>>>> ${ mergedMessages } <<<<<<<<=======Updates >>>>${JSON.stringify(mergedMessages)}`);
            ChatUpdates(things)
        });

        socket.emit("join", { id: login.user.userID, name: login.user.Name });

        return () => {
            socket.off("update-messages"); // Cleanup listener to prevent memory leaks
        };

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
                setTrigger: setTrigger,
                trigger: trigger
            }}
        >
            { children }
        </ChatContext.Provider>
    )
}

export default function useGetChatContext() : ChatContextType { return useContext(ChatContext) }