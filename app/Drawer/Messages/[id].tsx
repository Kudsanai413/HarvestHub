import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, Time, User } from "react-native-gifted-chat";
import { chat, chatItem } from '@/Context/types';
import { socket } from '@/assets/reusable/api';
import { app_colors } from '@/assets/styles/colors';
import useGetLoginContext from '@/Context/LoginContext';
import useGetChatContext from '@/Context/ChatContext';
import { useLocalSearchParams as useParams, useRouter } from 'expo-router';
import SimpleHeader from '@/Components/SimpleHeader';

export default function Messaging() {
    const { state: login } = useGetLoginContext();
    const { chatMessages, currChatName, chatMessageUpdates, trigger, setTrigger } = useGetChatContext();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currUser, setCurrUser] = useState<User>({
        _id: login.user.userID,
        name: login.user.Name
    });
    const { id } = useParams();
    const navigate = useRouter();
  useEffect(() => {
        socket.emit("read-messages", login.user.userID);
        const currPageMessages = chatMessages.filter(msg => (msg.receiver === id && msg.sender === currUser._id) || (msg.sender === id && msg.receiver === currUser._id));
        const newUpdates = chatMessageUpdates.filter(msg => (msg.receiver === id && msg.sender === currUser._id) || (msg.sender === id && msg.receiver === currUser._id));
        const formattedMessages = [...currPageMessages, ...newUpdates].map(({ receiver, sender, ...msg }) => ({
            ...msg,
            user: sender === id ? { _id: id, name: currChatName } : { _id: login.user.userID, name: login.user.Name }
        }));

        setMessages(formattedMessages.reverse());
    }, [trigger]);

    useEffect(() => {
        socket.emit("join", { id: login.user.userID, name: login.user.Name });

        socket.on("message", (message) => {
            setMessages(prevMessages => [message, ...prevMessages]);
            setTimeout(() => {
                socket.emit("read-messages", login.user.userID);
            }, 1000)
        });

        return () => {
            socket.off("message");
        };
    }, [login.user.userID]);


  return (
    <>
        <SimpleHeader
            title={currChatName}
            back={() => {
                setTrigger(!trigger);
                navigate.back();
            }}
        />
        <GiftedChat
            messages={[...messages]}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            onSend={message => {
                setMessages(prevMessages => { return [message[0], ...prevMessages]});
                socket.emit("send-message", { receiver: id , message: message[0] })
            }}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            textInputStyle={{
                backgroundColor: '#fff',
                borderRadius: 7,
            }}
            renderAvatarOnTop
            user={currUser}
            isScrollToBottomEnabled={true}
            renderBubble={(props) => (
                <Bubble
                    {...props}
                    wrapperStyle={{
                    left: {
                        backgroundColor: app_colors.skeleton,
                        maxWidth: "75%",
                        borderRadius: 15,
                        paddingHorizontal: 10,
                        paddingVertical: 6, // Reduced height
                        marginBottom: 10, // Spacing between messages
                        justifyContent: "center", // Vertically align text
                    },
                    right: {
                        backgroundColor: app_colors.secondary,
                        maxWidth: "75%",
                        borderRadius: 15,
                        paddingHorizontal: 10,
                        paddingVertical: 6, // Reduced height
                        marginBottom: 10, // Spacing between messages
                        justifyContent: "center", // Vertically align text
                    },
                    }}
                />
                )}
                renderMessageText={(props) => (
                <MessageText
                    {...props}
                    textStyle={{
                    left: { color: app_colors.black, fontSize: 16, textAlignVertical: "center" },
                    right: { color: app_colors.white, fontSize: 16, textAlignVertical: "center" },
                    }}
                />
                )}
                renderTime={(props) => (
                <Time
                    {...props}

                    timeTextStyle={{
                    left: { color: app_colors.black, fontSize: 12 },
                    right: { color: app_colors.white, fontSize: 12 },
                    }}
                />
                )}

        />
    </>
  )
}