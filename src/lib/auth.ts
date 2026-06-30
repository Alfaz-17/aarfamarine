import jwt from 'jsonwebtoken'
import type { NextApiRequest } from 'next'
import { parse } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'aarfa-marine-secret-key-2024'

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getSession(req: NextApiRequest) {
  // 1. Try cookie
  const cookies = parse(req.headers.cookie || '')
  let token = cookies.auth_token

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return payload
}
