const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Node.js < 22: Supabase Realtime needs the ws package as transport
let wsTransport
try {
  wsTransport = require('ws')
} catch {
  console.warn('Warning: "ws" package not found. Install it for Supabase on Node.js < 22: npm install ws')
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/** Supabase Storage bucket for site logos (must exist and be public for getPublicUrl). */
const SITE_LOGO_BUCKET = process.env.SUPABASE_SITE_LOGO_BUCKET || 'sitelogourl'

/** Supabase Storage bucket for collection images/videos (must exist and be public). */
const COLLECTION_ASSETS_BUCKET = process.env.SUPABASE_COLLECTION_BUCKET || 'collectionassets'

const getJwtRole = (jwt) => {
  if (!jwt || typeof jwt !== 'string') return null
  const parts = jwt.split('.')
  if (parts.length < 2) return null
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return payload.role ?? null
  } catch {
    return null
  }
}

const serviceRoleJwtRole = supabaseServiceRoleKey ? getJwtRole(supabaseServiceRoleKey) : null

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    'Warning: Supabase Storage not fully configured. File upload will fail. ' +
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env ' +
      '(Project Settings → API → service_role secret — not the anon/public key).',
  )
} else if (serviceRoleJwtRole !== 'service_role') {
  console.error(
    `Error: SUPABASE_SERVICE_ROLE_KEY has JWT role "${serviceRoleJwtRole ?? 'unknown'}", expected "service_role". ` +
      'You likely pasted the anon/public key. In Supabase Dashboard → Project Settings → API, copy the service_role secret.',
  )
}

const clientOptions = wsTransport ? { realtime: { transport: wsTransport } } : {}
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  clientOptions,
)

const sanitizeFilename = (originalName, fallback = 'file') => {
  const base = path.basename(originalName || fallback).replace(/[^a-zA-Z0-9._-]/g, '_')
  return base.length > 0 ? base : fallback
}

const assertStorageConfigured = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.',
    )
  }
  if (serviceRoleJwtRole !== 'service_role') {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY is not a service_role key (detected role: "${serviceRoleJwtRole ?? 'unknown'}"). ` +
        'Use the service_role secret from Supabase Dashboard → Project Settings → API, not the anon/public key.',
    )
  }
}

/**
 * Upload a Multer memory-storage file to Supabase Storage.
 * @param {string} bucketName
 * @param {{ buffer: Buffer, mimetype: string, originalname: string }} file
 * @param {{ tenantid?: string, folder?: string }} [options]
 * @returns {{ filePath: string, publicUrl: string }}
 */
const uploadFileToSupabase = async (bucketName, file, options = {}) => {
  assertStorageConfigured()

  const { tenantid, folder = 'files' } = options

  if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
    throw new Error('Invalid upload file: missing buffer. Use multer memoryStorage().')
  }

  const safeName = sanitizeFilename(file.originalname)
  const storagePath = tenantid
    ? `${folder}/${tenantid}/${Date.now()}-${safeName}`
    : `${folder}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(bucketName).upload(storagePath, file.buffer, {
    contentType: file.mimetype || 'application/octet-stream',
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    if (error.message?.includes('row-level security')) {
      throw new Error(
        'Storage upload blocked by RLS. Use SUPABASE_SERVICE_ROLE_KEY (service_role secret from Supabase dashboard), not the anon/public key.',
      )
    }
    throw error
  }

  const filePath = `${bucketName}/${storagePath}`
  const publicUrl = getPublicUrlFromPath(filePath)

  if (!publicUrl) {
    throw new Error('Upload succeeded but public URL could not be generated.')
  }

  return { filePath, publicUrl }
}

/** @deprecated alias — site logos use folder `images` */
const uploadImageToSupabase = async (bucketName, file, tenantid) =>
  uploadFileToSupabase(bucketName, file, { tenantid, folder: 'images' })

/**
 * @param {string} filePath Stored as "bucketName/path/inside/bucket"
 */
const getPublicUrlFromPath = (filePath) => {
  if (!filePath || !supabaseUrl) return null

  try {
    const slashIndex = filePath.indexOf('/')
    if (slashIndex === -1) return null

    const bucketName = filePath.slice(0, slashIndex)
    const objectPath = filePath.slice(slashIndex + 1)
    if (!bucketName || !objectPath) return null

    const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath)
    return data?.publicUrl ?? null
  } catch (err) {
    console.error('Error getting public URL:', err)
    return null
  }
}

/** Ensure asset metadata includes a usable public URL (legacy /uploads or filePath-only rows). */
const enrichAsset = (asset) => {
  if (!asset || typeof asset !== 'object') return asset

  const needsUrl =
    asset.filePath &&
    (!asset.url || (typeof asset.url === 'string' && asset.url.startsWith('/uploads')))

  if (needsUrl) {
    const publicUrl = getPublicUrlFromPath(asset.filePath)
    if (publicUrl) return { ...asset, url: publicUrl }
  }

  return asset
}

const enrichItemAssets = (itemassets) => {
  if (!itemassets || typeof itemassets !== 'object') return itemassets

  return {
    images: (itemassets.images || []).map(enrichAsset),
    videos: (itemassets.videos || []).map(enrichAsset),
  }
}

module.exports = {
  SITE_LOGO_BUCKET,
  COLLECTION_ASSETS_BUCKET,
  uploadFileToSupabase,
  uploadImageToSupabase,
  getPublicUrlFromPath,
  enrichAsset,
  enrichItemAssets,
}
