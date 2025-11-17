import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BookOpen, Zap, Palette, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Create & Sell Digital Products
            <span className="block text-primary-600 mt-2">Powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform for creating ebooks, courses, and guides. Use AI to generate content,
            design covers, and build your digital product empire.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <BookOpen className="text-primary-600" size={24} />,
    title: 'Smart Editor',
    description: 'Rich text editor with AI writing assistant to help you create engaging content.',
  },
  {
    icon: <Zap className="text-primary-600" size={24} />,
    title: 'AI-Powered',
    description: 'Generate ideas, outlines, and content with cutting-edge AI technology.',
  },
  {
    icon: <Palette className="text-primary-600" size={24} />,
    title: 'Design Studio',
    description: 'Create stunning covers with templates and AI image generation.',
  },
  {
    icon: <TrendingUp className="text-primary-600" size={24} />,
    title: 'Analytics',
    description: 'Track your progress and optimize your digital products for success.',
  },
];
