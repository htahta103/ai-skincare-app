export const getSupabaseImageUrl = (path: string | null | undefined, bucket: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return path;

    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};
