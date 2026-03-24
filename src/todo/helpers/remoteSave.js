export function fakeRemoteSave(text) {
  return new Promise((resolve) => {
    const delay = 200 + Math.random() * 400
    setTimeout(() => {
      resolve({ id: crypto.randomUUID(), text, savedAt: Date.now() })
    }, delay)
  })
}
