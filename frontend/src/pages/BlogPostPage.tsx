import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen } from 'lucide-react';
import API_BASE from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BlogPage.css';

interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          // If not found, redirect to blog page
          navigate('/blog');
        }
      } catch (err) {
        console.error('Failed to fetch blog post', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBlog();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="blog-post-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="blog-loading">Loading magical story...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) return null;

  return (
    <>
      <Helmet>
        <title>{blog.title} | Pigglitz</title>
        <meta name="description" content={blog.subtitle || blog.title} />
      </Helmet>
      <Navbar />
      <div className="blog-post-container">
        <div className="container" style={{ maxWidth: '900px' }}>
          <button className="back-to-blogs" onClick={() => navigate('/blog')}>
            <ArrowLeft size={20} /> Back to All Stories
          </button>
          
          <article className="blog-post-wrapper fade-in">
            <div className="blog-post-hero">
              {blog.imageUrl ? (
                <img src={blog.imageUrl} alt={blog.title} />
              ) : (
                <div className="blog-post-hero-placeholder">
                  <BookOpen size={80} color="var(--color-pink)" opacity={0.5} />
                </div>
              )}
            </div>
            
            <div className="blog-post-content">
              <header className="blog-post-header">
                <span className="blog-post-date">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <h1 className="text-purple">{blog.title}</h1>
                {blog.subtitle && <p className="blog-post-subtitle">{blog.subtitle}</p>}
              </header>
              
              <div 
                className="blog-post-body ql-editor" 
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostPage;
