/** Message types for WebSocket communication */

export type CallMode = 'live' | 'practice';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type ObjectionType =
  | 'price'
  | 'timing'
  | 'authority'
  | 'need'
  | 'trust'
  | 'competitor'
  | 'contract'
  | 'custom';

export type CallOutcome =
  | 'meeting_booked'
  | 'follow_up'
  | 'no_interest'
  | 'needs_info';

export interface Persona {
  id: string;
  name: string;
  title: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  industry: string;
}

export interface Scores {
  discovery: number;
  rapport: number;
  objection: number;
  nextSteps: number;
}

export interface KeyMoment {
  text: string;
  type: 'positive' | 'warning' | 'objection';
  timestamp: number;
}

export interface Objection {
  type: ObjectionType;
  text: string;
  suggestedResponse: string;
  timestamp: number;
}

export interface TalkRatio {
  rep: number;
  prospect: number;
}

export interface TranscriptEntry {
  text: string;
  source: 'input' | 'output';
  timestamp: number;
}

export interface DashboardState {
  isConnected: boolean;
  isCallActive: boolean;
  mode: CallMode;
  coachingTips: string[];
  sentiment: Sentiment;
  scores: Scores;
  talkRatio: TalkRatio;
  objections: Objection[];
  keyMoments: KeyMoment[];
  callDuration: number;
  transcript: TranscriptEntry[];
}

export interface CallSummary {
  summary: string;
  overallScore: number;
  outcome: CallOutcome;
  scores: Scores;
  objectionsFaced: string[];
  keyMoments: string[];
  nextSteps: string[];
  talkRatio: TalkRatio;
}

/** WebSocket message from client to server */
export type ClientMessage =
  | { type: 'audio'; data: string }
  | { type: 'image'; data: string; mimeType?: string }
  | { type: 'text'; text: string }
  | { type: 'config'; mode: CallMode; voice?: string; persona?: string }
  | { type: 'end' };

/** WebSocket message from server to client */
export type ServerMessage =
  | { type: 'tool_call'; name: string; args: Record<string, unknown> }
  | { type: 'tool_result'; data: Record<string, unknown> | string }
  | { type: 'text'; text: string }
  | { type: 'audio'; data: string; mimeType?: string }
  | { type: 'transcript'; text: string; source: 'input' | 'output'; partial: boolean }
  | { type: 'turn_complete' }
  | { type: 'usage'; prompt_tokens: number; candidates_tokens: number; total_tokens: number }
  | { type: 'status'; message: string }
  | { type: 'error'; message: string };
