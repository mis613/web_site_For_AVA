import { useEffect, useRef } from 'react';

const toolbar = [
  { label: 'B', title: 'Bold', command: 'bold' },
  { label: 'I', title: 'Italic', command: 'italic' },
  { label: 'U', title: 'Underline', command: 'underline' },
  { label: '• List', title: 'Bullet list', command: 'insertUnorderedList' },
  { label: '1. List', title: 'Numbered list', command: 'insertOrderedList' }
];

function formatCommand(command) {
  document.execCommand(command, false, null);
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write content here...' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const emitChange = () => {
    onChange(ref.current?.innerHTML || '');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex flex-wrap gap-2 border-b border-border bg-background/70 p-3">
        {toolbar.map((item) => (
          <button
            key={item.command}
            type="button"
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-ink hover:border-primary-200 hover:text-primary-700"
            title={item.title}
            onMouseDown={(event) => {
              event.preventDefault();
              formatCommand(item.command);
              emitChange();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        className="min-h-64 px-4 py-3 text-sm leading-7 text-ink outline-none"
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        onInput={emitChange}
        data-placeholder={placeholder}
        style={{
          whiteSpace: 'pre-wrap'
        }}
      />
      <style>{`
        [contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
