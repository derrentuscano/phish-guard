import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getArticleById as getLocalArticleById } from '../../data/articles';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User,
  Share2,
  BookOpen
} from 'lucide-react';
import './Articles.css';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      // Try to fetch from Firestore first
      const articleDoc = await getDoc(doc(db, 'articles', id));
      
      if (articleDoc.exists()) {
        setArticle({ id: articleDoc.id, ...articleDoc.data() });
      } else {
        // Fallback to local articles
        const localArticle = getLocalArticleById(id);
        setArticle(localArticle);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      // Fallback to local articles
      const localArticle = getLocalArticleById(id);
      setArticle(localArticle);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="article-view-container">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-view-container">
        <div className="container">
          <div className="article-not-found">
            <BookOpen size={64} />
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/articles')} className="btn btn-primary">
              <ArrowLeft size={20} />
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Format content with proper line breaks and sections
  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Check if it's a heading
      if (paragraph.startsWith('## ')) {
        return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
      } else if (paragraph.startsWith('#### ')) {
        return <h4 key={index}>{paragraph.replace('#### ', '')}</h4>;
      }
      // Check if it's a list
      else if (paragraph.includes('\n- ') || paragraph.includes('\n• ')) {
        const items = paragraph.split('\n').filter(line => line.trim());
        return (
          <ul key={index}>
            {items.map((item, i) => {
              const cleanItem = item.replace(/^[•\-]\s*/, '').trim();
              if (cleanItem) {
                return <li key={i}>{cleanItem}</li>;
              }
              return null;
            })}
          </ul>
        );
      }
      // Regular paragraph
      else if (paragraph.trim()) {
        return <p key={index}>{paragraph.trim()}</p>;
      }
      return null;
    });
  };

  return (
    <div className="article-view-container fade-in">
      <div className="container">
        <button onClick={() => navigate('/articles')} className="back-button">
          <ArrowLeft size={20} />
          Back to Articles
        </button>

        <article className="article-full">
          <div className="article-full-header">
            <div className="article-category-badge">{article.category}</div>
            <h1>{article.title}</h1>
            
            <div className="article-full-meta">
              <div className="meta-item">
                <User size={18} />
                <span>{article.author}</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <span>{article.date}</span>
              </div>
              <div className="meta-item">
                <Clock size={18} />
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className="article-image-large">
              <span className="article-emoji-large">{article.image}</span>
            </div>
          </div>

          <div className="article-actions">
            <button onClick={handleShare} className="btn btn-outline">
              <Share2 size={18} />
              Share Article
            </button>
          </div>

          <div className="article-body">
            {formatContent(article.content)}
          </div>

          <div className="article-footer-section">
            <div className="article-tags">
              <span className="tag">{article.category}</span>
              <span className="tag">Cybersecurity</span>
              <span className="tag">Security Awareness</span>
            </div>
          </div>
        </article>

        <div className="article-navigation">
          <button onClick={() => navigate('/articles')} className="btn btn-primary">
            <BookOpen size={20} />
            Read More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
