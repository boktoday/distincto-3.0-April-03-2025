import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, FileText, Calendar } from 'lucide-react';
import dbService from '../services/db';
import aiService from '../services/aiService';
import { Report } from '../types';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'pattern' | 'trend' | 'summary' | 'recommendations'>('summary');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    loadChildren();
    loadReports();
  }, [selectedChild, dateRange]);

  const loadChildren = async () => {
    try {
      const entries = await dbService.getAllJournalEntries();
      const uniqueChildren = [...new Set(entries.map(entry => entry.childName))];
      setChildren(uniqueChildren);
    } catch (err) {
      console.error('Error loading children:', err);
    }
  };

  const getDateRangeFilter = () => {
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    switch (dateRange) {
      case 'week':
        return now - (7 * msPerDay);
      case 'month':
        return now - (30 * msPerDay);
      case 'quarter':
        return now - (90 * msPerDay);
      default:
        return 0;
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const allReports = await dbService.getReports();
      
      let filteredReports = allReports;
      
      // Filter by child if not 'all'
      if (selectedChild !== 'all') {
        filteredReports = filteredReports.filter(report => report.childName === selectedChild);
      }
      
      // Filter by date range
      const dateFilter = getDateRangeFilter();
      filteredReports = filteredReports.filter(report => report.timestamp >= dateFilter);
      
      // Sort by timestamp, newest first
      filteredReports.sort((a, b) => b.timestamp - a.timestamp);
      
      setReports(filteredReports);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      setError(null);

      const journalEntries = await dbService.getJournalEntries();
      const foodItems = await dbService.getFoodItems();

      // Filter entries by selected child if not 'all'
      const filteredEntries = selectedChild === 'all' 
        ? journalEntries 
        : journalEntries.filter(entry => entry.childName === selectedChild);

      const reportContent = await aiService.generateReport({
        type: selectedType,
        journalEntries: filteredEntries,
        foodItems
      });

      const newReport: Report = {
        id: crypto.randomUUID(),
        type: selectedType,
        content: reportContent,
        timestamp: Date.now(),
        childName: selectedChild === 'all' ? 'all' : selectedChild,
        generatedFrom: filteredEntries.map(entry => entry.id)
      };

      await dbService.saveReport(newReport);
      await loadReports();
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const formatMarkdown = (markdown: string) => {
    // Very simple markdown parser for demonstration
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-5">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>');
    
    // Lists
    html = html.replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>');
    html = html.replace(/^\d\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    
    // Wrap in paragraph
    html = '<p class="mb-3">' + html + '</p>';
    
    // Fix lists
    html = html.replace(/<\/li>\n<li/g, '</li><li');
    html = html.replace(/<\/p><li/g, '</p><ul><li');
    html = html.replace(/<\/li><p/g, '</li></ul><p');
    
    return html;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-8">
      <div className="flex flex-col space-y-6 mb-12">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-raspberry focus:border-raspberry"
          >
            <option value="all">All Children</option>
            {children.map(child => (
              <option key={child} value={child}>{child}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-raspberry focus:border-raspberry"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-raspberry focus:border-raspberry"
            disabled={generating}
          >
            <option value="summary">Summary Report</option>
            <option value="pattern">Pattern Analysis</option>
            <option value="trend">Trend Report</option>
            <option value="recommendations">Recommendations</option>
          </select>

          <button
            onClick={generateReport}
            disabled={generating}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-raspberry hover:bg-raspberry-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-raspberry disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText size={18} className="mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center bg-red-50 p-4 rounded-md mb-6">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No reports available. Generate your first report using the button above.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.childName === 'all' ? 'All Children' : report.childName}
                  </p>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(report.content) }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
