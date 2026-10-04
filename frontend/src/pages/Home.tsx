import { useAuthStore } from '../store/authStore'
import MapComponent from '../components/MapComponent'

export default function Home() {
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)

    return (
        <div className="page-container">
            <h1>מפת התקריות הלאומית</h1>
            <p>מחובר כ: {user?.fullName} ({user?.role})</p>
            <button onClick={logout}>התנתק</button>
            <br /><br />
            <MapComponent />
        </div>
    )
}