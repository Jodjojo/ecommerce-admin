import { create } from "zustand";

// Interface configuration
interface useStoreModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useStoreModalStore = create<useStoreModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
