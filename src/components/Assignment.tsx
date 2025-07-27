import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../App.css';
import { Trash } from 'lucide-react';



interface UploadedFont {
  id: string;
  file: File;
}

function Assignment() {
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const ttfFiles = acceptedFiles
      .filter(file => file.name.endsWith('.ttf'))
      .map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
      }));
    setUploadedFonts(prev => [...prev, ...ttfFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'font/ttf': ['.ttf'] },
    multiple: true,
  });

  const handleDelete = (id: string) => {
    setUploadedFonts(prev => prev.filter(font => font.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-center items-center bg-gray-100">
        <div
          {...getRootProps()}
          className="w-1/2 border-2 border-dashed border-gray-400 p-10 rounded-md bg-white text-center cursor-pointer hover:bg-gray-50 transition"
        >
          <input {...getInputProps()} />
          <div className="text-gray-500">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l8-8 8 8M12 4v12"
              />
            </svg>
            <p className="mt-2 text-sm">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">Only TTF File Allowed</p>
          </div>
        </div>
      </div>

      {/* Font list */}
      <div className="mt-10 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-semibold px-4 py-3 border-b">Our Fonts</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Font Name</th>
              <th className="px-4 py-2">Preview</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFonts.map((font) => (
              <tr key={font.id} className="border-t">
                <td className="px-4 py-2">{font.file.name}</td>
                <td className="px-4 py-2 text-gray-500">Example Style</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(font.id)}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
            {uploadedFonts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 px-4 py-4">
                  No fonts uploaded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignment;
