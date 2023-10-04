const supabase = require('@supabase/supabase-js')

const supabaseUrl = "https://gnysjpeeumstgwzllknd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXNqcGVldW1zdGd3emxsa25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxNzU1OTQsImV4cCI6MjAwOTc1MTU5NH0.xGiRua3bBZT0Y_X4Rqc_vJQXMIL90ZJ_bZqPWfeN7F8";

const cliente = supabase.createClient(supabaseUrl, supabaseKey);

module.exports = cliente