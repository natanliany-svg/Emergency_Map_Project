import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import IncidentForm from './IncidentForm'
import { useAuthStore } from '../store/authStore'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const myIcon = L.icon({
    iconUrl,
    shadowUrl
})

interface Incident {
    _id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    location: { lat: number; lng: number };
    createdBy: string;
}

function MapClick({ onClick }: { onClick: (latlng: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng)
        }
    })
    return null
}

function LocationMarker() {
    const map = useMap()
    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, map.getZoom())
        })
    }, [map])
    return null
}

export default function MapComponent() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [draftLocation, setDraftLocation] = useState<{lat: number, lng: number} | null>(null)
    const [filterCategory, setFilterCategory] = useState('all')
    
    const token = useAuthStore(state => state.token)
    const user = useAuthStore(state => state.user)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200'

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/incidents`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.data.success) {
                    setIncidents(res.data.data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchIncidents()
    }, [token, API_URL])

    const fetchIncidentsManual = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/incidents`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.success) {
                setIncidents(res.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleIncidentCreated = () => {
        setDraftLocation(null)
        fetchIncidentsManual()
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/api/incidents/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchIncidentsManual()
        } catch (err) {
            console.log(err)
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await axios.patch(`${API_URL}/api/incidents/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchIncidentsManual()
        } catch (err) {
            console.log(err)
        }
    }

    const filteredIncidents = incidents.filter(inc => 
        filterCategory === 'all' || inc.category === filterCategory
    )

    return (
        <div>
            <div className="filter-box">
                <label>סנן לפי קטגוריה: </label>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">הכל</option>
                    <option value="general">כללי</option>
                    <option value="fire">אש</option>
                    <option value="medical">רפואה</option>
                    <option value="police">משטרה</option>
                </select>
            </div>

            <MapContainer center={[31.0461, 34.8516]} zoom={7} className="map-container">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <LocationMarker />
                <MapClick onClick={setDraftLocation} />

                {draftLocation && (
                    <Popup position={[draftLocation.lat, draftLocation.lng]}>
                        <IncidentForm 
                            lat={draftLocation.lat} 
                            lng={draftLocation.lng} 
                            onSuccess={handleIncidentCreated}
                        />
                    </Popup>
                )}
                
                {filteredIncidents.map((incident) => {
                    const isOwnerOrAdmin = user && (user._id === incident.createdBy || user.role === 'admin')
                    return (
                        <Marker 
                            key={incident._id} 
                            position={[incident.location.lat, incident.location.lng]}
                            icon={myIcon}
                        >
                            <Popup>
                                <strong>{incident.title}</strong>
                                <br />
                                {incident.description}
                                <br />
                                קטגוריה: {incident.category} | סטטוס: {incident.status}
                                
                                {isOwnerOrAdmin && (
                                    <div>
                                        <hr />
                                        <select 
                                            value={incident.status}
                                            onChange={e => handleStatusUpdate(incident._id, e.target.value)}
                                        >
                                            <option value="open">פתוח</option>
                                            <option value="in_progress">בטיפול</option>
                                            <option value="closed">סגור</option>
                                        </select>
                                        <button onClick={() => handleDelete(incident._id)} className="delete-btn">
                                            מחק תקרית
                                        </button>
                                    </div>
                                )}
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}


