'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import RegisterComponent from './RegisterForm'

export default function RegisterPageClient() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  const [locale, setLocale] = useState<'en' | 'es'>('en')

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const t = {
    en: {
      createAccount: 'Create your account',
      continueWithGoogle: 'Sign up with Google',
      redirecting: 'Redirecting...',
      orSignupWithEmail: 'sign up with email',
      email: 'Email',
      password: 'Password',
      registering: 'Registering...',
      register: 'Register',
      alreadyHaveAccount: 'Already have an account?',
      login: 'Log in'
    },
    es: {
      createAccount: 'Crea tu cuenta',
      continueWithGoogle: 'Registrarse con Google',
      redirecting: 'Redireccionando...',
      orSignupWithEmail: 'registrarte con tu correo',
      email: 'Correo electrónico',
      password: 'Contraseña',
      registering: 'Registrando...',
      register: 'Registrarse',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      login: 'Iniciar sesión'
    }
  }[locale]

  return <RegisterComponent locale={locale} t={t} />
}
