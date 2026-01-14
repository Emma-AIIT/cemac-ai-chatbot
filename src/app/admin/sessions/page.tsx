'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChatSession {
  id: string;
  session_id: string;
  user_id: string | null;
  user_email?: string | null;
  ip_address: string;
  fingerprint: string | null;
  first_seen: string;
  last_seen: string;
  message_count: number;
  is_active: boolean;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/admin/sessions');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSessions();
  }, [router]);

  const fetchChatHistory = async (sessionId: string) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/history`);
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setChatHistory(data);
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      searchTerm === '' ||
      session.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive = !showActiveOnly || session.is_active;

    return matchesSearch && matchesActive;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const activeCount = sessions.filter((s) => s.is_active).length;
  const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chat Sessions</h1>
                <p className="text-sm text-gray-500">Monitor user chat activity and conversations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <Link
              href="/admin"
              className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/users"
              className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Users
            </Link>
            <Link
              href="/admin/ip-whitelist"
              className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              IP Whitelist
            </Link>
            <Link
              href="/admin/access-logs"
              className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Access Logs
            </Link>
            <Link
              href="/admin/sessions"
              className="px-1 py-4 text-sm font-medium text-orange-600 border-b-2 border-orange-600"
            >
              Chat Sessions
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{sessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{totalMessages}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by session ID, IP, or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Active only</span>
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </p>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Loading sessions...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-900">No sessions found</p>
              <p className="mt-2 text-gray-600">
                {searchTerm || showActiveOnly ? 'Try adjusting your filters' : 'No chat sessions yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-6 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedSession === session.session_id ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => fetchChatHistory(session.session_id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono font-medium text-gray-900">
                            {session.session_id.slice(0, 16)}...
                          </span>
                          {session.is_active && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                        {session.user_email && (
                          <div className="text-sm text-gray-600 mb-1">{session.user_email}</div>
                        )}
                        <div className="text-sm text-gray-500 font-mono">{session.ip_address}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{session.message_count}</div>
                        <div className="text-xs text-gray-500">messages</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>First: {formatDate(session.first_seen)}</span>
                      <span>Last: {formatDate(session.last_seen)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {!selectedSession ? (
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-4 text-gray-600">Select a session to view chat history</p>
                  </div>
                </div>
              ) : loadingHistory ? (
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading messages...</p>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Chat History</h3>
                    <p className="text-sm text-gray-500">{chatHistory.length} messages</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, idx) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              msg.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTimestamp(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
