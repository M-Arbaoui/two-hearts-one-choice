-- Create storage bucket for quiz images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quiz-images',
  'quiz-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow anyone to read images (public bucket)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'quiz-images');

-- Allow anyone to upload images
CREATE POLICY "Anyone can upload quiz images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quiz-images');

-- Allow anyone to update their images
CREATE POLICY "Anyone can update quiz images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'quiz-images');

-- Allow anyone to delete quiz images
CREATE POLICY "Anyone can delete quiz images"
ON storage.objects FOR DELETE
USING (bucket_id = 'quiz-images');