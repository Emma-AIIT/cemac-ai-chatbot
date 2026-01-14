import { cookies } from 'next/headers';
import { Shield, Mail, AlertCircle } from 'lucide-react';

export default async function AccessDeniedPage() {
  const cookieStore = await cookies();
  const blockedIP = cookieStore.get('blocked_ip')?.value ?? 'Unknown';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Access Restricted
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600 leading-relaxed">
                Access to CEMAC Book AI is restricted to authorized users only.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-500 mb-1">Your IP Address:</p>
              <p className="text-sm font-mono text-gray-900">{blockedIP}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Request Access</h2>
            </div>
            <p className="text-gray-600 mb-4">
              If you should have access, contact your administrator with the IP above.
            </p>
            <a
              href="mailto:admin@cemac.com.au?subject=CEMAC AI Access Request"
              className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-medium text-center hover:shadow-lg transition-all"
            >
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
