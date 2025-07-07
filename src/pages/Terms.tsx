import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 prose prose-indigo max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. User Account</h2>
            <p>
              To access certain features of the application, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information.
            </p>

            <h2>4. Privacy</h2>
            <p>
              Your use of this application is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the application and informs users of our data collection practices.
            </p>

            <h2>5. Disclaimer</h2>
            <p>
              The materials on this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>6. Limitations</h2>
            <p>
              In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this application.
            </p>

            <h2>7. Revisions and Errata</h2>
            <p>
              The materials appearing on this application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the application are accurate, complete or current.
            </p>

            <h2>8. Links</h2>
            <p>
              We have not reviewed all of the sites linked to this application and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
            </p>

            <h2>9. Modifications</h2>
            <p>
              We may revise these terms of service at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500">
            ← Go Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms; 