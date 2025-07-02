export type SmartdropMetadata = {
  name: string;
  type: string;
  size: string;
  extension: string;
  preview?: string;
};

export function extractMetadata(file: File): SmartdropMetadata {
  const extension = file.name.split('.').pop() || '';
  const sizeKB = (file.size / 1024).toFixed(1) + ' KB';

  return {
    name: file.name,
    type: file.type || 'unknown',
    size: sizeKB,
    extension,
    preview: file.type.startsWith('text/') ? '' : undefined, // could be filled later
  };
}
