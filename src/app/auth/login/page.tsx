'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginPage from './LoginComponent'

export default function Page() {
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
      loginTo: 'Login to',
      continueWithGoogle: 'Continue with Google',
      redirecting: 'Redirecting...',
      orLoginWithEmail: 'or login with email',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      loggingIn: 'Logging in...',
      login: 'Login'
    },
    es: {
      loginTo: 'Iniciar sesión en',
      continueWithGoogle: 'Continuar con Google',
      redirecting: 'Redireccionando...',
      orLoginWithEmail: 'o iniciar sesión con correo',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      loggingIn: 'Iniciando sesión...',
      login: 'Iniciar sesión'
    }
  }[locale]

  return <LoginPage locale={locale} t={t} />
}
