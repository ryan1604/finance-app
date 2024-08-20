import { create } from "zustand";

type OpenSubscriptionState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenSubscription = create<OpenSubscriptionState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
