import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DownloadRequest {
  url: string
  format: string
  quality: string
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

    const { url, format, quality }: DownloadRequest = await req.json()

    if (!url || !format || !quality) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: url, format, quality' }),
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

    // Create download record
    const { data: download, error: insertError } = await supabaseClient
      .from('downloads')
      .insert({
        user_id: user.id,
        url,
        platform,
        format,
        quality,
        status: 'processing'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating download record:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create download record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Start background processing
    EdgeRuntime.waitUntil(processDownload(download.id, url, format, quality, platform, user.id, supabaseClient))

    return new Response(
      JSON.stringify({ 
        success: true, 
        downloadId: download.id,
        message: 'Download started successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in download-video function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function processDownload(
  downloadId: string,
  url: string,
  format: string,
  quality: string,
  platform: string,
  userId: string,
  supabaseClient: any
) {
  try {
    console.log(`Processing download ${downloadId} for ${platform}`)

    // For demo purposes, we'll simulate video processing
    // In a real implementation, you would use tools like yt-dlp here
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock video metadata
    const mockMetadata = {
      title: `Sample ${platform} Video`,
      duration: 180, // 3 minutes
      file_size: 15728640, // 15MB
      thumbnail_url: 'https://via.placeholder.com/320x180.jpg'
    }

    // Generate mock file path
    const fileName = `${downloadId}.${format}`
    const filePath = `${userId}/${fileName}`

    // Update download status to completed
    const { error: updateError } = await supabaseClient
      .from('downloads')
      .update({
        status: 'completed',
        title: mockMetadata.title,
        duration: mockMetadata.duration,
        file_size: mockMetadata.file_size,
        file_path: filePath,
        thumbnail_url: mockMetadata.thumbnail_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', downloadId)

    if (updateError) {
      console.error('Error updating download status:', updateError)
      await supabaseClient
        .from('downloads')
        .update({
          status: 'failed',
          error_message: 'Failed to update download record',
          updated_at: new Date().toISOString()
        })
        .eq('id', downloadId)
    }

    // Update user statistics
    await supabaseClient
      .from('profiles')
      .update({
        total_downloads: supabaseClient.raw('total_downloads + 1'),
        storage_used: supabaseClient.raw(`storage_used + ${mockMetadata.file_size}`)
      })
      .eq('user_id', userId)

    console.log(`Download ${downloadId} completed successfully`)

  } catch (error) {
    console.error(`Error processing download ${downloadId}:`, error)
    
    // Update download status to failed
    await supabaseClient
      .from('downloads')
      .update({
        status: 'failed',
        error_message: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', downloadId)
  }
}