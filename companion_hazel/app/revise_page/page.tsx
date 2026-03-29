'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  FileText, 
  Image as LucideImage,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface Material {
  id: string;
  file_name: string;
  uploaded_at: string;
  _count: {
    questions: number;
  };
}

export default function ReviseQAPage() {
  const [activeTab, setActiveTab] = useState('Upload Materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for practice session
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  const tabs = ['Upload Materials', 'Practice Sessions'];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/revise/materials');
      
      if (response.data) {
        setMaterials(response.data);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials from server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'Practice Sessions') {
      setActiveTab('Upload Materials');
      document.getElementById('uploaded-materials')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab(tab);
      if (tab === 'Upload Materials') {
        setSelectedMaterial(null); // Reset practice view when switching back to upload
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('/api/revise/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh list
      await fetchMaterials();
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.error || 'Failed to upload and process file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await axios.delete(`/api/revise/materials/${id}`);
      setMaterials(materials.filter(m => m.id !== id));
      if (selectedMaterial?.id === id) {
        setSelectedMaterial(null);
      }
    } catch (err: any) {
      console.error('Error deleting material:', err);
      alert('Failed to delete material');
    }
  };

  const handleStartPractice = async (material: Material) => {
    try {
      setIsFetchingQuestions(true);
      setSelectedMaterial(material);
      setQuestions([]); // Clear previous questions
      
      // 1. STARTS A ROBOT SESSION (No Focus Tracking for Revise)
      await axios.post('/api/study/session', {
        duration: 30, // Default 30 min for revision
        break_activity: 'BREATHE',
        phone_detection_enabled: false, 
        focus_shield_enabled: false,
        focus_goal: `REVISE:${material.id}`
      });

      // 2. Fetch questions from API
      const response = await axios.get(`/api/revise/materials/${material.id}/questions`);
      setQuestions(response.data);
    } catch (err) {
      console.error('Error starting practice session:', err);
      setError('Failed to start session. Please try again.');
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedMaterial) return;
    
    try {
      setIsFetchingQuestions(true);
      setError(null);

      const response = await axios.post(`/api/revise/materials/${selectedMaterial.id}/regenerate`);
      setQuestions(response.data.material.questions);
      
      // Update the materials list count as well
      setMaterials(materials.map(m => 
        m.id === selectedMaterial.id 
          ? { ...m, _count: { questions: response.data.material.questions.length } } 
          : m
      ));
    } catch (err: any) {
      console.error('Error re-generating questions:', err);
      setError(err.response?.data?.error || 'Failed to re-generate questions');
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext || '')) return LucideImage;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#101828] to-black text-white p-8 pt-28 font-arimo">
      <div className="max-w-[1024px] mx-auto space-y-[32px] flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-[8px]">
          <Link href="/study_mode" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[16px] leading-[24px]">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          
          <div className="flex items-center gap-[16px]">
            <div className="w-[64px] h-[64px] bg-[#502E7A]/20 rounded-[16px] flex items-center justify-center shrink-0">
               <BookOpen className="w-8 h-8 text-[#A855F7]" />
            </div>
            <div className="flex flex-col gap-[8px]">
              <h1 className="text-[36px] leading-[40px] font-normal translate-y-[-3px]">Revise Q&A</h1>
              <p className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Upload materials and practice with Hazel</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-[16px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-[24px] py-[12px] rounded-[14px] text-[16px] leading-[24px] transition-all flex items-center justify-center ${
                activeTab === tab
                  ? 'bg-[#502E7A]/20 border-[0.8px] border-[#502E7A]/40 text-[#A855F7]'
                  : 'bg-white/5 border-[0.8px] border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Practice Session View OR Material List */}
        {selectedMaterial ? (
          <div className="space-y-[32px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedMaterial(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <ArrowLeft className="w-6 h-6 text-white/60" />
                </button>
                <div>
                  <h2 className="text-[24px] leading-[32px]">{selectedMaterial.file_name}</h2>
                  <p className="text-white/60">Practice Session - {questions.length} Questions</p>
                </div>
              </div>
              <button 
                onClick={handleRegenerate}
                className="px-6 py-2 bg-[#2B7FFF]/20 border border-[#2B7FFF]/40 rounded-[10px] text-[#51A2FF] hover:bg-[#2B7FFF]/30 transition-all flex items-center gap-2"
              >
                <Loader2 className={`w-4 h-4 ${isFetchingQuestions ? 'animate-spin' : 'flex'}`} />
                {isFetchingQuestions ? 'Generating...' : 'Refresh Questions'}
              </button>
            </div>

            <div className="grid gap-6">
              {isFetchingQuestions ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-[#A855F7]" />
                  <p className="text-white/40">Fetching questions from database...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-20 text-white/40 bg-white/5 rounded-[16px] border border-white/10 border-dashed">
                  No questions found for this material.
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-white/5 border border-white/10 rounded-[16px] p-6 space-y-4 hover:bg-white/10 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#502E7A]/20 border border-[#502E7A]/40 flex items-center justify-center text-[#A855F7] font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-4 w-full">
                        <h3 className="text-[18px] leading-[26px] text-white/90 font-medium">
                          {q.question}
                        </h3>
                        
                        <div className="grid gap-3">
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-[12px]">
                            <p className="text-[14px] text-green-400 font-bold uppercase tracking-wider mb-1">Answer</p>
                            <p className="text-white/80">{q.answer}</p>
                          </div>
                          
                          {q.explanation && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-[12px]">
                              <p className="text-[14px] text-white/40 font-bold uppercase tracking-wider mb-1">Explanation</p>
                              <p className="text-white/60 italic">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-[32px]">
            {/* Upload Area */}
            <div 
              onClick={handleUploadClick}
              className={`w-full bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[32px] hover:bg-white/10 transition-all group flex flex-col justify-start cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.txt,image/*"
              />
              <div className="flex flex-col items-start gap-[16px] w-full">
                <div className="w-[64px] h-[64px] bg-[#2B7FFF]/20 rounded-[16px] flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/30 transition-all border-[0.8px] border-[#2B7FFF]/40">
                   {isUploading ? (
                     <Loader2 className="w-8 h-8 text-[#51A2FF] animate-spin" />
                   ) : (
                     <Upload className="w-8 h-8 text-[#51A2FF]" />
                   )}
                </div>
                <div className="flex flex-col gap-[8px]">
                  <h3 className="text-[20px] leading-[28px] text-white">
                    {isUploading ? 'Processing with Gemini AI...' : 'Upload Files'}
                  </h3>
                  <p className="text-white/60 text-[16px] leading-[24px]">
                    {isUploading ? 'Hazel is analyzing your material and generating questions' : 'PDF, DOCX, TXT, or Images'}
                  </p>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Materials */}
            <div 
              id="uploaded-materials"
              className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]"
            >
              <h2 className="text-[24px] leading-[32px]">Uploaded Materials</h2>
              
              <div className="flex flex-col gap-[12px]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                  </div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    No materials uploaded yet. Upload a file to start practicing.
                  </div>
                ) : (
                  materials.map((material) => {
                    const Icon = getFileIcon(material.file_name);
                    return (
                      <div
                        key={material.id}
                        className="bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[16px] hover:bg-white/10 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-[16px] flex-1 min-w-0">
                          <div className={`w-[48px] h-[48px] bg-[#502E7A]/20 rounded-[12px] flex items-center justify-center shrink-0`}>
                            <Icon className={`w-[20px] h-[20px] text-[#A855F7]`} />
                          </div>
                          
                          <div className="flex flex-col gap-[4px] min-w-0">
                            <h3 className="text-[16px] leading-[24px] text-white overflow-hidden whitespace-nowrap text-ellipsis max-w-[400px]">
                                {material.file_name}
                            </h3>
                            <div className="flex items-center gap-[16px] text-[14px] leading-[20px] text-white/60">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {material._count.questions} questions
                              </span>
                              <span>•</span>
                              <span>{formatDate(material.uploaded_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-[12px] shrink-0">
                          <button 
                            onClick={() => handleStartPractice(material)}
                            className="px-[24px] h-[41.6px] bg-[#502E7A]/20 border-[0.8px] border-[#502E7A]/40 rounded-[10px] text-[#A855F7] text-[16px] leading-[24px] hover:bg-[#502E7A]/30 transition-all whitespace-nowrap"
                          >
                            Start Practice
                          </button>
                          <button 
                            onClick={() => handleDelete(material.id)}
                            className="w-[41.6px] h-[41.6px] bg-white/5 rounded-[10px] border-[0.8px] border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-[20px] h-[20px] text-white/60 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
