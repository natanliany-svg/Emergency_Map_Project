import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const setAuth = useAuthStore(state => state.setAuth)
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <h1>התחברות למערכת</h1>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200'
                    const res = await axios.post(`${API_URL}/api/users/login`, { email, password })
                    
                    if (res.data.success) {
                        const token = res.data.data.token
                        
                        const meRes = await axios.get(`${API_URL}/api/users/me`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        
                        if (meRes.data.success) {
                            setAuth(token, meRes.data.data)
                            navigate('/')
                        }
                    } else {
                        setError(res.data.message || 'התחברות נכשלה')
                    }
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        setError(err.response?.data?.message || 'שגיאת שרת')
                    } else {
                        setError('שגיאה לא צפויה')
                    }
                }
            }}>
                <div>
                    <label>אימייל:</label>
                    <br />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <br />
                <div>
                    <label>סיסמה:</label>
                    <br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <br />
                <button type="submit">התחבר</button>
            </form>
            <br />
            <Link to="/register">אין לך חשבון? הירשם כאן</Link>
        </div>
    )
}



