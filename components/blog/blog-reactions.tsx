"use client";

import { useEngagementSync } from "@/hooks/use-engagement-sync";
import {
  getUserReaction,
  setUserReaction,
  type ReactionType,
} from "@/lib/engagement-storage";
import { useState, useEffect } from "react";

interface BlogReactionsProps {
  slug: string;
  className?: string;
}

const REACTIONS: Array<{
  type: ReactionType;
  emoji: string;
  label: string;
}> = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "celebrate", emoji: "🎉", label: "Celebrate" },
  { type: "support", emoji: "🤝", label: "Support" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "funny", emoji: "😂", label: "Funny" },
];

export function BlogReactions({ slug, className = "" }: BlogReactionsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [userReaction, setUserReactionState] = useState<ReactionType | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const engagementVersion = useEngagementSync();

  useEffect(() => {
    setIsMounted(true);
    setUserReactionState(getUserReaction(slug));
  }, [slug, engagementVersion]);

  const handleReaction = (type: ReactionType) => {
    const newReaction = userReaction === type ? null : type;
    setUserReaction(slug, newReaction);
    setUserReactionState(newReaction);
    setShowReactions(false);
  };

  // Simulate top 3 reactions with counts (in a real app, this would come from server)
  const topReactions = [
    { type: "like" as ReactionType, emoji: "👍", count: 24 },
    { type: "love" as ReactionType, emoji: "❤️", count: 18 },
    { type: "insightful" as ReactionType, emoji: "💡", count: 12 },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex items-center gap-3">
        {/* Top 3 reactions display */}
        <div className="flex -space-x-1">
          {topReactions.map((reaction, index) => (
            <div
              key={reaction.type}
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm shadow-sm"
              title={`${reaction.count} ${reaction.type}`}
            >
              {reaction.emoji}
              {index === topReactions.length - 1 && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white">
                  {topReactions.reduce((sum, r) => sum + r.count, 0)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Reaction trigger button */}
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            {isMounted && userReaction ? REACTIONS.find(r => r.type === userReaction)?.emoji : "👍"}
            <span className="text-xs text-zinc-400">
              {isMounted && userReaction ? REACTIONS.find(r => r.type === userReaction)?.label : "React"}
            </span>
          </button>

          {isMounted && showReactions && (
            <div className="absolute left-0 top-full z-10 mt-2 flex gap-1 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              {REACTIONS.map((reaction) => (
                <button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                    userReaction === reaction.type
                      ? "bg-violet-600 text-white scale-110"
                      : "bg-white/5 text-2xl hover:bg-white/10 hover:scale-105"
                  }`}
                  title={reaction.label}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
