# B2 Integration - Quick Start Guide

## 5-Minute Setup

### Step 1: Create Free B2 Account (1 min)
Go to https://www.backblaze.com/b2/cloud-storage.html and sign up for free.

### Step 2: Create Bucket (2 min)
1. Log in to B2 Dashboard
2. Click "Create a Bucket"
3. Name it `notes-rx` (or any name)
4. Set type to "Private"
5. Click "Create Bucket"
6. Note the Bucket ID and Bucket Name

### Step 3: Create API Key (1 min)
1. Go to Account > Application Keys
2. Click "Create Application Key"
3. Capabilities needed:
   - listBuckets
   - readBuckets
   - writeFiles
   - readFiles
   - deleteFiles
4. Copy Application Key ID and Key
5. Store securely!

### Step 4: Configure Environment (1 min)
Add to `.env.local`:
```
B2_APPLICATION_KEY_ID=your_key_id_here
B2_APPLICATION_KEY=your_app_key_here
B2_BUCKET_ID=your_bucket_id
B2_BUCKET_NAME=notes-rx
B2_REGION=us-west-000
```

### Step 5: Test Upload (0 min - already working!)
1. Go to Admin Panel > Upload Notes
2. Upload a PDF
3. If successful, file will appear in B2 Dashboard
4. Thumbnail will display on Notes page

## That's it!

Your application now:
- Stores PDFs in the cloud
- Generates thumbnails automatically
- Displays previews on note cards
- Streams PDFs from B2 without local storage

## What's happening:
- PDFs uploaded to B2 cloud storage
- First page extracted as thumbnail (shown on cards)
- Files organized in `/pdf` and `/thumbnails` folders
- Public URLs stored in database
- PDFs viewed directly from B2

## Cost?
- 10 GB free storage per month
- $0.006 per GB after that
- Very affordable for note storage

## Problems?
Check `B2_SETUP.md` for detailed troubleshooting.

Enjoy cloud-based note storage! 📚☁️
