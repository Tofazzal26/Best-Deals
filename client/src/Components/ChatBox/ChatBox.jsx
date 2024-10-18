import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaLocationArrow } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import useAxiosCommon from '../../hooks/useAxiosCommon';

const ChatBox = ({ setIsChatBoxOpen, vendorInfo, product }) => {
    const { user } = useAuth();

    const axiosCommon = useAxiosCommon();

    const { photo: vendorPhoto, name: vendorName, email } = vendorInfo[0];

    const [messages, setMessages] = useState([
        { text: "Hi, how can we assist you?", sender: 'vendor' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = async () => {
        if (inputText !== '') {
            setMessages([...messages, { text:inputText, sender: 'user' }]);
            const messageData = { text: inputText, messageTo: email, messageFrom: user?.email, sender: user?.displayName, receiver: vendorName };

            try {
                const res = await axiosCommon.post('/inbox', messageData);
                console.log(res.data);  // Log the response to ensure the request is successful
            } catch (error) {
                console.error('Failed to send message:', error);  // Log the error for debugging
            }

            setInputText('');
        }
    };


    const handleCloseChat = () => {
        setIsChatBoxOpen(false);
    };

    return (
        <div className="flex flex-col max-h-[500px] bg-white shadow-lg rounded-lg overflow-y-auto">
            {/* Chat Header */}
            <div className="bg-blue-500 text-white p-4 font-bold text-center flex justify-between">
                <div className="avatar items-center gap-4">
                    <div className="w-12 rounded-full">
                        <img src={vendorPhoto} alt="Vendor" />
                    </div>
                    <h1>{vendorName}</h1>
                </div>
                <button onClick={handleCloseChat}>
                    <RxCross2 />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex flex-col flex-grow p-4 space-y-4 overflow-y-auto bg-gray-100">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* Display user or vendor photo based on sender */}
                        {message.sender === 'vendor' ? (
                            <div className="flex items-start gap-2">
                                <img
                                    src={vendorPhoto}
                                    alt="Vendor"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="bg-gray-300 text-black p-3 rounded-lg max-w-xs">
                                    {message.text}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2">
                                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                                    {message.text}
                                </div>
                                <img
                                    src={user?.photoURL}
                                    alt="User"
                                    className="w-5 h-5 rounded-full"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Chat Footer */}
            <div className="flex items-center p-4 bg-gray-200 text-black">
                <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-2 ml-2 rounded-full hover:bg-blue-800 focus:outline-none"
                >
                    <FaLocationArrow />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
