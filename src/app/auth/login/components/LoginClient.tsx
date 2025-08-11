'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoginComponent from './LoginForm'

export default function LoginPageClient() {
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
      loginTo: 'Welcome back',
      continueWithGoogle: 'Log in with Google',
      redirecting: 'Redirecting...',
      orLoginWithEmail: 'or log in with email',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      loggingIn: 'Logging in...',
      login: 'Log in',
      noAccount: "Don't have an account?",
      register: 'Sign up'
    },
    es: {
      loginTo: 'Bienvenido nuevamente',
      continueWithGoogle: 'Iniciar sesión con Google',
      redirecting: 'Redireccionando...',
      orLoginWithEmail: 'o inicia sesión con correo electrónico',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      loggingIn: 'Iniciando sesión...',
      login: 'Iniciar sesión',
      noAccount: '¿No tienes una cuenta?',
      register: 'Regístrate'
    }
  }[locale]

  return <LoginComponent locale={locale} t={t} />
}
