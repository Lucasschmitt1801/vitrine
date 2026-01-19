import { createClient } from '@supabase/supabase-js';

// Vá ao painel do Supabase > Project Settings > API e copie os valores reais
const supabaseUrl = 'https://bmsszvykxlexktpocgea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc3N6dnlreGxleGt0cG9jZ2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTA4NzksImV4cCI6MjA4MzU2Njg3OX0.lfWiTHgjaJbJ8UGrTw143gJB2x3OU2L-9LNDdM52m_4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);