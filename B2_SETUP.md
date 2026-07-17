# Backblaze B2 Setup Guide

This guide will help you set up Backblaze B2 for storing PDF files.

## Step 1: Create a Backblaze B2 Account

1. Go to [Backblaze](https://www.backblaze.com/b2/cloud-storage.html)
2. Sign up for a free account
3. Verify your email

## Step 2: Create a B2 Bucket

1. Log in to your Backblaze B2 account
2. Click "Create a Bucket" or go to Buckets section
3. Choose a bucket name (e.g., `notes-rx-pdfs`)
4. Set bucket type to "Private" (for security)
5. Click "Create Bucket"

## Step 3: Create Application Key

1. Go to Account > Application Keys
2. Click "Create Application Key"
3. Set the following:
   - Master or restrict to specific bucket (choose your bucket)
   - Expiration: No expiration or set as needed
   - Capabilities: Needed capabilities are:
     - listBuckets
     - readBuckets
     - writeFiles
     - readFiles
     - deleteFiles
4. Click "Create Key"
5. Copy the Application Key ID and Application Key (save these securely!)

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```
B2_APPLICATION_KEY_ID=your_application_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_ID=your_bucket_id
B2_BUCKET_NAME=your_bucket_name
B2_REGION=us-west-000
```

Where:
- `B2_APPLICATION_KEY_ID`: Application Key ID from Step 3
- `B2_APPLICATION_KEY`: Application Key from Step 3
- `B2_BUCKET_ID`: Found in Bucket settings > Bucket ID
- `B2_BUCKET_NAME`: The bucket name you created
- `B2_REGION`: Your region (default: us-west-000)

## Step 5: Verify Setup

1. Upload a PDF through the admin panel
2. Check Backblaze B2 console to see if files appear in your bucket
3. The files should be:
   - `/pdf/[timestamp]_[random]_[filename].pdf` - Main PDF file
   - `/thumbnails/[timestamp]_[random]_thumbnail.png` - First page thumbnail

## Features

- PDFs are uploaded to B2 with public read URLs
- First page thumbnails are automatically extracted and uploaded
- URLs are stored in MongoDB for each note
- PDFs can be viewed directly from B2 without local storage
- Thumbnails display on note cards for better UX

## Pricing

Backblaze B2 offers:
- 10 GB free storage per month
- Pay as you go after that
- $0.006 per GB/month storage
- Very affordable bandwidth

## Troubleshooting

### Upload fails with auth error
- Verify Application Key ID and Key are correct
- Check B2 console to ensure key is still active

### File appears in B2 but URL doesn't work
- Verify bucket name in env variables
- Ensure B2_REGION is correct for your bucket
- Check that bucket is not rate-limited

### Thumbnails not generating
- Thumbnails are optional - PDFs will still upload
- Placeholder thumbnails are used as fallback
