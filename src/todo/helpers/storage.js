export const STORAGE_KEY = 'todo-list'

export function readTodosFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function persistTodosToStorage(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}
