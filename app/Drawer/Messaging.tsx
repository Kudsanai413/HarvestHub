import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, Time } from "react-native-gifted-chat";
import { auth, database } from "../../fireBase.config";
import { chat } from '@/Context/types';
import { socket } from '@/assets/reusable/api';
import { app_colors } from '@/assets/styles/colors';
import useGetLoginContext from '@/Context/LoginContext';

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
useEffect(() => {
	setCurrUser({
		_id: state.user.userID,
		name: state.user.Name
	});
}, [state.user.userID, state.user.Name]);

useEffect(() => {
	if (currUser._id) {
		destination.current = currUser._id === "07-423546 T 07" ? "63-3128050 M 07" : "07-423546 T 07";
	}
}, [currUser._id]);

useEffect(() => {
	socket.emit("join", { id: state.user.userID, name: state.user.Name });

	socket.on("message", (message) => {
		setMessages(prevMessages => {return [message, ...prevMessages]});
	});

	socket.on("send-error", (error) => alert(error));

	return () => {
		socket.off("message");
		socket.off("send-error");
	};
}, [state.user.userID, state.user.Name]);


  return (
    <GiftedChat
		messages={[...messages]}
		showAvatarForEveryMessage={false}
		showUserAvatar={false}
		onSend={message => {
			setMessages(prevMessages => { return [message[0], ...prevMessages]});
			socket.emit("send-message", { receiver: destination.current , message: message[0] })
			// alert(JSON.stringify(messages))
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
				containerStyle={{
				// left: { position: "absolute", bottom: 2, left: 8 }, // Time at bottom-left
				// right: { position: "absolute", bottom: 2, right: 8 }, // Time at bottom-right
				}}
				timeTextStyle={{
				left: { color: app_colors.black, fontSize: 12 },
				right: { color: app_colors.white, fontSize: 12 },
				}}
			/>
			)}

    />
  )
}