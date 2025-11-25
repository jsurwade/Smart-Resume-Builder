import { v4 as uuidv4 } from 'uuid'

const KEY = 'resume_builder_user_id'

export function getOrCreateUserId() {
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = uuidv4()
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    // If localStorage is unavailable, generate ephemeral id
    return uuidv4()
  }
}

export function getUserId() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}
