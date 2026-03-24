export function TodoForm({ inputRef, value, onChange, onAdd }) {
  return (
    <div className="todo-form">
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder="What needs to be done?"
      />
      <button type="button" onClick={onAdd}>
        Add
      </button>
    </div>
  )
}
