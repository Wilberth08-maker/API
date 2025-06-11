import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return(JSON.parse(data));
    } catch (error) {
        console.log(error);
        
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.log(error); 
    }
};

readData();

app.get('/',(req, res) =>{
    res.send('Welcome to my first API with Node.js!');
})

app.get('/tareas', (req, res) => {
    const data = readData();
    res.json(data.tareas);
});

app.get('/tareas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const tarea = data.tareas.find((tarea) => tarea.id === id);
    res.json(tarea);
});

app.post("/tareas", (req, res) => {
    const data = readData();
    const body = req.body;
    const newTarea = {
        id: data.tareas.length + 1,
        ...body,
    };
    data.tareas.push(newTarea);
    writeData(data);
    res.json(newTarea);
});

app.put("/tareas/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const tareaIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas[tareaIndex] = {
        ...data.tareas[tareaIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Tarea updated succesfully"});
});

app.delete("/tareas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const tareaIndex = data.tareas.findIndex((tarea) => tarea.id === id);
    data.tareas.splice(tareaIndex, 1);
    writeData(data);
    res.json({ message: "Tarea deleted succesfully"});
});



app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


