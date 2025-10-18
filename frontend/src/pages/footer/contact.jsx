import React, { useState } from 'react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Typically here you'd send the form data to your backend or email service
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
                <div className="h-1 w-20 bg-[#229799] mx-auto rounded-full mb-4"></div>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Have questions about CourseMate's transcription, summarization, or API services? We’re here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="md:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#229799] to-[#1B787A] p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
                        <p className="text-white/90 mb-6">
                            Reach out for support, API inquiries, or general questions.
                        </p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E6F6F6] flex items-center justify-center text-[#229799]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-gray-700">Email</h3>
                                <a href="mailto:support@coursemate.ai" className="text-[#229799] hover:underline text-base">
                                    support@coursemate.ai
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E6F6F6] flex items-center justify-center text-[#229799]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-gray-700">Phone</h3>
                                <a href="tel:+911234567890" className="text-[#229799] hover:underline text-base">
                                    +91 1234567890
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E6F6F6] flex items-center justify-center text-[#229799]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-gray-700">Address</h3>
                                <p className="text-gray-600">CourseMate HQ, LPU Campus, Punjab</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={form.subject || ''}
                                onChange={handleChange}
                                placeholder="e.g., API integration or transcription issue"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Write your message here..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#229799] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1B787A] transform transition duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#229799] focus:ring-opacity-50"
                        >
                            Send Message
                        </button>

                        {submitted && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                                <svg className="h-5 w-5 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 font-medium">Thank you! Your message has been sent successfully.</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
