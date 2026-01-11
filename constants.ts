import { Quote, QuadrantType } from './types';

export const STOIC_QUOTES: Quote[] = [
  { text: "我们受到的折磨，往往更多来自想象，而非现实。", author: "塞内卡" },
  { text: "你生活的幸福程度，取决于你思想的质量。", author: "马可·奥勒留" },
  { text: "不能主宰自己的人，便不自由。", author: "爱比克泰德" },
  { text: "不要再争论好人应该是什么样了，去做好人吧。", author: "马可·奥勒留" },
  { text: "贫穷的不是拥有太少的人，而是渴望更多的人。", author: "塞内卡" },
  { text: "若求宁静，少作无用之事。", author: "马可·奥勒留" },
  { text: "内心的平静是自我的最高成就。", author: "禅宗谚语" }
];

export const QUADRANT_CONFIG = {
  [QuadrantType.A]: {
    title: "立即去做",
    subtitle: "重要且紧急",
    color: "bg-rose-100/40 border-rose-200/60 text-rose-900",
    iconColor: "text-rose-400"
  },
  [QuadrantType.B]: {
    title: "计划日程",
    subtitle: "重要不紧急",
    color: "bg-blue-100/40 border-blue-200/60 text-blue-900",
    iconColor: "text-blue-400"
  },
  [QuadrantType.C]: {
    title: "委托/批处理",
    subtitle: "紧急不重要",
    color: "bg-amber-100/40 border-amber-200/60 text-amber-900",
    iconColor: "text-amber-400"
  },
  [QuadrantType.D]: {
    title: "彻底删除",
    subtitle: "不重要不紧急",
    color: "bg-stone-200/40 border-stone-300/60 text-stone-600",
    iconColor: "text-stone-400"
  }
};