import React from 'react';

export default function TermsConditions() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-[#229799]">Terms &amp; Conditions</h1>

            <p className="mb-4 text-gray-700">
                <strong>Last updated: October 5, 2025</strong>
            </p>

            <p className="mb-4 text-gray-700">
                Welcome to <strong>CourseMate</strong>. These Terms &amp; Conditions ("Terms") govern your access and use of our
                website, mobile app, and related services (collectively, the "Platform"). By using CourseMate, you agree to comply
                with these Terms. If you do not agree, please discontinue use immediately.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">1. Use of Service</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You must be at least 13 years old to use CourseMate.</li>
                <li>You agree to provide accurate information when registering or using our services.</li>
                <li>You are responsible for safeguarding your account credentials and any activity under your account.</li>
                <li>You must not use CourseMate for unlawful or unauthorized purposes, including misuse of audio or video content.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">2. Uploaded Content</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You may upload only audio or video content you own or have legal rights to process.</li>
                <li>Do not upload sensitive, obscene, or copyrighted materials without authorization.</li>
                <li>Uploaded files are used solely for transcription and summarization purposes and may be automatically deleted after processing.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">3. Payments &amp; Subscriptions</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>All prices are listed in INR and may change based on feature usage or subscription plans.</li>
                <li>Processing begins only after successful payment confirmation.</li>
                <li>Refunds and cancellations are handled as per our <a href="/refund-policy" className="text-[#229799] underline">Refund Policy</a>.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">4. Data Privacy &amp; Security</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>All transcriptions and uploaded files are encrypted during upload and processing.</li>
                <li>We do not share, sell, or publicly distribute user-generated content.</li>
                <li>For more information, please review our <a href="/privacy-policy" className="text-[#229799] underline">Privacy Policy</a>.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">5. Accuracy of Transcriptions</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>CourseMate uses AI models for transcription and summarization. While highly accurate, results may contain errors.</li>
                <li>We recommend reviewing all outputs before using them in academic, professional, or legal contexts.</li>
                <li>CourseMate is not responsible for inaccuracies, omissions, or misinterpretations in transcribed content.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">6. Limitation of Liability</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>CourseMate and its affiliates are not liable for any indirect, incidental, or consequential damages.</li>
                <li>We are not responsible for loss of data, service interruptions, or misuse of the Platform.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">7. Updates to Terms</h2>
            <p className="mb-4 text-gray-700">
                We may update these Terms periodically. Continued use of CourseMate after such updates means you accept the revised Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">8. Contact Us</h2>
            <p className="mb-4 text-gray-700">
                For any questions regarding these Terms, contact us at{" "}
                <a href="mailto:support@coursemate.ai" className="text-[#229799] underline">
                    support@coursemate.ai
                </a>.
            </p>
        </div>
    );
}
