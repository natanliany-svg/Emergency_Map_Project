import { useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

interface Props {
    lat: number;
    lng: number;
    onSuccess: () => void;
}

export default function IncidentForm({ lat, lng, onSuccess }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('general')
    
    const token = useAuthStore(state => state.token)

    return (
        <form onSubmit={async (e) => {
            e.preventDefault()
            try {
                const res = await axios.post('http://localhost:3200/api/incidents', {
                    title,
                    description,
                    category,
                    location: { lat, lng }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (res.data.success) {
                    onSuccess()
                }
            } catch (err) {
                console.log('Error creating incident', err)
            }
        }}>
            <h3>דיווח תקרית</h3>
            <label>כותרת:</label><br/>
            <input required value={title} onChange={e => setTitle(e.target.value)} /><br/>
            
            <label>תיאור:</label><br/>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} /><br/>
            
            <label>קטגוריה:</label><br/>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="general">כללי</option>
                <option value="fire">אש</option>
                <option value="medical">רפואה</option>
                <option value="police">משטרה</option>
            </select><br/><br/>
            
            <button type="submit">דווח למערכת</button>
        </form>
    )
}


