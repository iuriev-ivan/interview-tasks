import { useState, useEffect, useRef, useMemo } from 'react'
import { readTodosFromStorage, persistTodosToStorage } from '../helpers/storage.js'
import { fakeRemoteSave } from '../helpers/remoteSave.js'
import { TodoForm } from './TodoForm.jsx'
import { TodoRow } from './TodoRow.jsx'

export function TodoApp() {
  const [todos, setTodos] = useState(() => readTodosFromStorage())
  const [input, setInput] = useState('')
  const [listFilter, setListFilter] = useState('all')

  const inputRef = useRef(null)

  const visibleTodos = useMemo(() => {
    if (listFilter === 'active') return todos.filter((t) => !t.done)
    if (listFilter === 'completed') return todos.filter((t) => t.done)
    return todos
  }, [todos, listFilter])

  useEffect(() => {
    document.title = `Todos (${todos.length})`
  }, [])

  useEffect(() => {
    persistTodosToStorage(todos)
  })

  const addTodo = () => {
    const text = input.trim()
    if (!text) return

    setTimeout(() => {
      const id = crypto.randomUUID()
      setTodos([...todos, { id, text, done: false }])
    }, 0)

    setInput('')

    fakeRemoteSave(text).then((remote) => {
      setTodos((prev) => [...prev, { ...remote, done: false }])
    })
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
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
        <p className="todo-stats">{todos.length} tasks</p>
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
