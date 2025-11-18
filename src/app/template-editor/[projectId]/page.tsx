'use client';

import { useParams } from 'next/navigation';
import TemplateEditor from '@/components/templates/TemplateEditor';
import { useTemplateProject } from '@/hooks/useTemplateProject';

export default function TemplateEditorPage() {
  const params = useParams();
  const { currentProject } = useTemplateProject();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-600">
            The requested project could not be found.
          </p>
          <a
            href="/templates"
            className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Templates
          </a>
        </div>
      </div>
    );
  }

  return <TemplateEditor project={currentProject} />;
}
