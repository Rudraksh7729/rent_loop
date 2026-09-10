export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  disabled = false,
  hint,
}) {
  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="mb-1.5 block font-medium text-ink">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        className="input-rl"
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
      />
      {hint && !error ? (
        <span id={`${id}-hint`} className="mt-1.5 block text-xs text-ink-soft">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${id}-error`} className="mt-1.5 block text-sm text-accent" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
