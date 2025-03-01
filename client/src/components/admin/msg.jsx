import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function Msg() {
    const [msg, setMsg] = useState([]);
    
    useEffect(() => {
        const url = import.meta.env.VITE_BASE_URL;
        axios.get(`${url}/admin/viewmessages`)
            .then(res => setMsg(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleResponse = (email) => {
        const url = import.meta.env.VITE_BASE_URL;
        const responseMessage = "Your message has been received, we will get back to you shortly.";
        axios.post(`${url}/admin/respond`, { email, message: responseMessage ,status: 'responded'})
            .then(res => {
                alert(res.data.msg);
                setMsg(prevMsg =>
                    prevMsg.map(item =>
                        item.email === email ? { ...item, status: 'responded' } : item
                    )
                );
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        const url = import.meta.env.VITE_BASE_URL;
        axios.delete(`${url}/admin/deletemessage/${id}`)
            .then(res => {
                alert(res.data.msg);
                setMsg(prevMsg => prevMsg.filter(item => item._id !== id));
            })
            .catch(err => console.log(err));
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Email</TableCell>
                        <TableCell align="center">Message</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {msg.map((message, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{message.name}</TableCell>
                            <TableCell align="center">{message.email}</TableCell>
                            <TableCell align="center">{message.message}</TableCell>
                            <TableCell align="center">
                                {message.status === "pending" ? (
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleResponse(message.email)}
                                    >
                                        Send Response
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        color="secondary"
                                        onClick={() => handleDelete(message._id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
