import { Navbar } from '../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Settings page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
