import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import API_BASE from '../../config';

interface ChatbotLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  requirement?: string;
  createdAt: string;
}

const ChatbotLeads: React.FC = () => {
  const [chatbotLeads, setChatbotLeads] = useState<ChatbotLead[]>([]);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchChatbotLeads = async () => {
    try { const r = await axios.get(`${API_BASE}/api/chatbot-leads`, authHeader()); setChatbotLeads(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchChatbotLeads();
  }, []);

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span><MessageSquare size={20} style={{verticalAlign:'middle', marginRight:'0.5rem'}}/></span> Chatbot Leads</div>
      <div className="admin-list-container">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Requirement</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(!chatbotLeads || !Array.isArray(chatbotLeads) || chatbotLeads.length === 0) ? (
                <tr><td colSpan={5} style={{textAlign:'center', padding:'1.5rem', color:'#888'}}>No leads yet.</td></tr>
              ) : (
                chatbotLeads.map(lead => (
                  <tr key={lead._id}>
                    <td><strong>{lead.name}</strong></td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lead.requirement || 'N/A'}>
                      {lead.requirement || '-'}
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatbotLeads;
