import { useCallback, useRef, useState } from 'react';
import type {
  DashboardState,
  Objection,
  KeyMoment,
  Sentiment,
  ServerMessage,
  CallMode,
  TranscriptEntry,
} from '../lib/types';

const initialState: DashboardState = {
  isConnected: false,
  isCallActive: false,
  mode: 'live',
  coachingTips: [],
  sentiment: 'neutral',
  scores: { discovery: 0, rapport: 0, objection: 0, nextSteps: 0 },
  talkRatio: { rep: 50, prospect: 50 },
  objections: [],
  keyMoments: [],
  callDuration: 0,
  transcript: [],
};

export function useCallMetrics() {
  const [state, setState] = useState<DashboardState>(initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startCall = useCallback((mode: CallMode) => {
    setState((s) => ({
      ...initialState,
      isConnected: s.isConnected,
      isCallActive: true,
      mode,
    }));
    timerRef.current = setInterval(() => {
      setState((s) => ({ ...s, callDuration: s.callDuration + 1 }));
    }, 1000);
  }, []);

  const endCall = useCallback(() => {
    clearInterval(timerRef.current);
    setState((s) => ({ ...s, isCallActive: false }));
  }, []);

  const setConnected = useCallback((connected: boolean) => {
    setState((s) => ({ ...s, isConnected: connected }));
  }, []);

  const handleServerMessage = useCallback((msg: ServerMessage) => {
    if (msg.type === 'tool_call') {
      const { name, args } = msg;

      if (name === 'update_dashboard') {
        setState((s) => {
          const updates: Partial<DashboardState> = {};

          if (args.coaching_tip) {
            updates.coachingTips = [args.coaching_tip as string, ...s.coachingTips].slice(0, 10);
          }
          if (args.sentiment) {
            updates.sentiment = args.sentiment as Sentiment;
          }
          if ((args.discovery_score as number) >= 0) {
            updates.scores = { ...s.scores, discovery: args.discovery_score as number };
          }
          if ((args.rapport_score as number) >= 0) {
            updates.scores = { ...(updates.scores || s.scores), rapport: args.rapport_score as number };
          }
          if ((args.objection_score as number) >= 0) {
            updates.scores = { ...(updates.scores || s.scores), objection: args.objection_score as number };
          }
          if ((args.next_steps_score as number) >= 0) {
            updates.scores = { ...(updates.scores || s.scores), nextSteps: args.next_steps_score as number };
          }
          if ((args.rep_talk_pct as number) >= 0) {
            updates.talkRatio = {
              rep: args.rep_talk_pct as number,
              prospect: 100 - (args.rep_talk_pct as number),
            };
          }
          if (args.key_moment) {
            const moment: KeyMoment = {
              text: args.key_moment as string,
              type: (args.key_moment_type as KeyMoment['type']) || 'positive',
              timestamp: Date.now() / 1000,
            };
            updates.keyMoments = [...s.keyMoments, moment];
          }

          return { ...s, ...updates };
        });
      }

      if (name === 'log_objection') {
        const objection: Objection = {
          type: args.objection_type as Objection['type'],
          text: args.objection_text as string,
          suggestedResponse: args.suggested_response as string,
          timestamp: Date.now() / 1000,
        };
        setState((s) => ({
          ...s,
          objections: [...s.objections, objection],
        }));
      }
    }

    // Transcriptions — only add finalized (non-partial) entries
    if (msg.type === 'transcript' && !msg.partial && msg.text.trim()) {
      const entry: TranscriptEntry = {
        text: msg.text,
        source: msg.source,
        timestamp: Date.now() / 1000,
      };
      setState((s) => ({
        ...s,
        transcript: [...s.transcript, entry],
      }));
    }
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setState(initialState);
  }, []);

  return {
    state,
    startCall,
    endCall,
    setConnected,
    handleServerMessage,
    reset,
  };
}
