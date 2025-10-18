import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-[#229799]">Privacy Policy</h1>

            <p className="mb-4 text-gray-700">
                <strong>Last updated: October 5, 2025</strong>
            </p>

            <p className="mb-4 text-gray-700">
                <strong>CourseMate</strong> ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website, app, or API services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">1. Information We Collect</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Personal Information:</strong> Name, email address, and payment details when you register, subscribe, or make a payment.</li>
                <li><strong>Uploaded Content:</strong> Audio, video, and document files submitted for transcription or summarization. These files are processed securely and may be deleted after processing.</li>
                <li><strong>Usage Data:</strong> Logs about your interactions with our platform, including feature usage, API calls, device information, and session activity.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>To process and deliver transcription and summarization services.</li>
                <li>To communicate with you about your account, subscription, or support requests.</li>
                <li>To monitor platform usage, improve AI performance, and enhance user experience.</li>
                <li>To comply with legal requirements and prevent misuse or fraud.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">3. Data Security</h2>
            <p className="mb-4 text-gray-700">
                We implement industry-standard security measures to protect your data. All uploaded files are encrypted during transfer and storage. By default, files are deleted after processing. We do not sell or share your files with third parties.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">4. Sharing Information</h2>
            <p className="mb-4 text-gray-700">
                We may share your data with trusted service providers only when necessary to provide our services or comply with legal obligations. We never sell or rent your personal information.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">5. User Rights</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You can access, correct, or delete your personal information by contacting our support team.</li>
                <li>You may request permanent deletion of your account and all associated content.</li>
                <li>You have the right to withdraw consent for data processing where applicable.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">6. Children’s Privacy</h2>
            <p className="mb-4 text-gray-700">
                CourseMate is not intended for children under 13. We do not knowingly collect personal information from children.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">7. Changes to This Policy</h2>
            <p className="mb-4 text-gray-700">
                We may update this Privacy Policy periodically. The updated date will be reflected at the top of this page. Continued use of the platform after updates constitutes acceptance of the revised policy.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">8. Contact Us</h2>
            <p className="mb-4 text-gray-700">
                For questions about this Privacy Policy or to exercise your data rights, please contact us at{" "}
                <a href="mailto:support@coursemate.ai" className="text-[#229799] underline">
                    support@coursemate.ai
                </a>.
            </p>
        </div>
    );
}
