import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  BarChart3,
  Users,
  Mail,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalScenarios: 0,
    totalArticles: 0,
    totalAttempts: 0,
    avgScore: 0,
    topUsers: []
  });
  
  // Scenarios
  const [scenarios, setScenarios] = useState([]);
  const [scenarioForm, setScenarioForm] = useState({
    type: 'email',
    difficulty: 'easy',
    from: '',
    subject: '',
    content: '',
    correctAnswer: 'phishing',
    explanation: '',
    indicators: ['', '', '']
  });
  
  // Articles
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Phishing',
    readTime: '',
    author: 'PhishGuard Team',
    image: '🎣',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    checkAdminAccess();
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'scenarios') {
      fetchScenarios();
    } else if (activeTab === 'articles') {
      fetchArticles();
    }
  }, [activeTab]);

  const checkAdminAccess = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setCheckingAccess(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch scenarios
      const scenariosSnapshot = await getDocs(collection(db, 'scenarios'));
      
      // Fetch articles
      const articlesSnapshot = await getDocs(collection(db, 'articles'));
      
      // Calculate stats
      const totalAttempts = users.reduce((sum, u) => sum + (u.totalAttempts || 0), 0);
      const totalCorrect = users.reduce((sum, u) => sum + (u.correctAnswers || 0), 0);
      const avgScore = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : 0;
      
      // Get top 5 users
      const topUsers = users
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);
      
      setAnalytics({
        totalUsers: users.length,
        totalScenarios: scenariosSnapshot.size,
        totalArticles: articlesSnapshot.size,
        totalAttempts,
        avgScore,
        topUsers
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchScenarios = async () => {
    try {
      const scenariosRef = collection(db, 'scenarios');
      const snapshot = await getDocs(scenariosRef);
      const scenariosList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setScenarios(scenariosList);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const articlesRef = collection(db, 'articles');
      const snapshot = await getDocs(articlesRef);
      const articlesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesList);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  // Scenario handlers
  const handleScenarioChange = (e) => {
    const { name, value } = e.target;
    setScenarioForm({ ...scenarioForm, [name]: value });
  };

  const handleIndicatorChange = (index, value) => {
    const newIndicators = [...scenarioForm.indicators];
    newIndicators[index] = value;
    setScenarioForm({ ...scenarioForm, indicators: newIndicators });
  };

  const addIndicator = () => {
    setScenarioForm({
      ...scenarioForm,
      indicators: [...scenarioForm.indicators, '']
    });
  };

  const removeIndicator = (index) => {
    const newIndicators = scenarioForm.indicators.filter((_, i) => i !== index);
    setScenarioForm({ ...scenarioForm, indicators: newIndicators });
  };

  const handleScenarioSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const validIndicators = scenarioForm.indicators.filter(ind => ind.trim() !== '');
      const scenarioData = {
        ...scenarioForm,
        indicators: validIndicators,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };

      await addDoc(collection(db, 'scenarios'), scenarioData);
      setMessage({ type: 'success', text: 'Scenario added successfully!' });
      
      setScenarioForm({
        type: 'email',
        difficulty: 'easy',
        from: '',
        subject: '',
        content: '',
        correctAnswer: 'phishing',
        explanation: '',
        indicators: ['', '', '']
      });
      
      fetchScenarios();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add scenario.' });
      console.error('Error adding scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScenario = async (scenarioId) => {
    if (!window.confirm('Are you sure you want to delete this scenario?')) return;
    
    try {
      await deleteDoc(doc(db, 'scenarios', scenarioId));
      setMessage({ type: 'success', text: 'Scenario deleted successfully!' });
      fetchScenarios();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete scenario.' });
      console.error('Error deleting scenario:', error);
    }
  };

  // Article handlers
  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm({ ...articleForm, [name]: value });
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const articleData = {
        ...articleForm,
        date: new Date().toISOString(),
        createdBy: user.uid
      };

      if (editingArticle) {
        await updateDoc(doc(db, 'articles', editingArticle.id), articleData);
        setMessage({ type: 'success', text: 'Article updated successfully!' });
        setEditingArticle(null);
      } else {
        await addDoc(collection(db, 'articles'), articleData);
        setMessage({ type: 'success', text: 'Article added successfully!' });
      }
      
      setArticleForm({
        title: '',
        category: 'Phishing',
        readTime: '',
        author: 'PhishGuard Team',
        image: '🎣',
        excerpt: '',
        content: ''
      });
      
      fetchArticles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save article.' });
      console.error('Error saving article:', error);
    } finally {
      setLoading(false);
    }
  };

  const editArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      readTime: article.readTime,
      author: article.author,
      image: article.image,
      excerpt: article.excerpt,
      content: article.content
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Phishing',
      readTime: '',
      author: 'PhishGuard Team',
      image: '🎣',
      excerpt: '',
      content: ''
    });
  };

  const deleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      setMessage({ type: 'success', text: 'Article deleted successfully!' });
      fetchArticles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete article.' });
      console.error('Error deleting article:', error);
    }
  };

  if (checkingAccess) {
    return <div className="spinner"></div>;
  }

  if (!userData || userData.role !== 'admin') {
    return (
      <div className="admin-container fade-in">
        <div className="container">
          <div className="access-denied">
            <AlertCircle size={64} style={{ color: '#ef4444' }} />
            <h1>Access Denied</h1>
            <p>You do not have permission to access the admin panel.</p>
            <p>This area is restricted to administrators only.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container fade-in">
      <div className="container">
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Manage content and view platform analytics</p>
        </div>

        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            <Mail size={20} />
            Scenarios
          </button>
          <button
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            <BookOpen size={20} />
            Articles
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h2>Platform Statistics</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#10b98115' }}>
                    <Users size={32} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <div className="stat-value">{analytics.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#3b82f615' }}>
                    <Mail size={32} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <div className="stat-value">{analytics.totalScenarios}</div>
                    <div className="stat-label">Scenarios</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#8b5cf615' }}>
                    <BookOpen size={32} style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <div className="stat-value">{analytics.totalArticles}</div>
                    <div className="stat-label">Articles</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#f59e0b15' }}>
                    <Target size={32} style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <div className="stat-value">{analytics.totalAttempts}</div>
                    <div className="stat-label">Total Attempts</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: '#10b98115' }}>
                    <TrendingUp size={32} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <div className="stat-value">{analytics.avgScore}%</div>
                    <div className="stat-label">Avg Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="top-users-section card">
                <h3>
                  <Award size={24} />
                  Top 5 Users
                </h3>
                {analytics.topUsers.length > 0 ? (
                  <div className="top-users-list">
                    {analytics.topUsers.map((user, index) => (
                      <div key={user.id} className="top-user-item">
                        <div className="user-rank">#{index + 1}</div>
                        <div className="user-info">
                          <div className="user-name">{user.name || 'User'}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        <div className="user-stats">
                          <div className="user-score">{user.score} pts</div>
                          <div className="user-level">{user.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No users yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="scenarios-section">
              <div className="add-scenario-section card">
                <h2>
                  <Plus size={24} />
                  Add New Scenario
                </h2>

                <form onSubmit={handleScenarioSubmit}>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Type</label>
                      <select name="type" value={scenarioForm.type} onChange={handleScenarioChange} required>
                        <option value="email">Email</option>
                        <option value="link">Link</option>
                        <option value="website">Website</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Difficulty</label>
                      <select name="difficulty" value={scenarioForm.difficulty} onChange={handleScenarioChange} required>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Correct Answer</label>
                      <select name="correctAnswer" value={scenarioForm.correctAnswer} onChange={handleScenarioChange} required>
                        <option value="safe">Safe</option>
                        <option value="suspicious">Suspicious</option>
                        <option value="phishing">Phishing</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>From Email Address</label>
                    <input type="text" name="from" value={scenarioForm.from} onChange={handleScenarioChange} placeholder="sender@example.com" required />
                  </div>

                  <div className="input-group">
                    <label>Email Subject</label>
                    <input type="text" name="subject" value={scenarioForm.subject} onChange={handleScenarioChange} placeholder="Subject line" required />
                  </div>

                  <div className="input-group">
                    <label>Email Content</label>
                    <textarea name="content" value={scenarioForm.content} onChange={handleScenarioChange} placeholder="Full email content..." rows="8" required></textarea>
                  </div>

                  <div className="input-group">
                    <label>Explanation</label>
                    <textarea name="explanation" value={scenarioForm.explanation} onChange={handleScenarioChange} placeholder="Explain why this is safe/suspicious/phishing..." rows="4" required></textarea>
                  </div>

                  <div className="indicators-section">
                    <label>Key Indicators</label>
                    {scenarioForm.indicators.map((indicator, index) => (
                      <div key={index} className="indicator-row">
                        <input type="text" value={indicator} onChange={(e) => handleIndicatorChange(index, e.target.value)} placeholder={`Indicator ${index + 1}`} />
                        {scenarioForm.indicators.length > 1 && (
                          <button type="button" onClick={() => removeIndicator(index)} className="btn-remove">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addIndicator} className="btn btn-outline">
                      <Plus size={18} />
                      Add Indicator
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Scenario'}
                  </button>
                </form>
              </div>

              <div className="scenarios-list-section">
                <h2>
                  <Mail size={24} />
                  Existing Scenarios ({scenarios.length})
                </h2>

                {scenarios.length > 0 ? (
                  <div className="scenarios-grid">
                    {scenarios.map((scenario) => (
                      <div key={scenario.id} className="scenario-card card">
                        <div className="scenario-header">
                          <span className={`difficulty-badge badge-${scenario.difficulty}`}>
                            {scenario.difficulty}
                          </span>
                          <button onClick={() => deleteScenario(scenario.id)} className="btn-delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="scenario-content">
                          <div className="scenario-meta">
                            <strong>From:</strong> {scenario.from}
                          </div>
                          <div className="scenario-meta">
                            <strong>Subject:</strong> {scenario.subject}
                          </div>
                          <div className="scenario-answer">
                            <strong>Answer:</strong>{' '}
                            <span className={`answer-${scenario.correctAnswer}`}>
                              {scenario.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-scenarios">
                    <Mail size={48} />
                    <p>No custom scenarios yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="articles-section">
              <div className="add-article-section card">
                <h2>
                  {editingArticle ? <Edit2 size={24} /> : <Plus size={24} />}
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h2>

                <form onSubmit={handleArticleSubmit}>
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" name="title" value={articleForm.title} onChange={handleArticleChange} placeholder="Article title" required />
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Category</label>
                      <select name="category" value={articleForm.category} onChange={handleArticleChange} required>
                        <option value="Phishing">Phishing</option>
                        <option value="Passwords">Passwords</option>
                        <option value="Social Engineering">Social Engineering</option>
                        <option value="Network Security">Network Security</option>
                        <option value="Mobile Security">Mobile Security</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Read Time</label>
                      <input type="text" name="readTime" value={articleForm.readTime} onChange={handleArticleChange} placeholder="5 min read" required />
                    </div>

                    <div className="input-group">
                      <label>Emoji Icon</label>
                      <input type="text" name="image" value={articleForm.image} onChange={handleArticleChange} placeholder="🎣" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Author</label>
                    <input type="text" name="author" value={articleForm.author} onChange={handleArticleChange} placeholder="PhishGuard Team" required />
                  </div>

                  <div className="input-group">
                    <label>Excerpt</label>
                    <textarea name="excerpt" value={articleForm.excerpt} onChange={handleArticleChange} placeholder="Brief summary..." rows="3" required></textarea>
                  </div>

                  <div className="input-group">
                    <label>Content (Markdown supported)</label>
                    <textarea name="content" value={articleForm.content} onChange={handleArticleChange} placeholder="Full article content with markdown..." rows="12" required></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : editingArticle ? 'Update Article' : 'Add Article'}
                    </button>
                    {editingArticle && (
                      <button type="button" onClick={cancelEdit} className="btn btn-outline">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="articles-list-section">
                <h2>
                  <BookOpen size={24} />
                  Existing Articles ({articles.length})
                </h2>

                {articles.length > 0 ? (
                  <div className="articles-grid">
                    {articles.map((article) => (
                      <div key={article.id} className="article-card card">
                        <div className="article-emoji">{article.image}</div>
                        <div className="article-content-item">
                          <div className="article-header-actions">
                            <span className="category-badge">{article.category}</span>
                            <div className="article-actions">
                              <button onClick={() => editArticle(article)} className="btn-edit">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => deleteArticle(article.id)} className="btn-delete">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          <h3>{article.title}</h3>
                          <p className="article-excerpt">{article.excerpt}</p>
                          <div className="article-meta-info">
                            <span>{article.readTime}</span>
                            <span>•</span>
                            <span>{article.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-articles">
                    <BookOpen size={48} />
                    <p>No articles yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
