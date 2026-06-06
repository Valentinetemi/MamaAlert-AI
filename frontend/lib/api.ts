const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalyzeSymptomsRequest {
  text: string;
  lang?: string;
  weeks?: number;
}

export interface AnalyzeSymptomsResponse {
  symptom: string;
  analysis: string;
  urgency: 'safe' | 'caution' | 'emergency';
  recommendations: string[];
  source?: 'safety_rules' | 'gemini' | 'fallback' | 'offline';
  error?: string;
  debug?: string | number;
}

export async function analyzeSymptoms(payload: AnalyzeSymptomsRequest): Promise<AnalyzeSymptomsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`MamaAlert API responded with ${response.status}`);
  }

  return response.json();
}
