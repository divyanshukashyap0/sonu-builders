import { useToast } from '../context/ToastContext';

export const useConfirmDelete = () => {
    const { showToast } = useToast();

    const confirmDelete = async (
        onConfirm: () => Promise<void>,
        options: {
            firstMessage?: string;
            secondMessage?: string;
            successMessage?: string;
            errorMessage?: string;
        } = {}
    ) => {
        const {
            firstMessage = "Are you sure you want to delete this item?",
            secondMessage = "ARE YOU ABSOLUTELY SURE? This action is irreversible.",
            successMessage = "Item deleted successfully",
            errorMessage = "Failed to delete item"
        } = options;

        if (window.confirm(firstMessage)) {
            if (window.confirm(secondMessage)) {
                try {
                    await onConfirm();
                    showToast(successMessage, 'success');
                } catch (error) {
                    console.error("Delete error:", error);
                    showToast(errorMessage, 'error');
                }
            }
        }
    };

    return { confirmDelete };
};
