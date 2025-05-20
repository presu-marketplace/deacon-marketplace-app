'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ForgotPasswordComponent from './ForgotPasswordComponent'

export default function ForgotPasswordClient() {
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
      title: 'Forgot your password?',
      description: 'Enter your email address and we’ll send you reset instructions.',
      email: 'Email',
      sending: 'Sending...',
      sendResetLink: 'Send reset link',
      success: 'Check your email for reset instructions.',
      loginRedirect: 'Return to login',
      backToLogin: 'Back to Login'
    },
    es: {
      title: '¿Olvidaste tu contraseña?',
      description: 'Ingresa tu correo y te enviaremos instrucciones para restablecerla.',
      email: 'Correo electrónico',
      sending: 'Enviando...',
      sendResetLink: 'Enviar enlace de restablecimiento',
      success: 'Revisa tu correo para las instrucciones.',
      loginRedirect: 'Volver al inicio de sesión',
      backToLogin: 'Volver al inicio'
    }
  }[locale]
  
  return <ForgotPasswordComponent locale={locale} t={t} />
}
