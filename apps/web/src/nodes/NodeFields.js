const labelClass = 'flex flex-col gap-1 text-xs text-slate-300';
const controlClass =
  'nodrag rounded-md bg-panelLight border border-borderSoft px-2 py-1 text-sm ' +
  'text-slate-100 outline-none focus:border-accent focus:ring-1 focus:ring-accent';

export const TextField = ({ label, value, onChange, placeholder }) => (
  <label className={labelClass}>
    {label && <span>{label}</span>}
    <input
      type="text"
      className={controlClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

export const SelectField = ({ label, value, onChange, options = [] }) => (
  <label className={labelClass}>
    {label && <span>{label}</span>}
    <select
      className={controlClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const text = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {text}
          </option>
        );
      })}
    </select>
  </label>
);

export const TextAreaField = ({ label, value, onChange, placeholder, textareaRef, style }) => (
  <label className={labelClass}>
    {label && <span>{label}</span>}
    <textarea
      ref={textareaRef}
      className={`${controlClass} resize-none overflow-hidden leading-snug`}
      value={value}
      placeholder={placeholder}
      style={style}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
