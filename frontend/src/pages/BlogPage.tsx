import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen } from 'lucide-react';
import API_BASE from '../config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BlogPage.css';

interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  createdAt: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Blog | Pigglitz</title>
        <meta name="description" content="Read the latest news, updates, and fun stories from Pigglitz, your favorite 3D printing toy store." />
      </Helmet>
      <Navbar />
      <div className="blog-page-container">
        <div className="container">
          <div className="blog-header">
            <h1 className="text-purple"><BookOpen className="heading-icon" size={32} /> Pigglitz Blog</h1>
            <p className="blog-subtitle">Stories, updates, and magical 3D printing news!</p>
          </div>

          {loading ? (
            <div className="blog-loading">Loading magical stories...</div>
          ) : blogs.length === 0 ? (
            <div className="blog-empty">No stories published yet. Check back soon!</div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog, index) => (
                <div 
                  key={blog._id} 
                  className="blog-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="blog-card-image">
                    {blog.imageUrl ? (
                      <img src={blog.imageUrl} alt={blog.title} loading="lazy" />
                    ) : (
                      <div className="blog-card-placeholder">
                        <BookOpen size={48} color="var(--color-pink)" />
                      </div>
                    )}
                  </div>
                  <div className="blog-card-content">
                    <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <h2 className="blog-title text-blue">{blog.title}</h2>
                    {blog.subtitle && <p className="blog-snippet">{blog.subtitle}</p>}
                    <button className="read-more-btn text-pink">
                      Read More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
