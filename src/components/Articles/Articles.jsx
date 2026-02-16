import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articles, getCategories } from '../../data/articles';
import { 
  BookOpen, 
  Clock, 
  User, 
  Calendar,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import './Articles.css';

const Articles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...getCategories()];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="articles-container fade-in">
      <div className="container">
        <div className="articles-header">
          <div>
            <h1>📚 Cybersecurity Articles</h1>
            <p>Stay informed with the latest security awareness tips and best practices</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="articles-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <Filter size={20} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="article-card card"
              onClick={() => navigate(`/articles/${article.id}`)}
            >
              <div className="article-image">
                <span className="article-emoji">{article.image}</span>
              </div>
              
              <div className="article-content">
                <div className="article-category">{article.category}</div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                
                <div className="article-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>
                </div>

                <div className="article-footer">
                  <div className="author">
                    <User size={16} />
                    <span>{article.author}</span>
                  </div>
                  <button className="read-more">
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="no-results">
            <BookOpen size={64} />
            <h2>No articles found</h2>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
