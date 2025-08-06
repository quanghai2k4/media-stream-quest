import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoInfoRequest {
  url: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { url }: VideoInfoRequest = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Detect platform from URL
    const detectPlatform = (url: string): string => {
      if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
      if (url.includes('tiktok.com')) return 'TikTok'
      if (url.includes('instagram.com')) return 'Instagram'
      if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
      if (url.includes('facebook.com')) return 'Facebook'
      return 'Unknown'
    }

    const platform = detectPlatform(url)

    if (platform === 'Unknown') {
      return new Response(
        JSON.stringify({ error: 'Unsupported platform' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In a real implementation, you would use tools like yt-dlp to extract video info
    // For demo purposes, we'll return mock data
    const mockVideoInfo = {
      title: `Sample ${platform} Video`,
      description: 'This is a sample video description for demonstration purposes.',
      duration: 180, // 3 minutes in seconds
      thumbnail: 'https://via.placeholder.com/320x180.jpg',
      uploader: 'Sample Creator',
      upload_date: '2024-01-15',
      view_count: 1234567,
      platform: platform,
      available_formats: [
        { format: 'mp4', quality: '1080p', file_size: '~25MB' },
        { format: 'mp4', quality: '720p', file_size: '~15MB' },
        { format: 'mp4', quality: '480p', file_size: '~8MB' },
        { format: 'mp3', quality: '320kbps', file_size: '~4MB' },
        { format: 'mp3', quality: '128kbps', file_size: '~2MB' }
      ]
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: mockVideoInfo
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-video-info function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})