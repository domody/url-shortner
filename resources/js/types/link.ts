type Link = {
    id: number;
    user_id: number;
    original_url: string;
    code: string;
    clicks_count: number;
    clicks?: Click[];
    created_at: string;
    updated_at: string;
}
