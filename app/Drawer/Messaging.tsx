import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bubble, GiftedChat, IMessage, MessageText, Time } from "react-native-gifted-chat";
import { chat, Response, } from '@/Context/types';
import { socket, database, createObject, Request  } from '@/assets/reusable/api';
import { app_colors } from '@/assets/styles/colors';
import useGetLoginContext from '@/Context/LoginContext';
import useGetChatContext, { ChatContextProvider } from '@/Context/ChatContext';

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
	const [messages, setMessages] = useState<IMessage[]>([...chatMessages].reverse());
	const [currUser, setCurrUser] = useState<ChatUser>(users[0]);
	const destination = useRef<string>("");
	const receiver = "07-423546 T 07"
	const { state } = useGetLoginContext();
	const { chatMessages: chattings } = useGetChatContext()
	useEffect(() => {
		setCurrUser({
			_id: state.user.userID,
			name: state.user.Name
		});

			alert(chattings)
    /*
      SELECT DISTINCT U.UserID, U.UserName FROM ChatMessages C INNER JOIN Users U ON C.ReceiverID = U.UserID WHERE C.SenderID = ?;
    */
		const sql : string = "Select * From ChatMessages Where SenderID=? and recieverID=?";
		setTimeout(() =>
			{
				const object = createObject("POST", {
					query: sql,
					parameters: [currUser._id, receiver]
				});

				Request(`${ database }/generic`, object)
				.then( (data: Response) =>
					{
						const newArray = data.data.map(({ reciever, ...chat }: any) => ({
							...chat,
							user: currUser
						}));
						alert(JSON.stringify(newArray));

					}).catch(err => alert(err));
			}, 2000)

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
	<>
	<Text>{ JSON.stringify(chattings) }</Text>
	<ChatContextProvider>
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
	</ChatContextProvider>
	</>
  )
}