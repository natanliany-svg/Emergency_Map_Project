import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFillName] = useState('')
    const [role, setRole] = useState('viewer')
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
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200'
                    const res = await axios.post(`${API_URL}/api/users/register`, { email, password, fullName,role })
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
                    <label>שם מלא (לפחות שתי תווים):</label>
                    <br />
                    <input
                        type="text"
                        value={fullName}
                        onChange={e => setFillName(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>תפקיד:</label>
                    <br />
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="viewer">צופה</option>
                        <option value="editor">עורך</option>
                        <option value="admin">מנהל</option>
                    </select>
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






