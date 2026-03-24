export function TodoRow({ todo, onToggle, onDelete }) {
  return (
    <li
      style={{ marginBottom: 8 }}
      className={todo.done ? 'todo-row done' : 'todo-row'}
    >
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
      <button type="button" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  )
}
