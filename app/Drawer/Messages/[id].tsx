import { View, Text, Button } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, Time } from "react-native-gifted-chat";
import { chat, Response, } from '@/Context/types';
import { socket, database, createObject, Request  } from '@/assets/reusable/api';
import { app_colors } from '@/assets/styles/colors';
import useGetLoginContext from '@/Context/LoginContext';
import useGetChatContext, { ChatContextProvider } from '@/Context/ChatContext';
import { useLocalSearchParams as useParams } from "expo-router";

interface ChatUser
{
	_id: string,
	name: string
}

export default function Messaging() {
	const { state } = useGetLoginContext();
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [currUser, setCurrUser] = useState<ChatUser>({
			_id: state.user.userID,
			name: state.user.Name
		});
	const destination = useRef<string>("");
	const { chatMessages: chattings, currChatName, chatUpdates} = useGetChatContext()
  const { id } = useParams();
	useEffect(() => {

    const currMessages = chattings.filter(item => item.sender === id || item.receiver === id);

		setTimeout(() =>
			{
				const formattedChatMessages = currMessages.map(({ receiver, sender , ...chat }: any) => ({
					...chat,
					user: receiver === id ? currUser : {_id: id, name: currChatName }
				}));
				setMessages([...formattedChatMessages].reverse())
			}, 50)

	}, []);

	useEffect(() => {
		if (currUser) {
			destination.current = typeof id == "string" ? id : id[0];
		}
	}, [currUser]);

	useEffect(() => {
		socket.emit("join", { id: state.user.userID, name: state.user.Name });

		socket.on("message", (message) => {
			setMessages(prevMessages => {return [ message, ...prevMessages ]});
		});

		socket.on("send-error", (error) => alert(error));

		return () => {
			socket.off("message");
			socket.off("send-error");
		};
	}, [state.user.userID, state.user.Name]);


  return (
	<>
    <GiftedChat
		messages={[...messages]}
		showAvatarForEveryMessage={false}
		showUserAvatar={false}
		onSend={message => {
			setMessages(prevMessages => { return [ message[0], ...prevMessages]});
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
			maxWidth: "70%",
			borderRadius: 10,
			marginBottom: 10, // Spacing between messages
			justifyContent: "center", // Vertically align text
        },
        right: {
			backgroundColor: app_colors.secondary,
			maxWidth: "70%",
			borderRadius: 10,
			marginBottom: 10, // Spacing between messages
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