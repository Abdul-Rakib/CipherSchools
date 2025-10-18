import { FaMicrophoneAlt, FaRobot, FaFileAlt, FaExclamationCircle } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaMicrophoneAlt className="text-2xl text-[#229799]" />,
      title: "Multi-format Uploads",
      description: "Supports audio & video files like MP3, MP4, WAV, M4A, and more"
    },
    {
      icon: <FaRobot className="text-2xl text-[#229799]" />,
      title: "AI-Powered Transcription",
      description: "Accurate speech-to-text powered by advanced AI models"
    },
    {
      icon: <FaFileAlt className="text-2xl text-[#229799]" />,
      title: "Instant Summaries",
      description: "Get key takeaways and topic highlights in seconds"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 whitespace-nowrap">
          Why Choose CourseMate?
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Save hours of note-taking — upload, transcribe, and summarize your lectures or meetings instantly.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6F7F6] rounded-2xl mb-6 group-hover:bg-blue-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats / Highlights */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#229799] mb-1">95%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">10x</div>
            <div className="text-sm text-gray-600">Faster than manual notes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Upload & Transcribe Anytime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">15+</div>
            <div className="text-sm text-gray-600">Supported Formats</div>
          </div>
        </div>
      </div>

      {/* Policy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <FaExclamationCircle className="text-amber-600 text-lg" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Responsible Use Policy</h4>
            <p className="text-amber-700 text-sm leading-relaxed">
              Please ensure your uploaded content adheres to our community guidelines.
              CourseMate does not allow transcriptions of copyrighted, sensitive, or illegal material.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
