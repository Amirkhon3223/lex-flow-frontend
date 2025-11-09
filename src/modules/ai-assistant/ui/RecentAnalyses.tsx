import { FileText } from 'lucide-react';
import { AnalysisStatusEnum } from '@/app/types/ai-assistant/ai-assistant.enums';
import type { RecentAnalysisInterface } from '@/app/types/ai-assistant/ai-assistant.interfaces';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

interface RecentAnalysesProps {
  analyses: RecentAnalysisInterface[];
}

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-x  px-3 py-2">
      <div className="p-6">
        <h3 className="tracking-tight mb-4">Недавние анализы</h3>
        <div className="space-y-3">
          {analyses.map((analysis, index) => (
            <div key={index} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm tracking-tight truncate">{analysis.document}</h4>
                  <p className="text-xs text-gray-500">{analysis.case}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={`text-xs border-0 ${
                  analysis.status === AnalysisStatusEnum.SUCCESS ? 'bg-green-100 text-green-700' :
                  analysis.status === AnalysisStatusEnum.WARNING ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {analysis.result}
                </Badge>
                <span className="text-xs text-gray-400">{analysis.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
