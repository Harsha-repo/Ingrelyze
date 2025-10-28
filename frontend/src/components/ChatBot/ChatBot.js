import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import '../styles.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I help you with food analysis today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const clearChat = () => {
        setMessages([{ text: 'Hello! How can I help you with food analysis today?', sender: 'bot' }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        try {
            const query = encodeURIComponent(input);
            const response = await fetch(`http://localhost:5678/webhook/chat-bot/?query=${query}`, { timeout: 30000 });
            if (response.ok) {
                const data = await response.json();
                const botResponse = { text: data.output || 'No response from bot.', sender: 'bot' };
                setMessages(prev => [...prev, botResponse]);
            } else {
                const errorResponse = { text: `Error: ${response.status} ${response.statusText}`, sender: 'bot' };
                setMessages(prev => [...prev, errorResponse]);
            }
        } catch (error) {
            const errorResponse = { text: `Error: ${error.message}`, sender: 'bot' };
            setMessages(prev => [...prev, errorResponse]);
        }

        setInput('');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center text-light">
                <h1 className="display-4 mb-3 dashboard-header">Chat Bot</h1>
                <p className="lead text-secondary mb-5">Ask questions about food ingredients and nutrition.</p>

                <div className="glass-card " style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', height: '500px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                        <Button variant="outline-secondary" onClick={clearChat} style={{ color: '#e6edf3', borderColor: '#e6edf3', fontSize: '0.8rem' }}>
                            Clear Chat
                        </Button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingTop: '3rem' }}>
                        <ListGroup variant="flush">
                            {messages.map((msg, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className={`text-start ${msg.sender === 'user' ? 'text-end' : ''}`}
                                    style={{
                                        backgroundColor: msg.sender === 'user' ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        color: '#e6edf3'
                                    }}
                                >
                                    <strong style={{ color: '#58a6ff' }}>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong>{' '}
                                    {msg.sender === 'bot' ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                    <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="form-control-glass me-2"
                            />
                            <Button className="lookup-button" onClick={handleSend} disabled={!input.trim()}>
                                Send
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
