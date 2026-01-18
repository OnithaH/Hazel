'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  FileText, 
  Image,
  MoreVertical
} from 'lucide-react';

export default function ReviseQAPage() {
  const [activeTab, setActiveTab] = useState('Upload Materials');

  const tabs = ['Upload Materials', 'Practice Sessions', 'History'];

  const materials = [
    {
      icon: FileText,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      title: 'Biology Chapter 5 - Cell Structure.pdf',
      size: '2.4 MB',
      questions: '45 questions generated',
      date: 'Today'
    },
    {
      icon: FileText,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      title: 'Physics Notes - Thermodynamics.docx',
      size: '1.8 MB',
      questions: '32 questions generated',
      date: 'Yesterday'
    },
    {
      icon: Image,
      iconBg: 'bg-pink-500/20',
      iconColor: 'text-pink-400',
      title: 'Chemistry Formulas.png',
      size: '856 KB',
      questions: '18 questions generated',
      date: 'Dec 19'
    },
    {
      icon: FileText,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      title: 'Mathematics - Calculus.pdf',
      size: '3.2 MB',
      questions: '67 questions generated',
      date: 'Dec 18'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <button className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-normal mb-2">Revise Q&A</h1>
              <p className="text-white/60">Upload materials and practice with Hazel</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl transition-all ${
                activeTab === tab
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <button className="w-full h-52 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
              <Upload className="w-7 h-7 text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl mb-2">Upload Files</h3>
              <p className="text-white/60">PDF, DOCX, TXT, JPG, PNG</p>
            </div>
          </div>
        </button>

        {/* Uploaded Materials */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl">Uploaded Materials</h2>
          
          <div className="space-y-3">
            {materials.map((material, index) => {
              const Icon = material.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 ${material.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${material.iconColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base mb-1">{material.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <span>{material.size}</span>
                          <span>•</span>
                          <span>{material.questions}</span>
                          <span>•</span>
                          <span>{material.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="px-6 py-2.5 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all">
                        Start Practice
                      </button>
                      <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                        <MoreVertical className="w-4.5 h-4.5 text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}