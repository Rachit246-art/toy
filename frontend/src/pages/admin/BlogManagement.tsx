import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import API_BASE from '../../config';
import '../../components/admin/AdminLayout.css';

interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [uploadingInline, setUploadingInline] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setContent('');
    setImage(null);
    setShowModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setSubtitle(blog.subtitle || '');
    setContent(blog.content);
    setImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
  };

  const insertInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingInline(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          const imgTag = `\n<div style="text-align: center; margin: 2rem 0;"><img src="${data.imageUrl}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);" alt="blog content image" /></div>\n`;
          
          // Insert at cursor position or append
          if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newContent = content.substring(0, start) + imgTag + content.substring(end);
            setContent(newContent);
            
            setTimeout(() => {
              textareaRef.current?.focus();
              textareaRef.current?.setSelectionRange(start + imgTag.length, start + imgTag.length);
            }, 0);
          } else {
            setContent(prev => prev + imgTag);
          }
        } else {
          const err = await res.json();
          alert(`Failed to upload inline image: ${err.message}`);
        }
      } catch (err) {
        alert('Network error while uploading inline image.');
      } finally {
        setUploadingInline(false);
        if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');
    const url = editingId ? `${API_BASE}/api/blogs/${editingId}` : `${API_BASE}/api/blogs`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        setMessage(editingId ? 'Blog updated successfully!' : 'Blog created successfully!');
        fetchBlogs();
        setTimeout(() => closeModal(), 1500);
      } else {
        const errData = await res.json();
        setMessage(`Error: ${errData.message}`);
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchBlogs();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="text-purple">Blog Management</h1>
        <button className="btn-playful btn-primary" onClick={openAddModal}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Blog Post
        </button>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id}>
                  <td>
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt="Blog" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={24} color="#aaa" />
                      </div>
                    )}
                  </td>
                  <td><strong>{blog.title}</strong></td>
                  <td>{blog.subtitle}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="action-btn text-blue" onClick={() => openEditModal(blog)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn text-red" onClick={() => handleDelete(blog._id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No blog posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            <h2 className="text-purple">{editingId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
            
            {message && (
              <div className={`message-banner ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              
              <div className="form-group">
                <label>Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <label style={{ margin: 0, fontWeight: 'bold' }}>Content (Supports HTML) *</label>
                  <button 
                    type="button" 
                    className="btn-playful btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    onClick={() => inlineImageInputRef.current?.click()}
                    disabled={uploadingInline}
                  >
                    <ImageIcon size={14} style={{ marginRight: '0.3rem' }} /> 
                    {uploadingInline ? 'Uploading...' : 'Insert Image'}
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    ref={inlineImageInputRef}
                    onChange={insertInlineImage}
                  />
                </div>
                <textarea 
                  ref={textareaRef}
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required 
                  rows={15} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--color-blue)', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.5' }}
                  placeholder="Write your blog post here... You can use HTML tags like <b>, <i>, <br>, or click 'Insert Image' to add inline images."
                />
              </div>
              
              <div className="form-group">
                <label>Main Image Thumbnail {editingId ? '(Leave empty to keep current)' : '*'}</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} required={!editingId} />
              </div>
              
              <button type="submit" className="btn-playful btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Saving...' : (editingId ? 'Update Blog Post' : 'Create Blog Post')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
