'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ForgotPasswordComponent from './ForgotPasswordComponent'

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang')

  const [locale, setLocale] = useState<'en' | 'es'>('en')

  useEffect(() => {
    if (lang === 'es' || lang === 'en') {
      setLocale(lang)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [lang])

  const t = {
    en: {
      title: 'Reset your password',
      description: "Enter your email and we'll send you a link to reset your password.",
      email: 'Email',
      sending: 'Sending...',
      sendResetLink: 'Send Reset Link',
      success: '📩 Check your inbox for the password reset link.',
      loginRedirect: 'Remembered your password?',
      backToLogin: 'Go back to login'
    },
    es: {
      title: 'Restablecer tu contraseña',
      description: 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.',
      email: 'Correo electrónico',
      sending: 'Enviando...',
      sendResetLink: 'Enviar enlace de restablecimiento',
      success: '📩 Revisa tu bandeja de entrada para restablecer tu contraseña.',
      loginRedirect: '¿Recordaste tu contraseña?',
      backToLogin: 'Volver al inicio de sesión'
    }
  }[locale]

  return <ForgotPasswordComponent locale={locale} t={t} />
}
