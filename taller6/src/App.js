import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'

export default function App() {
    const { register, handleSubmit, errors } = useForm();
    const [data, setData] = useState([]);
    const onSubmit = data => {
        console.log(data);

        axios.post('http://localhost:8000/persona', data)
            .then(res => {
                console.log(res)
                cargar();
            })

    }

    const cargar = () => {

        axios.get('http://localhost:8000/personas')
            .then(res => {

                setData(res.data.personas);


            })
    }

    useEffect(() => {
        cargar();
    }, [])

    useEffect(() => {
        console.log("TODAS LAS PERSONAS:")

        console.log(data)
    }, [data])

    console.log(errors);

    const columns = [{
            name: 'Nombre',
            field: 'nombre',
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: 'Apellido',
            field: 'apellido',
            options: {
                filter: true,
                sort: false
            }
        }
    ];
    const options = {
        filterType: 'checkbox'
    };
    const datas = data.map(personas => ({
        value: personas._id,
        nombre: personas.nombre,
        apellido: personas.apellido
    }));

    return ( 
        <form onSubmit = { handleSubmit(onSubmit) } >
        <input type = "text"
          placeholder = "Nombre"
          name = "nombre"
          ref = { register({ required: true }) }
        /> 
        <input type = "text"
          placeholder = "Apellido"
          name = "apellido"
          ref = { register }
        />

        
        <input type = "submit" />
        <MaterialDatatable
          title = {"Personas"}
          data = {datas}
          columns = {columns}
          options = {options}
        />
        
        </form>
    );
}