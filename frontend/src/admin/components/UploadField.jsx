import { useRef, useState } from 'react';
import { adminApi } from '../../services/adminApi';

const iconPaths = {
  upload: <path d="M12 16V6m0 0-3 3m3-3 3 3M5 18h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />
};

function isVideo(accept, resourceType) {
  return resourceType === 'video' || String(accept || '').includes('video');
}

export default function UploadField({
  label,
  value,
  onChange,
  accept = 'image/*',
  resourceType = 'image',
  multiple = false,
  helperText = 'Drop files here or click to upload.',
  error,
  disabled,
  onUploadingChange,
  onUploaded,
  onFilesUploaded
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState('');

  const previewIsVideo = isVideo(accept, resourceType);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setLocalError('');
    onUploadingChange?.(true);
    try {
      const result = await adminApi.uploadFile({
        file,
        resourceType,
        onProgress: setProgress
      });
      const url = result?.url || result?.secureUrl || result?.data?.url || result?.data?.secureUrl || '';
      onChange(url);
      onUploaded?.(url, result);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const handleFiles = async (files) => {
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return;
    if (multiple && list.length > 1) {
      setUploading(true);
      setProgress(0);
      setLocalError('');
      onUploadingChange?.(true);
          try {
            const results = [];
            for (let index = 0; index < list.length; index += 1) {
          const file = list[index];
          const result = await adminApi.uploadFile({
            file,
            resourceType,
            onProgress: (progressValue) => {
              const scaled = Math.round(((index + progressValue / 100) / list.length) * 100);
              setProgress(scaled);
            }
          });
          results.push(result);
          }
        onFilesUploaded?.(results);
      } catch (err) {
        setLocalError(err.message);
      } finally {
        setUploading(false);
        onUploadingChange?.(false);
      }
      return;
    }

    await uploadFile(list[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (disabled) return;
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleRemove = () => {
    onChange('');
    setProgress(0);
    setLocalError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="grid gap-3">
      <label className="label">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openPicker();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed px-5 py-6 transition ${
          disabled ? 'cursor-not-allowed border-border bg-background/50' : 'cursor-pointer border-border bg-background hover:border-primary-300 hover:bg-primary-50/40'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d={iconPaths.upload.props.d} />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{helperText}</p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${Math.max(progress, 20)}%` }} />
          </div>
          <p className="text-xs font-medium text-muted">{`Uploading... ${progress || 0}%`}</p>
        </div>
      )}

      {value && (
        <div className="overflow-hidden rounded-3xl border border-border bg-white">
          {previewIsVideo ? (
            <video src={value} controls className="h-56 w-full bg-black object-cover" />
          ) : (
            <img src={value} alt={label} className="h-56 w-full object-cover" />
          )}
          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <p className="min-w-0 flex-1 truncate text-xs text-muted">{value}</p>
            <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:bg-background">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d={iconPaths.x.props.d} />
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}

      {localError && <p className="text-sm text-rose-700">{error || localError}</p>}
    </div>
  );
}
