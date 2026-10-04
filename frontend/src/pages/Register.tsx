import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const setAuth = useAuthStore(state => state.setAuth)
    const navigate = useNavigate()

    return (
        <div className="page-container">
            <h1>הרשמה למערכת</h1>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                try {
                    const res = await axios.post('http://localhost:3200/api/users/register', { email, password })
                    if (res.data.success) {
                        const token = res.data.data.token
                        const meRes = await axios.get('http://localhost:3200/api/users/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                        
                        if (meRes.data.success) {
                            setAuth(token, meRes.data.data)
                            navigate('/')
                        }
                    } else {
                        setError('שגיאה בהרשמה')
                    }
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        setError(err.response?.data?.message || 'שגיאת רשת או שהמשתמש קיים')
                    } else {
                        setError('שגיאה לא צפויה')
                    }
                }
            }}>
                <div>
                    <label>אימייל:</label>
                    <br />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <div>
                    <label>סיסמה (לפחות 8 תווים):</label>
                    <br />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        minLength={8}
                    />
                </div>
                <br />
                <button type="submit">צור משתמש והתחבר</button>
            </form>
            <br />
            <Link to="/login">כבר יש לך חשבון? התחבר כאן</Link>
        </div>
    )
}



