import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/files";
const PREVIEW_URL = "http://localhost:3000/api/files/preview";

function App() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateInputRef = useRef<HTMLInputElement>(null);

  // Fetch all files
  const fetchFiles = async () => {
    const res = await axios.get(API_URL);
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload file
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    await axios.post(`${API_URL}/upload`, formData);
    setUploading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchFiles();
  };

  // Download file
  const handleDownload = async (id: string) => {
    const res = await axios.get(`${API_URL}/download/${id}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = files.find((f) => f.id === id)?.filename || "file";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete file
  const handleDelete = async (id: string) => {
    await axios.delete(`${API_URL}/delete/${id}`);
    fetchFiles();
  };

  // Update file
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateId || !updateInputRef.current?.files?.[0]) return;
    const formData = new FormData();
    formData.append("file", updateInputRef.current.files[0]);
    await axios.put(`${API_URL}/update/${updateId}`, formData);
    setUpdateId(null);
    if (updateInputRef.current) updateInputRef.current.value = "";
    fetchFiles();
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">File CRUD Demo</h1>

        {/* Upload Form */}
        <form className="flex flex-col gap-4 mb-8" onSubmit={handleUpload}>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            ref={fileInputRef}
            required
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {/* File List */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Filename</th>
                <th>Type</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>
                    {file.mimetype.startsWith("image/") ? (
                      <img
                        src={`${PREVIEW_URL}/${file.id}`}
                        alt={file.filename}
                        className="w-16 h-16 object-cover rounded shadow"
                        style={{ maxWidth: 64, maxHeight: 64 }}
                        onClick={() => setPreviewId(file.id)}
                      />
                    ) : (
                      <span className="badge badge-outline">No Preview</span>
                    )}
                  </td>
                  <td>{file.filename}</td>
                  <td>{file.mimetype}</td>
                  <td>{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleDownload(file.id)}
                    >
                      Download
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => setUpdateId(file.id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(file.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Form (modal) */}
        {updateId && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Update File</h3>
              <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  ref={updateInputRef}
                  required
                />
                <div className="modal-action">
                  <button className="btn btn-primary" type="submit">
                    Update
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setUpdateId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {previewId && (
          <div className="modal modal-open" onClick={() => setPreviewId(null)}>
            <div className="modal-box flex flex-col items-center">
              <img
                src={`${PREVIEW_URL}/${previewId}`}
                alt="Preview"
                className="max-w-full max-h-96 rounded shadow"
              />
              <button className="btn mt-4" onClick={() => setPreviewId(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
