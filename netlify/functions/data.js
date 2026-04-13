const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL       = process.env.SUPABASE_URL;
const SUPABASE_KEY       = process.env.SUPABASE_KEY;
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;

const HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

const DEFAULT_DATA = {
    home:    { desc_en: '', desc_ar: '' },
    about:   { desc_en: '', desc_ar: '', name_en: '', name_ar: '',
               title_en: '', title_ar: '', loc_en: '', loc_ar: '', email: '' },
    skills:  [],
    projects:[],
    edu:     { desc_en: '', desc_ar: '' },
    contact: { email: '', phone: '', loc_en: '', loc_ar: '',
               linkedin: '', coding_en: '', coding_ar: '' }
};

exports.handler = async function(event) {

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: HEADERS, body: '' };
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ error: 'SUPABASE_URL أو SUPABASE_KEY غير محددة' })
        };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── GET ──────────────────────────────────────────────
    if (event.httpMethod === 'GET') {
        try {
            const { data: row, error } = await supabase
                .from('portfolio_data')
                .select('data')
                .eq('id', 1)
                .maybeSingle();

            if (error) throw error;

            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify(row?.data || DEFAULT_DATA)
            };
        } catch (err) {
            return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
        }
    }

    // ── POST ─────────────────────────────────────────────
    if (event.httpMethod === 'POST') {
        try {
            const { password, data: newData } = JSON.parse(event.body || '{}');

            if (password !== DASHBOARD_PASSWORD) {
                return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) };
            }

            const { error } = await supabase
                .from('portfolio_data')
                .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() }, { onConflict: 'id' });

            if (error) throw error;

            return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ success: true }) };
        } catch (err) {
            return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
        }
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
};