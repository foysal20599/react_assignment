import { Trash, FilePenLine } from 'lucide-react';
import { useState } from 'react';



interface FontRow {
  id: string;
  fontName: string;
  selectedFont: string;
  size: number;
  priceChange: number;
}

interface FontGroup {
  id: string;
  name: string;
  fonts: string[]; 
}

function FontGroupForm() {
  const [fonts, setFonts] = useState<FontRow[]>([
    { id: crypto.randomUUID(), fontName: '', selectedFont: '', size: 1.0, priceChange: 0 },
  ]);
  const [groupTitle, setGroupTitle] = useState('');
  const [fontGroups, setFontGroups] = useState<FontGroup[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null); 

  const handleAddRow = () => {
    setFonts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), fontName: '', selectedFont: '', size: 1.0, priceChange: 0 },
    ]);
  };

  const handleChange = (id: string, field: keyof FontRow, value: string | number) => {
    setFonts((prev) =>
      prev.map((font) => (font.id === id ? { ...font, [field]: value } : font))
    );
  };

  const handleDeleteRow = (id: string) => {
    if (fonts.length <= 1) return;
    setFonts((prev) => prev.filter((font) => font.id !== id));
  };

  const validateFonts = () =>
    fonts.filter((f) => f.fontName.trim() !== '' && f.selectedFont.trim() !== '');

  const resetForm = () => {
    setGroupTitle('');
    setFonts([{ id: crypto.randomUUID(), fontName: '', selectedFont: '', size: 1.0, priceChange: 0 }]);
    setSelectedGroupId(null);
    setError('');
    setSuccess('');
  };

  const handleCreate = () => {
    const validFonts = validateFonts();

    if (groupTitle.trim() === '') {
      setError('Group title is required.');
      setSuccess('');
      return;
    }

    if (validFonts.length < 1) {
      setError('You must select at least One.');
      setSuccess('');
      return;
    }

    const newGroup: FontGroup = {
      id: crypto.randomUUID(),
      name: groupTitle.trim(),
      fonts: validFonts.map((f) => f.fontName),
    };

    setFontGroups((prev) => [...prev, newGroup]);
    resetForm();
    setSuccess('Font group created successfully!');
  };

  const handleUpdate = () => {
    if (!selectedGroupId) return;

    const validFonts = validateFonts();

    if (groupTitle.trim() === '') {
      setError('Group title is required.');
      return;
    }
    
    if (validFonts.length < 0) {
      setError('You must select at least One.');
      return;
    }

    const updatedGroup: FontGroup = {
      id: selectedGroupId,
      name: groupTitle.trim(),
      fonts: validFonts.map((f) => f.fontName),
    };

    setFontGroups((prev) =>
      prev.map((g) => (g.id === selectedGroupId ? updatedGroup : g))
    );

    resetForm();
    setSuccess('Font group updated successfully!');
  };

  const handleEdit = (id: string) => {
    const group = fontGroups.find((g) => g.id === id);
    if (!group) return;

    const loadedFonts: FontRow[] = group.fonts.map((name) => ({
      id: crypto.randomUUID(),
      fontName: name,
      selectedFont: '', 
      size: 1.0,
      priceChange: 0,
    }));

    setGroupTitle(group.name);
    setFonts(loadedFonts);
    setSelectedGroupId(id);
    setError('');
    setSuccess('');
  };

  const handleDeleteGroup = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this font group?');
    if (confirmed) {
      setFontGroups((prev) => prev.filter((group) => group.id !== id));
      if (selectedGroupId === id) resetForm(); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* --- Create/Edit Font Group Form --- */}
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">
          {selectedGroupId ? 'Edit Font Group' : 'Create Font Group'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">You have to select at least two fonts</p>

        <input
          type="text"
          placeholder="Group Title"
          value={groupTitle}
          onChange={(e) => setGroupTitle(e.target.value)}
          className="w-full mb-4 border px-3 py-2 rounded"
        />

        <div className="overflow-x-auto">
          {fonts.map((font) => (
            <div key={font.id} className="grid grid-cols-5 gap-4 mb-3 items-center">
              <input
                type="text"
                placeholder="Font Name"
                value={font.fontName}
                onChange={(e) => handleChange(font.id, 'fontName', e.target.value)}
                className="border px-2 py-1 rounded"
              />

              <select
                value={font.selectedFont}
                onChange={(e) => handleChange(font.id, 'selectedFont', e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">Select a Font</option>
                <option value="Font A">Font A</option>
                <option value="Font B">Font B</option>
                <option value="Font C">Font C</option>
                <option value="Font D">Font D</option>
              </select>

              <input
                type="number"
                value={font.size}
                onChange={(e) => handleChange(font.id, 'size', parseFloat(e.target.value))}
                className="border px-2 py-1 rounded"
              />

              <input
                type="number"
                value={font.priceChange}
                onChange={(e) =>
                  handleChange(font.id, 'priceChange', parseFloat(e.target.value))
                }
                className="border px-2 py-1 rounded"
              />

              <button
                onClick={() => handleDeleteRow(font.id)}
                className="text-red-500 font-bold text-xl"
                title="Delete"
                disabled={fonts.length <= 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-white border border-green-500 text-green-600 rounded hover:bg-green-50 cursor-pointer"
          >
            + Add Row
          </button>

          {selectedGroupId ? (
            <>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            >
              Create
            </button>
          )}
        </div>
      </div>

      {/* --- Font Groups Table --- */}
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-1">Our Font Groups</h2>
        <p className="text-sm text-gray-600 mb-4">List of all available font groups.</p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Fonts</th>
              <th className="px-4 py-2">Count</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fontGroups.map((group) => (
              <tr key={group.id} className="border-t text-sm">
                <td className="text-left px-4 py-2">{group.name}</td>
                <td className="text-left px-4 py-2">{group.fonts.join(', ')}</td>
                <td className="text-left px-4 py-2">{group.fonts.length}</td>
                <td className="px-4 py-2 text-right space-x-4">
                  <button
                    onClick={() => handleEdit(group.id)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                   <FilePenLine/>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    <Trash/>
                  </button>
                </td>
              </tr>
            ))}
            {fontGroups.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  No font groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FontGroupForm;
