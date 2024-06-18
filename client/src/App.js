import { Button, Checkbox, IconButton, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import "./App.css";
import logo from './shanture-logo.png'; // Ensure you have the logo file

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:3001/tasks');
        setTasks(response.data.data);
    };

    const addTask = async () => {
        if (newTask.trim()) {
            await axios.post('http://localhost:3001/tasks', { task: newTask });
            fetchTasks();
            setNewTask('');
        }
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:3001/tasks/${id}`);
        fetchTasks();
    };

    const toggleTaskCompletion = async (id, completed) => {
        try {
            await axios.put(`http://localhost:3001/tasks/${id}`, { completed: !completed });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task completion status:', error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Task List", 10, 10);
        tasks.forEach((task, index) => {
            doc.text(`${index + 1}. ${task.task} - ${task.completed ? 'Completed' : 'Not Completed'}`, 10, 20 + index * 10);
        });
        doc.save('task-list.pdf');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div>
              <img src={logo} alt="Shanture Logo" style={{ width: '100px', marginBottom: '0px' }} className='company-logo' />
              <p className='company-name'>Shanture</p>
            </div>
            <div className='todo-list-container'>
              <div className='todo-items'>
                <h1>To-Do list application</h1>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <TextField
                      label="New Task"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      style={{ marginBottom: '20px', marginRight: '10px' }}
                  />
                  <Button variant="contained" color="primary" onClick={addTask}>
                      Add Task
                  </Button>
                </div>
                <List>
                    {tasks.map((task) => (
                        <ListItem key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <Checkbox
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id, task.completed)}
                            />
                            <ListItemText primary={task.task} />
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button variant="contained" color="secondary" onClick={downloadPDF} style={{ marginTop: '20px', textAlign: "center" }}>
                  Download PDF
              </Button>
            </div>
        </div>
    );
};

export default App;
