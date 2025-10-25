import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import '../styles.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I help you with food analysis today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        // Mock bot response
        setTimeout(() => {
            const botResponse = { text: 'This is a mock response. In a real app, this would be powered by AI.', sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);

        setInput('');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center text-light">
                <h1 className="display-4 mb-3 dashboard-header">Chat Bot</h1>
                <p className="lead text-secondary mb-5">Ask questions about food ingredients and nutrition.</p>

                <div className="glass-card " style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
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
                                    <strong style={{ color: '#58a6ff' }}>{msg.sender === 'user' ? 'You:' : 'Bot:'}</strong> {msg.text}
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
