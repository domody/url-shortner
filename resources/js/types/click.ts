type Click = {
    id: number;
    link_id: number;
    link?: Link;
    ip_address: string | null;
    referrer: string | null;
    user_agent: string | null;
    created_at: string;
}
