import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../utils/api';
import { BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface Chapter {
  chapterNumber: number;
  title: string;
  subtopics: string[];
  wordCount: number;
  keyTakeaways: string[];
}

export const OutlineGenerator = () => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('comprehensive');
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<Chapter[] | null>(null);
  const { success, error } = useToast();

  const handleGenerate = async () => {
    if (!title || !topic) {
      error('Missing Information', 'Please provide both title and topic');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/ai/generate-outline', {
        title,
        topic,
        style,
      });

      const result = response.data.data.content;
      setOutline(result.chapters || []);
      success('Outline Generated!', `Created ${result.chapters?.length || 0} chapters`);
    } catch (err: any) {
      error('Generation Failed', err.response?.data?.error?.message || 'Failed to generate outline');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Book/Course Title"
          placeholder="e.g., The Complete Guide to Content Marketing"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label="Main Topic"
          placeholder="e.g., Digital Marketing Strategies"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Writing Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="input"
          >
            <option value="comprehensive">Comprehensive & Detailed</option>
            <option value="concise">Concise & Practical</option>
            <option value="beginner">Beginner-Friendly</option>
            <option value="advanced">Advanced & Technical</option>
            <option value="academic">Academic & Research-Based</option>
          </select>
        </div>

        <Button
          onClick={handleGenerate}
          isLoading={isLoading}
          className="w-full"
        >
          <BookOpen size={18} className="mr-2" />
          Generate Outline
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Generating your outline...</p>
          </div>
        </div>
      )}

      {outline && !isLoading && (
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-lg text-gray-900">Generated Outline</h3>
          <div className="space-y-6">
            {outline.map((chapter) => (
              <div
                key={chapter.chapterNumber}
                className="card-flat"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Est. {chapter.wordCount.toLocaleString()} words
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Subtopics:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {chapter.subtopics.map((subtopic, idx) => (
                        <li key={idx}>{subtopic}</li>
                      ))}
                    </ul>
                  </div>

                  {chapter.keyTakeaways && chapter.keyTakeaways.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Key Takeaways:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {chapter.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOutline(null)}>
              Generate New Outline
            </Button>
            <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(outline, null, 2))}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
