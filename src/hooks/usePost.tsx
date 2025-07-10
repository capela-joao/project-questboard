import { useState } from "react";
import { createPost, type PostGame } from "../services/PostService";
import { useAuthContext } from "../contexts/authContext";

export function usePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { token } = useAuthContext();

    const submitPost = async (data: PostGame) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createPost(data, token);
            setSuccess(true);
        } catch (err: any) {
            console.error("Erro ao criar post:", err.message);
            setError(err.message || "Erro desconhecido");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitPost, loading, error, success };
}