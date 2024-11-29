'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSessionStore } from '@/store/sessionStore'
import {readUser} from '../../firebase/userController'

interface ProfileData {
  email: string
  companyName: string
  companyId: string
  contactName: string
  telephoneNumber: string
  contactTelephoneNumber: string
}

export const ProfileComponent: React.FC = () => {
  const { session,updateUserProfile } = useSessionStore()
  const [profile, setProfile] = useState<ProfileData>({
    email: session.email || '',
    companyName: '',
    companyId: '',
    contactName: '',
    telephoneNumber: '',
    contactTelephoneNumber: ''
  })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await readUser(session.uid)
        console.log(userData)
        setUser(userData)
        setProfile({
          email: userData.email,
          companyName: userData.displayname,
          companyId: userData.rucCompany,
          contactName: userData.contactName,
          telephoneNumber: userData.companyPhone,
          contactTelephoneNumber: userData.contactPhone
        })
      } catch (e) {
        console.log(e)
      }
    }
  
    if (session.uid) {
      fetchData()
    }
  }, [session.uid])
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile to your backend
    try{
      await updateUserProfile(profile.contactName,'',profile.companyName,profile.companyId,profile.contactName,profile.telephoneNumber,profile.contactTelephoneNumber)

    }
    catch(e){
      console.log(e)
    }
    console.log('Updated profile:', profile)
    // You can add logic here to show a success message or handle errors
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Perfil de la cuenta
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre Empresa</Label>
              <Input
                id="companyName"
                name="companyName"
                value={profile.companyName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">RUC Empresa</Label>
              <Input
                id="companyId"
                name="companyId"
                value={profile.companyId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Representante Empresa</Label>
              <Input
                id="contactName"
                name="contactName"
                value={profile.contactName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephoneNumber">Telefono Empresa</Label>
              <Input
                id="telephoneNumber"
                name="telephoneNumber"
                value={profile.telephoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactTelephoneNumber">Telefono Representante</Label>
              <Input
                id="contactTelephoneNumber"
                name="contactTelephoneNumber"
                value={profile.contactTelephoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Update Profile</Button>
        </CardFooter>
      </form>
    </Card>
  )
}