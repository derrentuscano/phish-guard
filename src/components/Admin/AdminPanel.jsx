import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = ({ user }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    type: 'email',
    difficulty: 'easy',
    from: '',
    subject: '',
    content: '',
    correctAnswer: 'phishing',
    explanation: '',
    indicators: ['', '', '']
  });

  useEffect(() => {
    fetchScenarios();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIndicatorChange = (index, value) => {
    const newIndicators = [...formData.indicators];
    newIndicators[index] = value;
    setFormData({
      ...formData,
      indicators: newIndicators
    });
  };

  const addIndicator = () => {
    setFormData({
      ...formData,
      indicators: [...formData.indicators, '']
    });
  };

  const removeIndicator = (index) => {
    const newIndicators = formData.indicators.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      indicators: newIndicators
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Filter out empty indicators
      const validIndicators = formData.indicators.filter(ind => ind.trim() !== '');

      const scenarioData = {
        ...formData,
        indicators: validIndicators,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };

      await addDoc(collection(db, 'scenarios'), scenarioData);

      setMessage({
        type: 'success',
        text: 'Scenario added successfully!'
      });

      // Reset form
      setFormData({
        type: 'email',
        difficulty: 'easy',
        from: '',
        subject: '',
        content: '',
        correctAnswer: 'phishing',
        explanation: '',
        indicators: ['', '', '']
      });

      // Refresh scenarios list
      fetchScenarios();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add scenario. Please try again.'
      });
      console.error('Error adding scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScenario = async (scenarioId) => {
    if (!window.confirm('Are you sure you want to delete this scenario?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'scenarios', scenarioId));
      setMessage({
        type: 'success',
        text: 'Scenario deleted successfully!'
      });
      fetchScenarios();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete scenario.'
      });
      console.error('Error deleting scenario:', error);
    }
  };

  return (
    <div className="admin-container fade-in">
      <div className="container">
        <div className="admin-header">
          <Settings size={48} className="header-icon" />
          <h1>⚙️ Admin Panel</h1>
          <p>Add and manage phishing scenarios</p>
        </div>

        {message.text && (
          <div className={`alert ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="admin-content">
          <div className="add-scenario-section card">
            <h2>
              <Plus size={24} />
              Add New Scenario
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="link">Link</option>
                    <option value="website">Website</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="correctAnswer">Correct Answer</label>
                  <select
                    id="correctAnswer"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    required
                  >
                    <option value="safe">Safe</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="phishing">Phishing</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="from">From Email Address</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="sender@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="subject">Email Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject line of the email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="content">Email Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Full email content..."
                  rows="8"
                  required
                ></textarea>
              </div>

              <div className="input-group">
                <label htmlFor="explanation">Explanation</label>
                <textarea
                  id="explanation"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Explain why this is safe/suspicious/phishing..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="indicators-section">
                <label>Key Indicators</label>
                {formData.indicators.map((indicator, index) => (
                  <div key={index} className="indicator-row">
                    <input
                      type="text"
                      value={indicator}
                      onChange={(e) => handleIndicatorChange(index, e.target.value)}
                      placeholder={`Indicator ${index + 1}`}
                    />
                    {formData.indicators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIndicator(index)}
                        className="btn-remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIndicator}
                  className="btn btn-outline"
                >
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
                      <button
                        onClick={() => deleteScenario(scenario.id)}
                        className="btn-delete"
                      >
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
                <p>No custom scenarios yet. Add your first scenario above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
