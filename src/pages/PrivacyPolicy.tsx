import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6 font-['Rakkas'] text-gray-900 dark:text-white">Privacy Policy</h1>
        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
            <p>
              Welcome to myArkived. This Privacy Policy explains how PilarPaladin ("we," "us," or "our") collects, 
              uses, and discloses your information when you use our website and services (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> When you register for an account, we collect your email address 
                and password. This authentication process is securely managed by Supabase, our third-party authentication provider.
              </li>
              <li>
                <strong>User Content:</strong> Data you input into the Service, such as fan-fiction logs, reviews, 
                and ratings.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our Service (e.g., pages visited, 
                time spent).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve our Service.</li>
              <li>To manage your account and authenticate users via Supabase.</li>
              <li>To communicate with you regarding updates, support, or security alerts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Third-Party Services</h2>
            <p>
              We use Supabase for database management and user authentication. Supabase may collect and process your 
              data in accordance with their own privacy policies. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission 
              over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You can do this through your 
              account settings or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact PilarPaladin.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
