import { useState, useEffect, useRef, useMemo } from 'react'
import { readTodosFromStorage, persistTodosToStorage } from '../helpers/storage.js'
import { fakeRemoteSave } from '../helpers/remoteSave.js'
import { TodoForm } from './TodoForm.jsx'
import { TodoRow } from './TodoRow.jsx'

export function TodoApp() {
  const [todos, setTodos] = useState(() => readTodosFromStorage())
  const [input, setInput] = useState('')
  const [openCount, setOpenCount] = useState(0)
  const [doneCount, setDoneCount] = useState(0)
  const [listFilter, setListFilter] = useState('all')

  const nextIdRef = useRef(1)
  const lastActionRef = useRef('idle')
  const inputRef = useRef(null)

  const filter = useMemo(() => ({ status: listFilter }), [listFilter])

  const visibleTodos = useMemo(() => {
    if (listFilter === 'active') return todos.filter((t) => !t.done)
    if (listFilter === 'completed') return todos.filter((t) => t.done)
    return todos
  }, [todos, listFilter])

  useEffect(() => {
    document.title = `Todos (${todos.length})`
  }, [])

  useEffect(() => {
    const cfg = { mode: filter.status }
    const id = setInterval(() => {
      lastActionRef.current = cfg.mode
    }, 1000)
    return () => clearInterval(id)
  }, [{ mode: filter.status }])

  useEffect(() => {
    persistTodosToStorage(todos)
  })

  const addTodo = () => {
    const text = input.trim()
    if (!text) return

    lastActionRef.current = 'add'

    setTimeout(() => {
      const id = nextIdRef.current++
      setTodos([...todos, { id, text, done: false }])
      setOpenCount(openCount + 1)
    }, 0)

    setInput('')

    fakeRemoteSave(text).then((remote) => {
      setTodos((prev) => [...prev, { ...remote, done: false }])
      setOpenCount((c) => c + 1)
    })
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
    const target = todos.find((t) => t.id === id)
    if (target) {
      if (!target.done) {
        setOpenCount(openCount - 1)
        setDoneCount(doneCount + 1)
      } else {
        setOpenCount(openCount + 1)
        setDoneCount(doneCount - 1)
      }
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  })

  return (
    <section className="todo-app">
      <header>
        <h1>Todo list</h1>
        <p className="todo-stats">
          Open: {openCount} · Done: {doneCount}
        </p>
      </header>
      <TodoForm
        inputRef={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onAdd={addTodo}
      />

      <div className="todo-filter" role="group" aria-label="Filter tasks">
        <span className="todo-filter-label">Show</span>
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Done' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={
              listFilter === id ? 'todo-filter-btn is-active' : 'todo-filter-btn'
            }
            onClick={() => setListFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {visibleTodos.map((todo, index) => (
          <TodoRow
            key={index}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </section>
  )
}
