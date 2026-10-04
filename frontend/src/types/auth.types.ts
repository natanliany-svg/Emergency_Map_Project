export interface User {
    _id: string
    email: string
    fullName: string
    role: 'viewer' | 'editor' | 'admin'
}

export interface AuthState {
    token: string | null
    user: User | null
    setAuth: (token: string, user: User) => void
    logout: () => void
}