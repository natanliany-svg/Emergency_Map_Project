import { useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function IncidentForm({ lat, lng, onSuccess }: { lat: number, lng: number, onSuccess: () => void }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('general')
    const token = useAuthStore(state => state.token)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200'
            const res = await axios.post(`${API_URL}/api/incidents`, {
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
        } catch (error) {
            console.log(error)
            alert('שגיאה ביצירת תקרית')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="incident-form">
            <h3>דיווח על תקרית חדשה</h3>
            <input 
                type="text" 
                placeholder="כותרת" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
            />
            <br />
            <textarea 
                placeholder="תיאור" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
            />
            <br />
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="general">כללי</option>
                <option value="fire">אש</option>
                <option value="medical">רפואה</option>
                <option value="police">משטרה</option>
            </select>
            <br />
            <button type="submit">שלח דיווח</button>
        </form>
    )
}


