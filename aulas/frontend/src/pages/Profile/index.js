import React, {useEffect, useState} from 'react'
import logoImg from '../../assets/logo.png'
import {FiPower, FiTrash2} from 'react-icons/fi'
import api from '../../services/api'
import {Link, useHistory} from 'react-router-dom'
import './style.css'

export default function Profile() {
    const [incidents, setIncidents] = useState([])

    const ongName = localStorage.getItem('ongName')
    const ongId = localStorage.getItem('ongId')

    const history = useHistory()

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data)
        })
    }, [ongId])

    async function handleDeleteIncident(id) {
        try{
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            })
        setIncidents(incidents.filter(incident => incident.id !== id))
        } catch (err) {
            alert('Erro ao deletar caso. Tente novamente.')
        }
    }

    function handleLogout(){
        localStorage.clear()
        history.push('/')
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Logo do Be The Hero" /> 
                <span>Bem-vinda {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
               {incidents.map(incident => {
                   const {id, title, description, value} = incident
                   return(
                        <li key={id}>
                            <strong>CASO:</strong>
                            <p>{title}</p>

                            <strong>DESCRIÇÃO</strong>
                            <p>{description}</p>

                            <strong>VALOR:</strong>
                            <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value)}</p>

                            <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                                <FiTrash2 size={20} color="#a8a8b3"/> 
                            </button>
                        </li>
                    )
               })}
            </ul>
        </div>
    )
}