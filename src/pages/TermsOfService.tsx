import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-gray-800 dark:text-gray-200">
        <h1 className="text-3xl font-bold mb-6 font-['Rakkas'] text-gray-900 dark:text-white">Terms of Service</h1>
        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using myArkived (the "Service"), developed and maintained by PilarPaladin, you agree to be bound 
              by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You must provide accurate and complete information when creating an account.
              </li>
              <li>
                You are responsible for safeguarding the password that you use to access the Service. Authentication 
                is handled securely via Supabase.
              </li>
              <li>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming 
                aware of any breach of security or unauthorized use of your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Acceptable Use</h2>
            <p className="mb-2">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe upon the rights of others, including intellectual property rights.</li>
              <li>Upload or transmit viruses, malware, or any other malicious code.</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. User Content</h2>
            <p>
              You retain all your rights to any content you submit, post, or display on or through the Service. 
              By providing content, you grant us a license to use, store, and display that content solely for the 
              purpose of providing and improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, 
              including without limitation if you breach the Terms. Upon termination, your right to use the Service 
              will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Limitation of Liability</h2>
            <p>
              In no event shall PilarPaladin be liable for any indirect, incidental, special, consequential, or 
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
              losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant 
              changes. By continuing to access or use our Service after those revisions become effective, you agree to be 
              bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact PilarPaladin.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
