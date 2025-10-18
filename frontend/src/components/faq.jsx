import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const faqs = [
  {
    question: "What file formats are supported?",
    answer: "CourseMate supports audio and video files including MP3, MP4, M4A, WAV, FLAC, OGG, and WEBM."
  },
  {
    question: "How accurate are the transcriptions?",
    answer: "Our AI models achieve up to 95% accuracy in clear audio conditions. For noisy recordings, we recommend using good-quality microphones."
  },
  {
    question: "Can I upload long lectures or podcasts?",
    answer: "Yes. You can upload files up to 25MB directly. For larger files, you can split them using tools like FFmpeg before uploading."
  },
  {
    question: "Does CourseMate support multiple languages?",
    answer: "Yes. CourseMate supports transcription in multiple languages and can even detect the spoken language automatically."
  },
  {
    question: "Will my files be stored permanently?",
    answer: "No. Your uploaded files are processed securely and automatically deleted after transcription to protect your privacy."
  },
  {
    question: "Can I get summaries or key points from my transcript?",
    answer: "Absolutely! CourseMate can generate AI-powered summaries, key points, and topic highlights from your transcript."
  },
  {
    question: "Is there a limit to how many files I can upload?",
    answer: "You can upload multiple files sequentially. Batch processing support is coming soon for premium users."
  }
];

const AccordionItem = ({ title, children, isOpen, onClick }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
    <button
      onClick={onClick}
      className="w-full text-left p-6 font-semibold flex justify-between items-center text-gray-900 hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg">{title}</span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#229799] text-white' : 'bg-gray-100 text-[#229799]'}`}>
        {!isOpen ? <FaPlus className="text-sm" /> : <FaTimes className="text-sm" />}
      </div>
    </button>
    {isOpen && (
      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
        {children}
      </div>
    )}
  </div>
);

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Everything you need to know about using CourseMate for transcription and summaries
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <AccordionItem
            key={idx}
            title={faq.question}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            {faq.answer}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
