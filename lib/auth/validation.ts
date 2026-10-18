export type AuthErrorKey =
  | 'required'
  | 'emailInvalid'
  | 'usernameLength'
  | 'usernameChars'
  | 'passwordShort'
  | 'passwordWeak'
  | 'passwordMismatch'
  | 'termsRequired'

export type FieldErrors<T> = Partial<Record<keyof T, AuthErrorKey>>

export type LoginValues = {
  identifier: string
  password: string
  remember: boolean
}

export type RegisterValues = {
  username: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export type ForgotPasswordValues = {
  email: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/
const USERNAME_MIN = 3
const USERNAME_MAX = 20
const PASSWORD_MIN = 8

function checkEmail(value: string): AuthErrorKey | undefined {
  const email = value.trim()
  if (!email) return 'required'
  if (!EMAIL_PATTERN.test(email)) return 'emailInvalid'
  return undefined
}

function checkUsername(value: string): AuthErrorKey | undefined {
  const username = value.trim()
  if (!username) return 'required'
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) return 'usernameLength'
  if (!USERNAME_PATTERN.test(username)) return 'usernameChars'
  return undefined
}

function checkNewPassword(value: string): AuthErrorKey | undefined {
  if (!value) return 'required'
  if (value.length < PASSWORD_MIN) return 'passwordShort'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'passwordWeak'
  return undefined
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {}
  if (!values.identifier.trim()) errors.identifier = 'required'
  if (!values.password) errors.password = 'required'
  return errors
}

export function validateRegister(values: RegisterValues): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {}

  const username = checkUsername(values.username)
  if (username) errors.username = username

  const email = checkEmail(values.email)
  if (email) errors.email = email

  const password = checkNewPassword(values.password)
  if (password) errors.password = password

  if (!values.confirmPassword) errors.confirmPassword = 'required'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'passwordMismatch'

  if (!values.terms) errors.terms = 'termsRequired'
  return errors
}

export function validateForgotPassword(values: ForgotPasswordValues): FieldErrors<ForgotPasswordValues> {
  const errors: FieldErrors<ForgotPasswordValues> = {}
  const email = checkEmail(values.email)
  if (email) errors.email = email
  return errors
}
