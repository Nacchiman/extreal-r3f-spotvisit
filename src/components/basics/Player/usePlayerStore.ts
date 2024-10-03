import { YoutubeChannel } from "@/libs/util/YoutubeUtil";
import create from "zustand";

export type PlayerInfo = {
  multiplayConnect: boolean;
  multiplayAudio: boolean;
  multiplayGroupName?: string;
  multiplayPlayerId?: string;
  youtubeChannelInfo: YoutubeChannel | undefined;
  currentVideoId: string | undefined;
  nextVideoUrl: string | undefined;
  setYoutubeChannelInfo: (arg: YoutubeChannel | undefined) => void;
  setCurrentVideoUrl: (val: string) => void;
  setNextVideoUrl: (val: string) => void;
  setMultiplayConnect: (val: boolean) => void;
  setMultiplayAudio: (val: boolean) => void;
  setMultiplayGroupName: (val: string | undefined) => void;
  setMultiplayPlayerId: (val: string) => void;
};

const usePlayerInfoStore = create<PlayerInfo>((set) => ({
  multiplayConnect: false,
  multiplayAudio: false,
  multiplayGroupName: "",
  multiplayPlayerId: "",
  youtubeChannelInfo: undefined,
  currentVideoId: "",
  nextVideoUrl: "",
  setMultiplayConnect: (val: boolean) =>
    set((state) => ({ ...state, multiplayConnect: val })),
  setMultiplayAudio: (val: boolean) =>
    set((state) => ({ ...state, multiplayAudio: val })),
  setMultiplayGroupName: (val: string | undefined) =>
    set((state) => ({ ...state, multiplayGroupName: val })),
  setMultiplayPlayerId: (val: string) =>
    set((state) => ({ ...state, multiplayPlayerId: val })),
  setYoutubeChannelInfo: (arg: YoutubeChannel | undefined) =>
    set((state) => ({ ...state, youtubeChannelInfo: arg })),
  setCurrentVideoUrl: (val: string) =>
    set((state) => ({ ...state, currentVideoId: val })),
  setNextVideoUrl: (val: string) =>
    set((state) => ({ ...state, nextVideoUrl: val })),
}));

export default usePlayerInfoStore;
