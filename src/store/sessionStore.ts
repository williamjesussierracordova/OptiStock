// src/store/sessionStore.ts
import { create } from 'zustand'
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/firebase.js'  // Asegúrate de tener tu configuración de Firebase
import React from 'react'
import { writeUser } from '@/firebase/userController.js'
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

    // Acciones de autenticación
    loginWithEmail: (email: string, password: string, navigate: (path: string) => void) => Promise<void>
    logout: (navigate: (path: string) => void) => Promise<void>
    register: (email: string, password: string, displayName: string, navigate: (path: string) => void) => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
    clearError: () => void
}

const initialSession: UserSession = {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    isAuthenticated: false
}

export const useSessionStore = create<SessionStore>(
    (set) => ({
    session: initialSession,
    loading: false,
    error: null,

    loginWithEmail: async (email: string, password: string, navigate ) => {
        set({ loading: true, error: null })
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const { user } = userCredential
                    set({
                        session: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            isAuthenticated: true
                        },
                        loading: false
                    })
                    navigate('/home')
                }
            })

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
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    set({
                        session: initialSession,
                        loading: false
                    })
                    navigate('/')
                }
            })
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const { user } = userCredential
            await writeUser(user.uid, user.email, user.displayName)

            // Actualizar el perfil con el displayName
            await updateProfile(user, { displayName })

            set({
                session: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    isAuthenticated: true
                },
                loading: false
            })
            
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    navigate('/home')
                }
            })

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

    updateUserProfile: async (displayName: string, photoURL?: string) => {
        set({ loading: true, error: null })
        try {
            const user = auth.currentUser
            if (!user) throw new Error('No hay usuario autenticado')

            await updateProfile(user, { displayName, photoURL })

            set(state => ({
                session: {
                    ...state.session,
                    displayName,
                    photoURL: photoURL || state.session.photoURL
                },
                loading: false
            }))
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Error al actualizar el perfil',
                loading: false
            })
        }
    },

    clearError: () => set({ error: null })
}
))

// Hook para manejar el estado de autenticación
export const useAuthStateListener = () => {
    const updateSession = useSessionStore(state => state)

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                updateSession.session = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    isAuthenticated: true
                }
            } else {
                updateSession.session = initialSession
            }
        })

        return () => unsubscribe()
    }, [updateSession])
}

