import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/firebase.js'
import { writeUser } from '@/firebase/userController.js'
import { updateProfileUser} from '../firebase/userController.js'
import { useNavigate } from 'react-router-dom'
import React from 'react'
const auth = getFirebaseAuth()

interface UserSession {
    uid: string | null
    email: string | null
    displayName: string | null
    photoURL: string | null
    isAuthenticated: boolean
}

interface SessionStore {
    session: UserSession
    loading: boolean
    error: string | null
    initialized: boolean
    setSession: (user: User | null) => void
    loginWithEmail: (email: string, password: string, navigate: (path: string) => void) => Promise<void>
    logout: (navigate: (path: string) => void) => Promise<void>
    register: (email: string, password: string, displayName: string, navigate: (path: string) => void) => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updateUserProfile: (displayName: string, photoURL?: string , 
        companyName?: string,ruc?: string, contactName?:string, phoneNumberCompany?:string, phoneNumberContact?: string
     ) => Promise<void>
    clearError: () => void
}

const initialSession: UserSession = {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    isAuthenticated: false
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set) => ({
            session: initialSession,
            loading: false, // Start as true to show loading state during initialization
            error: null,
            initialized: false,

            setSession: (user: User | null) => {
                if (user) {
                    set({
                        session: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            isAuthenticated: true
                        },
                        loading: false,
                        initialized: true,
                    })
                } else {
                    set({
                        session: initialSession,
                        loading: false,
                        initialized: true
                    })
                }
            },

            loginWithEmail: async (email: string, password: string, navigate) => {
                set({ loading: true, error: null })
                try {
                    const { user } = await signInWithEmailAndPassword(auth, email, password)
                    set({
                        session: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            isAuthenticated: true
                        },
                        loading: false,
                        initialized: true
                    })
                    navigate('/home')
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error de autenticación',
                        loading: false
                    })
                }
            },

            logout: async (navigate) => {
                set({ loading: true, error: null })
                try {
                    await signOut(auth)
                    set({
                        session: initialSession,
                        loading: false,
                        initialized: false
                    })
                    navigate('/')
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al cerrar sesión',
                        loading: false
                    })
                }
            },

            register: async (email: string, password: string, displayName: string, navigate) => {
                set({ loading: true, error: null })
                try {
                    const { user } = await createUserWithEmailAndPassword(auth, email, password)
                    await writeUser(user.uid, user.email, displayName)
                    await updateProfile(user, { displayName })

                    set({
                        session: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            isAuthenticated: true
                        },
                        loading: false,
                        initialized: true
                    })
                    navigate('/home')
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error en el registro',
                        loading: false
                    })
                }
            },

            resetPassword: async (email: string) => {
                set({ loading: true, error: null })
                try {
                    await sendPasswordResetEmail(auth, email)
                    set({ loading: false })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al restablecer la contraseña',
                        loading: false
                    })
                }
            },

            updateUserProfile: async (displayName: string, photoURL?: string,
                companyName?: string,ruc?: string, contactName?:string, phoneNumberCompany?:string, phoneNumberContact?: string
            ) => {
                set({ loading: true, error: null })
                try {
                    const user = auth.currentUser
                    if (!user) throw new Error('No hay usuario autenticado')

                    await updateProfile(user, { displayName, photoURL })
                    await updateProfileUser(user.uid, companyName, ruc,contactName,phoneNumberContact,phoneNumberCompany)
                    set(state => ({
                        session: {
                            ...state.session,
                            displayName,
                            photoURL: photoURL || state.session.photoURL
                        },
                        loading: false,
                        initialized: true
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al actualizar el perfil',
                        loading: false
                    })
                }
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'session-storage',
            partialize: (state) => ({
                session: state.session
            })
        }
    )
)

// AuthProvider component to handle auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setSession = useSessionStore(state => state.setSession)

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setSession(user)
        })

        return () => unsubscribe()
    }, [setSession])

    return children
}

// Custom hook for protected routes
export function useRequireAuth(redirectTo: string = '/') {
    const { session, initialized } = useSessionStore()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (initialized && !session.isAuthenticated) {
            navigate(redirectTo)
        }
    }, [initialized, session.isAuthenticated, navigate, redirectTo])

    return session
}