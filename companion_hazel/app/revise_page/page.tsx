'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Upload, 
  FileText, 
  Image,
  Trash2
} from 'lucide-react';

export default function ReviseQAPage() {
  const [activeTab, setActiveTab] = useState('Upload Materials');

  const tabs = ['Upload Materials', 'Practice Sessions'];

  const materials = [
    {
      icon: FileText,
      iconBg: 'bg-[#502E7A]/20',
      iconColor: 'text-[#A855F7]',
      title: 'Biology Chapter 5 - Cell Structure.pdf',
      size: '2.4 MB',
      questions: '10 questions generated',
      date: 'Today'
    },
    {
      icon: FileText,
      iconBg: 'bg-[#2B7FFF]/20',
      iconColor: 'text-[#51A2FF]',
      title: 'Physics Notes - Thermodynamics.docx',
      size: '1.8 MB',
      questions: '10 questions generated',
      date: 'Yesterday'
    },
    {
      icon: Image,
      iconBg: 'bg-[#502E7A]/20',
      iconColor: 'text-[#A855F7]',
      title: 'Chemistry Formulas.png',
      size: '856 KB',
      questions: '10 questions generated',
      date: 'Dec 19'
    },
    {
      icon: FileText,
      iconBg: 'bg-[#502E7A]/20',
      iconColor: 'text-[#A855F7]',
      title: 'Mathematics - Calculus.pdf',
      size: '3.2 MB',
      questions: '10 questions generated',
      date: 'Dec 18'
    }
  ];

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
              onClick={() => setActiveTab(tab)}
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

        {/* Upload Area */}
        <div className="w-full bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[32px] hover:bg-white/10 transition-all group flex flex-col justify-start">
          <div className="flex flex-col items-start gap-[16px] w-[302.26px]">
            <div className="w-[64px] h-[64px] bg-[#2B7FFF]/20 rounded-[16px] flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/30 transition-all border-[0.8px] border-[#2B7FFF]/40">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="#51A2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[20px] leading-[28px] text-white">Upload Files</h3>
              <p className="text-white/60 text-[16px] leading-[24px]">PDF, DOCX, TXT,</p>
            </div>
          </div>
        </div>

        {/* Uploaded Materials */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <h2 className="text-[24px] leading-[32px]">Uploaded Materials</h2>
          
          <div className="flex flex-col gap-[12px]">
            {materials.map((material, index) => {
              const Icon = material.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[16px] hover:bg-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-[16px] flex-1">
                    <div className={`w-[48px] h-[48px] ${material.iconBg} rounded-[12px] flex items-center justify-center shrink-0`}>
                      <Icon className={`w-[20px] h-[20px] ${material.iconColor}`} />
                    </div>
                    
                    <div className="flex flex-col gap-[4px] min-w-0">
                      <h3 className="text-[16px] leading-[24px] text-white overflow-hidden whitespace-nowrap text-ellipsis max-w-[400px]">
                          {material.title}
                      </h3>
                      <div className="flex items-center gap-[16px] text-[14px] leading-[20px] text-white/60">
                        <span>{material.size}</span>
                        <span>•</span>
                        <span>{material.questions}</span>
                        <span>•</span>
                        <span>{material.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[12px] shrink-0">
                    <button className="px-[24px] h-[41.6px] bg-[#502E7A]/20 border-[0.8px] border-[#502E7A]/40 rounded-[10px] text-[#A855F7] text-[16px] leading-[24px] hover:bg-[#502E7A]/30 transition-all whitespace-nowrap">
                      Start Practice
                    </button>
                    <button className="w-[41.6px] h-[41.6px] bg-white/5 rounded-[10px] border-[0.8px] border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0">
                      <Trash2 className="w-[20px] h-[20px] text-white/60" />
                    </button>
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