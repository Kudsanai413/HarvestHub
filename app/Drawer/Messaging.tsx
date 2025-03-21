import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, Time } from "react-native-gifted-chat";
import { auth, database } from "../../fireBase.config";
import { chat } from '@/Context/types';
import { socket } from '@/assets/reusable/api';
import { app_colors } from '@/assets/styles/colors';
import useGetLoginContext from '@/Context/LoginContext';

const chatMessages: IMessage[] = [
  {
    _id: "a1b2",
    text: "Hey! How’s it going?",
    createdAt: new Date("2025-03-20T10:00:00Z"),
    user: {
      _id: "63-3128050 M 07",
      name: "Alice",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
    }
  },
  {
    _id: "x9z8w7",
    text: "Hey! I’m doing great. How about you?",
    createdAt: new Date("2025-03-20T10:01:00Z"),
    user: {
      _id: "07-423546 T 07",
      name: "Genious Mutusva",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
    }
  },
  {
    _id: "c3d4e5",
    text: "I’m good too! Just working on some updates.",
    createdAt: new Date("2025-03-20T10:02:00Z"),
    user: {
      _id: "63-3128050 M 07",
      name: "Alice",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
    }
  },
  {
    _id: "r7t6y5",
    text: "Nice! Anything challenging?",
    createdAt: new Date("2025-03-20T10:03:00Z"),
    user: {
      _id: "07-423546 T 07",
      name: "Genious Mutusva",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
    }
  },
  {
    _id: "h2j5k7",
    text: "Yeah, handling real-time updates efficiently is tricky.",
    createdAt: new Date("2025-03-20T10:04:00Z"),
    user: {
      _id: "63-3128050 M 07",
      name: "Alice",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
    }
  },
  {
    _id: "q9p8m3",
    text: "Are you using WebSockets?",
    createdAt: new Date("2025-03-20T10:05:00Z"),
    user: {
      _id: "07-423546 T 07",
      name: "Genious Mutusva",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
    }
  },
  {
    _id: "b5k9f3",
    text: "Yeah, Flask-SocketIO, but I need to optimize it.",
    createdAt: new Date("2025-03-20T10:06:00Z"),
    user: {
      _id: "63-3128050 M 07",
      name: "Alice",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
    }
  },
  {
    _id: "u8z2y4",
    text: "Maybe send only changed data instead of full reloads?",
    createdAt: new Date("2025-03-20T10:07:00Z"),
    user: {
      _id: "07-423546 T 07",
      name: "Genious Mutusva",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
    }
  },
  {
    _id: "m1n4v6",
    text: "That’s exactly what I was thinking!",
    createdAt: new Date("2025-03-20T10:08:00Z"),
    user: {
      _id: "63-3128050 M 07",
      name: "Alice",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
    }
  },
  {
    _id: "g7s3w9",
    text: "Great minds think alike! 😆",
    createdAt: new Date("2025-03-20T10:09:00Z"),
    user: {
      _id: "07-423546 T 07",
      name: "Genious Mutusva",
    //   avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
    }
  }
];

const users = [
  {
    _id: "63-3128050 M 07",
    name: "O K",
    // avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdIanzEVVbqF-lrjrs1LqyLc9y2Nl7Vn8vIA&s"
  },
  {
    _id: "07-423546 T 07",
    name: "Genious Mutusva",
    // avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC9FPg7q-G5wN_T2rN7_UaIBYnD4oUFpvQw&s"
  }
]

interface ChatUser
{
	_id: string,
	name: string
}

export default function Messaging() {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [currUser, setCurrUser] = useState<ChatUser>(users[0]);
	const destination = useRef<string>("");
	const { state } = useGetLoginContext();
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
			<>
				<MessageText
				{...props}
				containerStyle={{
					left: {
						marginBottom: 15, minHeight: 50, maxWidth: "75%",
						backgroundColor: app_colors.skeleton,
						borderRadius: 10,
						paddingVertical: "auto"
					}, // Add margin below received messages
					right: {
						marginBottom: 15, minHeight: 50, maxWidth: "75%",
						backgroundColor: app_colors.secondary,
						borderRadius: 10,
						paddingVertical: "auto"
					} // Add margin below sent messages
				}}
				/>
				{/* <Time
					{...props}
					timeTextStyle={{
						left: { color: "#000", fontSize: 12,
						 }, // Customize received time color
						right: { color: "#000", fontSize: 12 }, // Customize sent time color
					}}
				/> */}
			</>
		)}

		renderTime={(props) => (
			<Time
			{...props}
			timeTextStyle={{
				left: { color: "#000", fontSize: 12 }, // Customize received time color
				right: { color: "#fff", fontSize: 12 }, // Customize sent time color
			}}
			/>
		)}

    />
  )
}