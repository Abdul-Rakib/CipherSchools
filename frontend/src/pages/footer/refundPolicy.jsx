import React from 'react';

export default function RefundPolicy() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-[#229799]">Refund Policy</h1>

            <p className="mb-4 text-gray-700">
                <strong>Last updated: October 5, 2025</strong>
            </p>

            <p className="mb-4 text-gray-700">
                At <strong>CourseMate</strong>, we value transparency and customer satisfaction. This Refund Policy explains when you may be eligible for a refund
                and the conditions under which payments are non-refundable.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">1. Cancellation Policy</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You may cancel a transcription or summarization request before processing begins.</li>
                <li>Once the AI model has started processing your file, cancellations are not possible.</li>
                <li>To cancel an order, please contact our support team immediately at <a href="mailto:support@coursemate.ai" className="text-[#229799] underline">support@coursemate.ai</a>.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">2. Refund Eligibility</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Refunds are only available for transactions where processing has not yet started.</li>
                <li>If you are charged but your file cannot be processed due to technical issues on our end, you will receive a full refund.</li>
                <li>Refunds will not be issued for low-quality input (e.g., unclear audio, background noise) that leads to imperfect results.</li>
                <li>Refunds are also not applicable for dissatisfaction with AI-generated accuracy or summaries unless there was a clear system error.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">3. Technical or Billing Errors</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>If you believe you were incorrectly charged or encountered a billing error, contact our support within 7 days of the transaction.</li>
                <li>After verification, eligible refunds will be processed promptly to your original payment method.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">4. Refund Process</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Once approved, refunds are issued to your original payment method within 5–7 business days.</li>
                <li>You will receive an email confirmation once the refund has been initiated.</li>
                <li>Processing times may vary depending on your payment provider or bank.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">5. No Refund Situations</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>No refunds will be granted for misuse of the platform or violation of our <a href="/terms-and-condition" className="text-[#229799] underline">Terms &amp; Conditions</a>.</li>
                <li>Refunds are not available for free credits, promotional usage, or expired balance.</li>
                <li>We do not provide refunds for partial use of subscription periods.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-2 text-[#229799]">6. Contact Us</h2>
            <p className="mb-4 text-gray-700">
                If you have any questions about this Refund Policy or wish to request a refund, please contact our team at{" "}
                <a href="mailto:support@coursemate.ai" className="text-[#229799] underline">
                    support@coursemate.ai
                </a>.
            </p>
        </div>
    );
}
